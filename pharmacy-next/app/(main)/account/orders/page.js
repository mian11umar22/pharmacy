"use client"

import Link from 'next/link'
import { ChevronRight, ArrowLeft, Package } from 'lucide-react'

// Mock orders data
const mockOrders = [
    {
        id: 'ORD-847291',
        date: '24 Feb 2026',
        total: 2350,
        status: 'delivered',
        items: [
            { name: 'Panadol Extra 500mg', qty: 2, image: '/products/panadol.jpg' },
            { name: 'Vitamin C 1000mg', qty: 1, image: '/products/vitaminc.jpg' },
        ],
        itemCount: 3,
    },
    {
        id: 'ORD-847156',
        date: '20 Feb 2026',
        total: 1875,
        status: 'shipped',
        items: [
            { name: 'Augmentin 625mg', qty: 1, image: '/products/augmentin.jpg' },
            { name: 'Brufen 400mg', qty: 3, image: '/products/brufen.jpg' },
        ],
        itemCount: 4,
    },
    {
        id: 'ORD-846990',
        date: '15 Feb 2026',
        total: 980,
        status: 'confirmed',
        items: [
            { name: 'Centrum Multivitamins', qty: 1, image: '/products/centrum.jpg' },
        ],
        itemCount: 1,
    },
    {
        id: 'ORD-846801',
        date: '10 Feb 2026',
        total: 3200,
        status: 'pending',
        items: [
            { name: 'Ensure Vanilla 400g', qty: 2, image: '/products/ensure.jpg' },
            { name: 'Glucerna 400g', qty: 1, image: '/products/glucerna.jpg' },
        ],
        itemCount: 3,
    },
    {
        id: 'ORD-846650',
        date: '5 Feb 2026',
        total: 550,
        status: 'delivered',
        items: [
            { name: 'Disprin 300mg', qty: 2, image: '/products/disprin.jpg' },
        ],
        itemCount: 2,
    },
]

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success', dot: 'bg-success' },
}

export default function OrdersPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Top Bar */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/account" className="text-text-secondary hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-bold text-secondary">My Orders</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-4">
                {/* Orders List */}
                <div className="space-y-3">
                    {mockOrders.map((order) => {
                        const status = statusConfig[order.status]
                        return (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all active:scale-[0.99]"
                            >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-secondary text-sm">{order.id}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">{order.date}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Items Preview */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex -space-x-2">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-text-secondary"
                                            >
                                                💊
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-text-secondary">
                                        {order.items.map(i => i.name).slice(0, 2).join(', ')}
                                        {order.itemCount > 2 && ` +${order.itemCount - 2} more`}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div>
                                        <p className="text-xs text-text-secondary">{order.itemCount} items</p>
                                        <p className="font-bold text-primary text-sm">Rs. {order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                                        View Details
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Empty state (hidden while we have data) */}
                {mockOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                            📦
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-2">No orders yet</h3>
                        <p className="text-sm text-text-secondary mb-6">Your order history will appear here</p>
                        <Link href="/products" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
