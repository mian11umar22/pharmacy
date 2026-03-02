"use client"

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, CreditCard, Loader2 } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-warning/10 text-warning border-warning/30' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { value: 'delivered', label: 'Delivered', color: 'bg-success/10 text-success border-success/30' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-danger/10 text-danger border-danger/30' },
]

export default function AdminOrderDetailPage({ params }) {
    const { id } = use(params)
    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchOrder = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/orders/${id}`)
            const data = await res.json()
            if (res.ok) {
                setOrder(data.order)
            } else {
                toast.error(data.error || 'Order not found')
            }
        } catch (error) {
            toast.error('Failed to load order details')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchOrder()
    }, [fetchOrder])

    const handleStatusChange = async (newStatus) => {
        try {
            setIsUpdating(true)
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                setOrder(prev => ({ ...prev, status: newStatus }))
                toast.success(`Order status updated to ${newStatus}`, {
                    style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                })
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to update status')
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-text-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading order details...</p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="p-8 text-center">
                <p className="text-secondary font-bold">Order not found</p>
                <Link href="/admin/orders" className="text-primary hover:underline mt-2 inline-block">
                    Back to Orders
                </Link>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/orders" className="text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg sm:text-xl font-bold text-secondary">{order.orderNumber || order._id}</h1>
                    <p className="text-xs text-text-secondary">
                        {new Date(order.createdAt).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Order Info */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Update Status */}
                    <div className="bg-white rounded-xl border border-border p-5 relative">
                        {isUpdating && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        )}
                        <h2 className="font-bold text-secondary text-sm mb-3">Update Status</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusChange(opt.value)}
                                    disabled={isUpdating}
                                    className={`py-2 px-3 rounded-xl text-[10px] font-bold border-2 transition-all cursor-pointer disabled:opacity-50 ${order.status === opt.value
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
                        <h2 className="font-bold text-secondary text-sm mb-4">Order Items ({order.items?.length || 0})</h2>
                        <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : '💊'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-secondary truncate">{item.name}</p>
                                        <p className="text-xs text-text-secondary">Qty: {item.quantity} × Rs. {item.price}</p>
                                    </div>
                                    <p className="text-sm font-bold text-secondary flex-shrink-0">
                                        Rs. {(item.quantity * item.price).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Subtotal</span>
                                <span className="text-secondary">Rs. {order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Delivery</span>
                                <span className="text-secondary">Rs. {order.deliveryFee}</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-2">
                                <span className="font-bold text-secondary">Total</span>
                                <span className="font-bold text-primary text-base">Rs. {order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="bg-white rounded-xl border border-border p-5">
                            <h2 className="font-bold text-secondary text-sm mb-2">Order Notes</h2>
                            <p className="text-sm text-text-secondary italic">&quot;{order.notes}&quot;</p>
                        </div>
                    )}
                </div>

                {/* Right: Customer Info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-4">Customer</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="font-semibold text-secondary text-sm">{order.shippingAddress?.name || order.user?.name}</p>
                                <p className="text-xs text-text-secondary">{order.user?.email}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary">
                                <Phone className="w-3.5 h-3.5 text-text-secondary" />
                                <a href={`tel:${order.shippingAddress?.phone}`} className="hover:text-primary">{order.shippingAddress?.phone}</a>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-secondary">
                                <MapPin className="w-3.5 h-3.5 text-text-secondary mt-0.5" />
                                <span>{order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-border p-5">
                        <h2 className="font-bold text-secondary text-sm mb-3">Payment</h2>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-text-secondary" />
                            <span className="text-sm text-secondary uppercase font-medium">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
