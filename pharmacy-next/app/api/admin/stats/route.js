import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

export async function GET(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()

        // 1. Total Orders
        const totalOrders = await Order.countDocuments()

        // 2. Total Revenue (Delivered only)
        const revenueData = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ])
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0

        // 3. Pending Orders
        const pendingOrders = await Order.countDocuments({ status: 'pending' })

        // 4. Total Products
        const totalProducts = await Product.countDocuments()

        // 5. Total Customers
        const totalUsers = await User.countDocuments({ role: 'customer' })

        // 6. Recent Orders (Top 5)
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()

        return NextResponse.json({
            stats: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                totalProducts,
                totalUsers
            },
            recentOrders: recentOrders.map(o => ({
                id: o.orderNumber || o._id,
                customer: o.shippingAddress?.name || o.user?.name || 'Guest',
                total: o.total,
                status: o.status,
                date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                method: o.paymentMethod?.toUpperCase() || 'COD'
            }))
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
