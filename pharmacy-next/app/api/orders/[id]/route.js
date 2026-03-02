import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { sendOrderStatusUpdate } from '@/lib/email'

// GET /api/orders/[id] — order detail
export async function GET(request, { params }) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const order = await Order.findById(id).populate('user', 'name email phone')

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Only allow owner or admin to view
        if (auth.user.role !== 'admin' && order.user._id.toString() !== auth.user._id.toString()) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Get order error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// PUT /api/orders/[id] — admin, update order status
export async function PUT(request, { params }) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const { status } = await request.json()

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('user', 'name email')

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Send status update email to customer (non-blocking)
        if (order.user?.email) {
            sendOrderStatusUpdate(order, order.user.email).catch(console.error)
        }

        return NextResponse.json({ success: true, order })
    } catch (error) {
        console.error('Update order error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
