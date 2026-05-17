import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product' // Need to register Product if populated

export async function POST(req) {
    try {
        const body = await req.json()
        const { orderNumber, phone } = body

        // Validate inputs
        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({ success: false, message: 'Invalid or missing Order Number' }, { status: 400 })
        }
        if (!phone || typeof phone !== 'string') {
            return NextResponse.json({ success: false, message: 'Invalid or missing Phone Number' }, { status: 400 })
        }

        // Clean inputs to avoid nosql injection (Mongoose handles most, but good practice)
        const safeOrderNumber = orderNumber.trim()
        const safePhone = phone.trim()

        await dbConnect()

        // Find the order by orderNumber
        const order = await Order.findOne({ orderNumber: safeOrderNumber }).lean()

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found with this ID' }, { status: 404 })
        }

        // Verify phone number matches the shipping address phone
        if (order.shippingAddress?.phone !== safePhone) {
            // We return a generic error so attackers can't guess valid order numbers easily
            return NextResponse.json({ success: false, message: 'Order not found or phone number does not match' }, { status: 404 })
        }

        // Return only non-sensitive data required for tracking
        const trackingData = {
            orderNumber: order.orderNumber,
            status: order.status,
            createdAt: order.createdAt,
            total: order.total,
            items: order.items?.map(item => ({
                name: item.name,
                quantity: item.quantity,
                image: item.image,
            })) || []
        }

        return NextResponse.json({
            success: true,
            data: trackingData
        }, { status: 200 })

    } catch (error) {
        console.error('Track Order Error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
