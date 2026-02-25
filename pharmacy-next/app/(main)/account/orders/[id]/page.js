"use client"

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, CreditCard, Package, CheckCircle2, Truck, CircleDot } from 'lucide-react'

// Mock order detail
const getOrder = (id) => ({
    id: id,
    date: '24 Feb 2026',
    status: 'shipped', // pending | confirmed | shipped | delivered
    paymentMethod: 'Cash on Delivery',
    customer: {
        name: 'Muhammad Ali',
        phone: '03001234567',
        email: 'ali@example.com',
        address: 'House # 123, Street 5, Block A, DHA Phase 6, Lahore',
    },
    items: [
        { id: 1, name: 'Panadol Extra 500mg', qty: 2, price: 250, image: '/products/panadol.jpg' },
        { id: 2, name: 'Vitamin C 1000mg', qty: 1, price: 850, image: '/products/vitaminc.jpg' },
        { id: 3, name: 'Brufen 400mg', qty: 3, price: 150, image: '/products/brufen.jpg' },
    ],
    subtotal: 2200,
    delivery: 150,
    total: 2350,
    timeline: [
        { step: 'placed', label: 'Order Placed', time: '24 Feb, 2:30 PM', done: true },
        { step: 'confirmed', label: 'Confirmed', time: '24 Feb, 3:15 PM', done: true },
        { step: 'shipped', label: 'Shipped', time: '25 Feb, 10:00 AM', done: true },
        { step: 'delivered', label: 'Delivered', time: '', done: false },
    ],
})

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
    shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-600' },
    delivered: { label: 'Delivered', color: 'bg-success/10 text-success' },
}

export default function OrderDetailPage({ params }) {
    const { id } = use(params)
    const order = getOrder(id)
    const status = statusConfig[order.status]

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
                            <h1 className="text-sm font-bold text-secondary">{order.id}</h1>
                            <p className="text-xs text-text-secondary">{order.date}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-4 space-y-4">

                {/* Order Tracking Timeline */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-5">Order Tracking</h2>
                    <div className="relative">
                        {order.timeline.map((step, index) => {
                            const isLast = index === order.timeline.length - 1
                            const isActive = step.done && (!order.timeline[index + 1] || !order.timeline[index + 1].done)
                            return (
                                <div key={step.step} className="flex gap-3 relative">
                                    {/* Line */}
                                    {!isLast && (
                                        <div className={`absolute left-[11px] top-6 w-0.5 h-full ${step.done ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                    )}

                                    {/* Dot */}
                                    <div className="flex-shrink-0 z-10 mt-0.5">
                                        {step.done && !isActive ? (
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                        ) : isActive ? (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            </div>
                                        ) : (
                                            <CircleDot className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                                        <p className={`text-sm font-semibold ${step.done ? 'text-secondary' : 'text-gray-400'}`}>
                                            {step.label}
                                        </p>
                                        {step.time && (
                                            <p className="text-xs text-text-secondary mt-0.5">{step.time}</p>
                                        )}
                                        {!step.done && !step.time && (
                                            <p className="text-xs text-gray-400 mt-0.5">Awaiting</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-4">Order Items ({order.items.length})</h2>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                                    💊
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-secondary truncate">{item.name}</p>
                                    <p className="text-xs text-text-secondary">Qty: {item.qty} × Rs. {item.price}</p>
                                </div>
                                <p className="text-sm font-bold text-secondary flex-shrink-0">
                                    Rs. {(item.qty * item.price).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-border mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="font-medium text-secondary">Rs. {order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Delivery</span>
                            <span className="font-medium text-secondary">
                                {order.delivery === 0 ? 'FREE' : `Rs. ${order.delivery}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-base border-t border-border pt-2">
                            <span className="font-bold text-secondary">Total</span>
                            <span className="font-bold text-primary">Rs. {order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-bold text-secondary text-sm mb-4">Delivery Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 text-text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary">{order.customer.name}</p>
                                <p className="text-xs text-text-secondary mt-0.5">{order.customer.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-text-secondary" />
                            </div>
                            <p className="text-sm text-secondary">{order.customer.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-text-secondary" />
                            </div>
                            <p className="text-sm text-secondary">{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center">
                    <p className="text-sm font-semibold text-secondary mb-1">Need help with this order?</p>
                    <a
                        href="https://wa.me/923054964343"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
                    >
                        💬 Chat with us on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
