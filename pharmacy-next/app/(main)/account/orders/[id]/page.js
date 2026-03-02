"use client"

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, CreditCard, Package, CheckCircle2, CircleDot, Loader2 } from 'lucide-react'

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
    processing: { label: 'Processing', color: 'bg-orange-50 text-orange-600' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success' },
    cancelled: { label: 'Cancelled', color: 'bg-danger/10 text-danger' },
}

export default function OrderDetailPage({ params }) {
    const { id } = use(params)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`)
                const data = await res.json()
                if (res.ok && data.order) {
                    setOrder(data.order)
                } else {
                    setError(data.error || 'Order not found')
                }
            } catch (error) {
                console.error('Failed to fetch order:', error)
                setError('Failed to load order details')
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-secondary font-medium">Loading details...</p>
        </div>
    )

    if (error || !order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="text-5xl mb-4">📜</div>
            <h2 className="text-xl font-bold text-secondary mb-2">{error || 'Order not found'}</h2>
            <Link href="/account/orders" className="text-primary font-semibold hover:underline">
                ← Back to My Orders
            </Link>
        </div>
    )

    const status = statusConfig[order.status] || statusConfig.pending

    // Generate timeline based on status
    const timelineSteps = [
        { key: 'pending', label: 'Order Placed', time: new Date(order.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) },
        { key: 'confirmed', label: 'Order Confirmed' },
        { key: 'processing', label: 'Processing' },
        { key: 'shipped', label: 'Dispatched' },
        { key: 'delivered', label: 'Delivered' },
    ]

    const currentStatusIndex = timelineSteps.findIndex(s => s.key === order.status)
    const orderTimeline = timelineSteps.map((step, index) => ({
        ...step,
        done: index <= currentStatusIndex && order.status !== 'cancelled',
        active: index === currentStatusIndex && order.status !== 'delivered' && order.status !== 'cancelled'
    }))

    return (
        <div className="bg-background min-h-screen pb-6">
            {/* Top Bar */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/account/orders" className="text-text-secondary hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-bold text-secondary">#{order.orderNumber || order._id}</h1>
                            <p className="text-xs text-text-secondary">
                                {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-4 space-y-4">

                {/* Tracking UI (Simplified) */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-5">Order Progress</h2>
                    <div className="relative">
                        {orderTimeline.map((step, index) => {
                            const isLast = index === orderTimeline.length - 1
                            return (
                                <div key={step.key} className="flex gap-3 relative">
                                    {!isLast && (
                                        <div className={`absolute left-[11px] top-6 w-0.5 h-full ${step.done ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                    )}
                                    <div className="flex-shrink-0 z-10 mt-0.5">
                                        {step.done ? (
                                            <CheckCircle2 className={`w-6 h-6 ${step.active ? 'text-primary animate-pulse' : 'text-primary'}`} />
                                        ) : (
                                            <CircleDot className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                                        <p className={`text-sm font-semibold ${step.done ? 'text-secondary' : 'text-gray-400'}`}>
                                            {step.label}
                                        </p>
                                        {step.time && (
                                            <p className="text-xs text-text-secondary mt-0.5">{step.time}</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {order.status === 'cancelled' && (
                            <div className="mt-4 p-3 bg-danger/10 text-danger rounded-xl text-center text-sm font-bold">
                                ❌ This order was cancelled
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-4">Items ({order.items?.length})</h2>
                    <div className="space-y-4">
                        {order.items?.map((item) => (
                            <div key={item._id} className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Package className="w-6 h-6 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-secondary truncate">{item.name}</p>
                                    <p className="text-xs text-text-secondary">{item.quantity} × Rs. {item.price}</p>
                                </div>
                                <p className="text-sm font-bold text-secondary flex-shrink-0">
                                    Rs. {(item.quantity * item.price).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border mt-5 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="font-medium text-secondary">Rs. {order.subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Delivery Charge</span>
                            <span className="font-medium text-secondary">
                                {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-base border-t border-border pt-2 mt-2">
                            <span className="font-bold text-secondary">Grand Total</span>
                            <span className="font-bold text-primary">Rs. {order.total?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-secondary">{order.shippingAddress?.name}</p>
                                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                                    {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <p className="text-sm text-secondary font-medium">{order.shippingAddress?.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-sm">💵</div>
                            <div>
                                <p className="text-xs text-text-secondary">Payment Method</p>
                                <p className="text-sm font-bold text-secondary uppercase">{order.paymentMethod || 'COD'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 text-center">
                    <p className="text-sm font-semibold text-secondary mb-2">Need help with this order?</p>
                    <a
                        href="https://wa.me/923054964343"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                        <span>💬</span> Chat on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
