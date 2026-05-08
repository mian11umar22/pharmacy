import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAuth } from '@/lib/auth'

// GET /api/users/stats — get stats for logged in user (includes guest orders matched by email)
export async function GET(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const userId = auth.user._id
        const userEmail = auth.user.email

        // Match orders by userId OR by email (catches guest orders before registration)
        const filter = {
            $or: [
                { user: userId },
                { 'shippingAddress.email': userEmail }
            ]
        }

        const totalOrders = await Order.countDocuments(filter)
        const totalDelivered = await Order.countDocuments({ ...filter, status: 'delivered' })

        return NextResponse.json({
            stats: {
                totalOrders,
                totalDelivered
            }
        })
    } catch (error) {
        console.error('User stats error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

