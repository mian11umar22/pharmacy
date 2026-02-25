"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'

const allOrders = [
    { id: 'ORD-847291', customer: 'Muhammad Ali', phone: '03001234567', total: 2350, status: 'pending', date: '24 Feb 2026', items: 3, method: 'COD' },
    { id: 'ORD-847156', customer: 'Sara Ahmed', phone: '03112345678', total: 1875, status: 'confirmed', date: '24 Feb 2026', items: 4, method: 'COD' },
    { id: 'ORD-846990', customer: 'Hassan Khan', phone: '03219876543', total: 980, status: 'shipped', date: '23 Feb 2026', items: 1, method: 'COD' },
    { id: 'ORD-846801', customer: 'Ayesha Malik', phone: '03331234567', total: 3200, status: 'delivered', date: '23 Feb 2026', items: 3, method: 'COD' },
    { id: 'ORD-846650', customer: 'Usman Tariq', phone: '03451234567', total: 550, status: 'delivered', date: '22 Feb 2026', items: 2, method: 'COD' },
    { id: 'ORD-846512', customer: 'Fatima Riaz', phone: '03009876543', total: 1450, status: 'pending', date: '22 Feb 2026', items: 2, method: 'COD' },
    { id: 'ORD-846400', customer: 'Ahmed Raza', phone: '03161234567', total: 2800, status: 'confirmed', date: '21 Feb 2026', items: 5, method: 'COD' },
]

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success', dot: 'bg-success' },
}

const filterTabs = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered']

export default function AdminOrdersPage() {
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = allOrders.filter((order) => {
        const matchesStatus = activeFilter === 'All' || order.status === activeFilter.toLowerCase()
        const matchesSearch = !searchQuery ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary">Orders</h1>
                <p className="text-sm text-text-secondary mt-1">{allOrders.length} total orders</p>
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
                {filterTabs.map((tab) => (
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
                                ({allOrders.filter(o => o.status === tab.toLowerCase()).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
                {filtered.map((order) => {
                    const status = statusConfig[order.status]
                    return (
                        <Link
                            key={order.id}
                            href={`/admin/orders/${order.id}`}
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
                            const status = statusConfig[order.status]
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
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
                                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline text-xs font-semibold flex items-center gap-0.5">
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
        </div>
    )
}
