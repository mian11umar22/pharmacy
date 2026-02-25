"use client"

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const getOrder = (id) => ({
    id: id,
    date: '24 Feb 2026, 2:30 PM',
    status: 'confirmed',
    paymentMethod: 'Cash on Delivery',
    customer: {
        name: 'Muhammad Ali',
        phone: '03001234567',
        email: 'ali@example.com',
        address: 'House # 123, Street 5, Block A, DHA Phase 6, Lahore',
    },
    items: [
        { id: 1, name: 'Panadol Extra 500mg', qty: 2, price: 250 },
        { id: 2, name: 'Vitamin C 1000mg', qty: 1, price: 850 },
        { id: 3, name: 'Brufen 400mg', qty: 3, price: 150 },
    ],
    subtotal: 2200,
    delivery: 150,
    total: 2350,
})

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-warning/10 text-warning border-warning/30' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { value: 'delivered', label: 'Delivered', color: 'bg-success/10 text-success border-success/30' },
]

export default function AdminOrderDetailPage({ params }) {
    const { id } = use(params)
    const order = getOrder(id)
    const [status, setStatus] = useState(order.status)

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus)
        toast.success(`Order status updated to ${newStatus}`, {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg sm:text-xl font-bold text-secondary">{order.id}</h1>
                    <p className="text-xs text-text-secondary">{order.date}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Order Info */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Update Status */}
                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-3">Update Status</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusChange(opt.value)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${status === opt.value
                                            ? opt.color
                                            : 'bg-white border-border text-text-secondary hover:border-gray-300'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-4">Order Items ({order.items.length})</h2>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
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

                        <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Subtotal</span>
                                <span className="text-secondary">Rs. {order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Delivery</span>
                                <span className="text-secondary">Rs. {order.delivery}</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2">
                                <span className="font-bold text-secondary">Total</span>
                                <span className="font-bold text-primary text-base">Rs. {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Customer Info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-4">Customer</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="font-semibold text-secondary text-sm">{order.customer.name}</p>
                                <p className="text-xs text-text-secondary">{order.customer.email}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary">
                                <Phone className="w-3.5 h-3.5 text-text-secondary" />
                                <a href={`tel:${order.customer.phone}`} className="hover:text-primary">{order.customer.phone}</a>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-secondary">
                                <MapPin className="w-3.5 h-3.5 text-text-secondary mt-0.5" />
                                <span>{order.customer.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-3">Payment</h2>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-text-secondary" />
                            <span className="text-sm text-secondary">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
