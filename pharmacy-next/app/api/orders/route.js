import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import Coupon from '@/models/Coupon'
import CoinTransaction from '@/models/CoinTransaction'
import Setting from '@/models/Setting'
import { requireAuth } from '@/lib/auth'
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '@/lib/email'
import Product from '@/models/Product'

export async function GET(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const status = searchParams.get('status')
        const dateFilter = searchParams.get('dateFilter')

        // Build filter
        const filter = {}
        if (auth.user.role !== 'admin') {
            // Match orders by userId OR by email (catches guest orders with matching email)
            filter.$or = [
                { user: auth.user._id },
                { 'shippingAddress.email': auth.user.email }
            ]
        }
        if (status) filter.status = status

        // Date filter
        if (dateFilter) {
            const now = new Date()
            if (dateFilter === 'today') {
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                filter.createdAt = { $gte: start }
            } else if (dateFilter === 'week') {
                const start = new Date(now)
                start.setDate(now.getDate() - 7)
                filter.createdAt = { $gte: start }
            } else if (dateFilter === 'month') {
                const start = new Date(now)
                start.setDate(now.getDate() - 30)
                filter.createdAt = { $gte: start }
            }
        }

        const skip = (page - 1) * limit
        const total = await Order.countDocuments(filter)
        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) })
    } catch (error) {
        console.error('Get orders error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// POST /api/orders — create order (Allows Guest Checkout)
export async function POST(request) {
    try {
        await dbConnect()
        const body = await request.json()

        // Check if user is logged in (optional for guest orders)
        let userId = null
        let userEmail = body.shippingAddress?.email

        try {
            const auth = await requireAuth(request)
            if (!auth.error) {
                userId = auth.user._id
                userEmail = body.shippingAddress?.email || auth.user.email
            }
        } catch (e) {
            // Not logged in or auth error — continue as guest
        }

        // If not logged in but email matches an existing user, link it!
        if (!userId && userEmail) {
            const existingUser = await User.findOne({ email: userEmail.toLowerCase() }).select('_id')
            if (existingUser) {
                userId = existingUser._id
            }
        }

        if (!userEmail) {
            return NextResponse.json({ error: 'Email is required for order' }, { status: 400 })
        }

        // Independently re-verify prescription requirements against the DB —
        // the cart/checkout UI's own gating can be bypassed by calling this
        // route directly, so it must never be trusted alone.
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 })
        }

        const productIds = body.items.map(item => item.product).filter(Boolean)
        const products = await Product.find({ _id: { $in: productIds } }).select('name requiresPrescription')
        const productMap = new Map(products.map(p => [p._id.toString(), p]))

        const missingPrescriptionItems = body.items.filter(item => {
            const product = productMap.get(String(item.product))
            return product?.requiresPrescription && !item.prescriptionUrl
        })

        if (missingPrescriptionItems.length > 0) {
            return NextResponse.json({
                error: `A prescription image is required for: ${missingPrescriptionItems.map(i => i.name).join(', ')}`,
            }, { status: 400 })
        }

        const order = await Order.create({
            user: userId,
            items: body.items,
            subtotal: body.subtotal,
            deliveryFee: body.deliveryFee || 0,
            total: body.total,
            shippingAddress: body.shippingAddress,
            paymentMethod: body.paymentMethod || 'cod',
            notes: body.notes || '',
            couponCode: body.couponCode || null,
            discountAmount: body.discountAmount || 0,
        })

        // Redeem coins toward this order's discount (logged-in users only) —
        // deduction happens here, at order placement, not when "Apply" was
        // clicked, so nothing is lost if the user abandons checkout.
        try {
            const coinsToRedeem = Number(body.coinsToRedeem) || 0
            if (coinsToRedeem > 0 && userId) {
                const coinToRupeeSetting = await Setting.findOne({ key: 'coin_to_rupee_rate' })
                const coinToRupeeRate = coinToRupeeSetting ? coinToRupeeSetting.value : 1

                const maxCoinsSetting = await Setting.findOne({ key: 'max_coins_per_order' })
                const maxCoinsPerOrder = maxCoinsSetting ? maxCoinsSetting.value : 500

                const redeemUser = await User.findById(userId)

                if (redeemUser && coinsToRedeem <= (redeemUser.coinBalance || 0) && coinsToRedeem <= maxCoinsPerOrder) {
                    await CoinTransaction.create({
                        userId,
                        type: 'redeemed',
                        reason: 'shopping',
                        coins: coinsToRedeem,
                        orderId: order._id,
                    })

                    redeemUser.coinBalance = (redeemUser.coinBalance || 0) - coinsToRedeem
                    await redeemUser.save()
                }
            }
        } catch (redeemError) {
            console.error('Coin redemption error:', redeemError)
        }

        // Award shopping coins to logged-in users only (guest checkouts have no account to credit)
        try {
            if (userId) {
                const coinsPerHundredSetting = await Setting.findOne({ key: 'coins_per_100_rupees' })
                const coinsPerHundred = coinsPerHundredSetting ? coinsPerHundredSetting.value : 1

                const coins = Math.floor(order.total / 100) * coinsPerHundred

                if (coins > 0) {
                    await CoinTransaction.create({
                        userId,
                        type: 'earned',
                        reason: 'shopping',
                        coins,
                        orderId: order._id,
                    })

                    const orderUser = await User.findById(userId)
                    if (orderUser) {
                        orderUser.coinBalance = (orderUser.coinBalance || 0) + coins
                        await orderUser.save()
                    }
                }
            }
        } catch (coinError) {
            console.error('Shopping coin award error:', coinError)
        }

        // Increment coupon usedCount if a coupon was applied
        if (body.couponCode) {
            await Coupon.findOneAndUpdate(
                { code: body.couponCode.toUpperCase() },
                { $inc: { usedCount: 1 } }
            ).catch(err => console.error('Coupon usedCount update error:', err))
        }

        // Increment salesCount for each product in the order
        if (body.items && Array.isArray(body.items)) {
            const salesUpdates = body.items.map(item => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { salesCount: item.quantity || 1 } }
                }
            }))
            if (salesUpdates.length > 0) {
                await Product.bulkWrite(salesUpdates).catch(err => console.error('SalesCount update error:', err))
            }
        }
// Dummy comment to force Vercel build
console.log(`🛒 Order created: ${order.orderNumber}. Sending notifications...`)
        // Send emails (awaited so the serverless function doesn't exit before they complete)
        console.log(`🛒 Order created: ${order.orderNumber}. Sending notifications...`)
        await Promise.all([
            sendOrderConfirmation(order, userEmail).catch(err => console.error('Confirmation email error:', err)),
            sendAdminNewOrderNotification(order).catch(err => console.error('Admin notification email error:', err)),
        ])

        return NextResponse.json({ success: true, order }, { status: 201 })
    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
