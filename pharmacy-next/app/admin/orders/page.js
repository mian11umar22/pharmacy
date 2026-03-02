"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    processing: { label: 'Processing', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success', dot: 'bg-success' },
    cancelled: { label: 'Cancelled', color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
}

const filterTabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrdersPage() {
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalOrders, setTotalOrders] = useState(0)

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true)
            const statusParam = activeFilter !== 'All' ? `&status=${activeFilter.toLowerCase()}` : ''
            const res = await fetch(`/api/orders?limit=100${statusParam}`)
            const data = await res.json()
            if (res.ok) {
                // Map the data to match the UI expectations
                const mappedOrders = (data.orders || []).map(o => ({
                    id: o.orderNumber || o._id,
                    realId: o._id,
                    customer: o.shippingAddress?.name || o.user?.name || 'Guest',
                    phone: o.shippingAddress?.phone || 'N/A',
                    total: o.total,
                    status: o.status,
                    date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    items: o.items?.length || 0,
                    method: o.paymentMethod?.toUpperCase() || 'COD'
                }))
                setOrders(mappedOrders)
                setTotalOrders(data.total)
            }
        } catch (error) {
            console.error('Fetch orders error:', error)
            toast.error('Failed to load orders')
        } finally {
            setIsLoading(false)
        }
    }, [activeFilter])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const filtered = orders.filter((order) => {
        const matchesSearch = !searchQuery ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary">Orders</h1>
                <p className="text-sm text-text-secondary mt-1">{totalOrders} total orders</p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by order ID or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                {filterTabs.map((tab) => {
                    const count = tab === 'All' ? totalOrders : orders.filter(o => o.status === tab.toLowerCase()).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeFilter === tab
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
                                }`}
                        >
                            {tab}
                            {tab !== 'All' && (
                                <span className="ml-1.5 opacity-70">
                                    ({count})
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {isLoading ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-text-secondary">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Loading orders...</p>
                </div>
            ) : (
                <>
                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-3">
                        {filtered.map((order) => {
                            const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100', dot: 'bg-gray-400' }
                            return (
                                <Link
                                    key={order.realId}
                                    href={`/admin/orders/${order.realId}`}
                                    className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all active:scale-[0.99]"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-secondary text-sm">{order.id}</span>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary font-medium">{order.customer}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-text-secondary">{order.date} · {order.items} items</span>
                                        <span className="font-bold text-primary text-sm">Rs. {order.total.toLocaleString()}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block bg-white rounded-xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-text-secondary border-b border-border bg-gray-50/50">
                                    <th className="text-left px-5 py-3 font-medium">Order</th>
                                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                                    <th className="text-left px-5 py-3 font-medium">Date</th>
                                    <th className="text-left px-5 py-3 font-medium">Items</th>
                                    <th className="text-left px-5 py-3 font-medium">Total</th>
                                    <th className="text-left px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map((order) => {
                                    const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100', dot: 'bg-gray-400' }
                                    return (
                                        <tr key={order.realId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <span className="text-sm font-semibold text-secondary">{order.id}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm text-secondary">{order.customer}</p>
                                                <p className="text-xs text-text-secondary">{order.phone}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-text-secondary">{order.date}</td>
                                            <td className="px-5 py-3.5 text-sm text-text-secondary">{order.items}</td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-secondary">Rs. {order.total.toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Link href={`/admin/orders/${order.realId}`} className="text-primary hover:underline text-xs font-semibold flex items-center gap-0.5">
                                                    View <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-3xl mb-2">📭</p>
                            <p className="text-sm text-text-secondary">No orders found</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
