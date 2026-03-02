import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { requireAuth } from '@/lib/auth'
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '@/lib/email'

export async function GET(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const status = searchParams.get('status')

        // Build filter
        const filter = {}
        if (auth.user.role !== 'admin') {
            filter.user = auth.user._id
        }
        if (status) filter.status = status

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
                userEmail = auth.user.email
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

        const order = await Order.create({
            user: userId,
            items: body.items,
            subtotal: body.subtotal,
            deliveryFee: body.deliveryFee || 0,
            total: body.total,
            shippingAddress: body.shippingAddress,
            paymentMethod: body.paymentMethod || 'cod',
            notes: body.notes || '',
        })

        // Send emails (non-blocking)
        console.log(`🛒 Order created: ${order.orderNumber}. Sending notifications...`)
        sendOrderConfirmation(order, userEmail).catch(err => console.error('Confirmation email error:', err))
        sendAdminNewOrderNotification(order).catch(err => console.error('Admin notification email error:', err))

        return NextResponse.json({ success: true, order }, { status: 201 })
    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
