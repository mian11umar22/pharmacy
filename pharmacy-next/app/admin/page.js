"use client"

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, Users, ChevronRight, ArrowUpRight, Truck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
    processing: { label: 'Processing', color: 'bg-blue-50 text-blue-600' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success' },
    cancelled: { label: 'Cancelled', color: 'bg-danger/10 text-danger' },
}

export default function AdminDashboard() {
    const [deliveryFee, setDeliveryFee] = useState('150')
    const [isSavingFee, setIsSavingFee] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            totalProducts: 0,
            totalUsers: 0
        },
        recentOrders: []
    })

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true)

            // Fetch Stats and Recent Orders
            const statsRes = await fetch('/api/admin/stats')
            const statsData = await statsRes.json()
            if (statsRes.ok) {
                setDashboardData(statsData)
            }

            // Fetch Settings (Delivery Fee)
            const settingsRes = await fetch('/api/admin/settings')
            const settingsData = await settingsRes.json()
            if (settingsRes.ok && settingsData.settings?.delivery_fee) {
                setDeliveryFee(settingsData.settings.delivery_fee.toString())
            }

        } catch (error) {
            console.error('Fetch dashboard error:', error)
            toast.error('Failed to load dashboard data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const handleSaveDelivery = async () => {
        try {
            setIsSavingFee(true)
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'delivery_fee', value: parseFloat(deliveryFee) })
            })

            if (res.ok) {
                toast.success(`Delivery charges updated to Rs. ${deliveryFee}`, {
                    style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                })
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            toast.error('Failed to update delivery charges')
        } finally {
            setIsSavingFee(false)
        }
    }

    const { stats, recentOrders } = dashboardData

    const statCards = [
        {
            label: 'Total Orders',
            value: stats.totalOrders.toString(),
            change: '',
            trend: 'neutral',
            icon: ShoppingCart,
            color: 'bg-primary/10 text-primary',
        },
        {
            label: 'Revenue',
            value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
            change: '',
            trend: 'neutral',
            icon: TrendingUp,
            color: 'bg-success/10 text-success',
        },
        {
            label: 'Pending',
            value: stats.pendingOrders.toString(),
            change: '',
            trend: 'neutral',
            icon: Package,
            color: 'bg-warning/10 text-warning',
        },
        {
            label: 'Products',
            value: stats.totalProducts.toString(),
            change: '',
            trend: 'neutral',
            icon: Package,
            color: 'bg-purple-100 text-purple-600',
        },
    ]

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-text-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading dashboard data...</p>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary">Dashboard</h1>
                <p className="text-sm text-text-secondary mt-1">Welcome back! Here&apos;s your store overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-border p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <Icon className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-xs text-success font-semibold flex items-center gap-0.5">
                                    {stat.change}
                                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-secondary">{stat.value}</p>
                            <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Delivery Charges Setting */}
            <div className="bg-white rounded-xl border border-border p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Truck className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-secondary text-sm">Delivery Charges</h2>
                        <p className="text-xs text-text-secondary">Set delivery fee for all orders</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-[200px]">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-medium">Rs.</span>
                        <input
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                            min="0"
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        onClick={handleSaveDelivery}
                        disabled={isSavingFee}
                        className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSavingFee && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSavingFee ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-secondary text-sm">Recent Orders</h2>
                    <Link
                        href="/admin/orders"
                        className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                    >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-border">
                    {recentOrders.map((order) => {
                        const status = statusConfig[order.status]
                        return (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="block px-5 py-3.5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-secondary text-sm">{order.id}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">{order.customer} · {order.date}</span>
                                    <span className="text-sm font-bold text-primary">Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-text-secondary border-b border-border">
                                <th className="text-left px-5 py-3 font-medium">Order</th>
                                <th className="text-left px-5 py-3 font-medium">Customer</th>
                                <th className="text-left px-5 py-3 font-medium">Date</th>
                                <th className="text-left px-5 py-3 font-medium">Total</th>
                                <th className="text-left px-5 py-3 font-medium">Payment</th>
                                <th className="text-left px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentOrders.map((order) => {
                                const status = statusConfig[order.status]
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <Link href={`/admin/orders/${order.id}`} className="text-sm font-semibold text-primary hover:underline">
                                                {order.id}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-secondary">{order.customer}</td>
                                        <td className="px-5 py-3 text-sm text-text-secondary">{order.date}</td>
                                        <td className="px-5 py-3 text-sm font-semibold text-secondary">Rs. {order.total.toLocaleString()}</td>
                                        <td className="px-5 py-3 text-sm text-text-secondary">{order.method}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
