"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Package, Loader2 } from 'lucide-react'
import Image from 'next/image'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    processing: { label: 'Processing', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-500' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success', dot: 'bg-success' },
    cancelled: { label: 'Cancelled', color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
}

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                const data = await res.json()
                if (res.ok && data.orders) {
                    setOrders(data.orders)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-secondary font-medium">Loading your orders...</p>
        </div>
    )

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
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending
                        const orderId = order.orderNumber || order._id
                        const date = new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })
                        const itemCount = order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0

                        return (
                            <Link
                                key={order._id}
                                href={`/account/orders/${order._id}`}
                                className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all active:scale-[0.99]"
                            >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-bold text-secondary text-sm">#{orderId}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">{date}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Items Preview */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex -space-x-2">
                                        {order.items?.slice(0, 3).map((item, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs overflow-hidden"
                                            >
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-text-secondary truncate flex-1">
                                        {order.items?.map(i => i.name).slice(0, 2).join(', ')}
                                        {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div>
                                        <p className="text-xs text-text-secondary">{itemCount} items</p>
                                        <p className="font-bold text-primary text-sm">Rs. {order.total?.toLocaleString()}</p>
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

                {/* Empty state */}
                {!loading && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                            📦
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-2">No orders yet</h3>
                        <p className="text-sm text-text-secondary text-center max-w-[250px] mb-6">
                            When you place an order, it will appear here for you to track.
                        </p>
                        <Link href="/products" className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-dark transition-all">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
