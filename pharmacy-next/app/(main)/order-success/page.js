"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Phone, MapPin } from 'lucide-react'

export default function OrderSuccessPage() {
    const [order, setOrder] = useState(null)
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        setIsHydrated(true)
        const data = sessionStorage.getItem('lastOrder')
        if (data) {
            setOrder(JSON.parse(data))
        }
    }, [])

    if (!isHydrated) return null

    if (!order) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <div className="text-6xl mb-4">🤷</div>
                <h2 className="text-2xl font-bold text-secondary mb-2">No order found</h2>
                <p className="text-text-secondary mb-6">Looks like you haven&apos;t placed an order yet.</p>
                <Link href="/products" className="bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-dark transition-all">
                    Browse Products →
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] bg-background flex items-center justify-center px-4 py-8">
            <div className="max-w-lg w-full">

                {/* Success Icon */}
                <div className="text-center mb-8 animate-fade-up">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-success" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Order Placed! 🎉</h1>
                    <p className="text-text-secondary">
                        Your order <span className="font-semibold text-secondary">#{order.orderNumber}</span> has been confirmed
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-xl border border-border p-5 md:p-6 mb-6 animate-fade-up" style={{ animationDelay: '150ms' }}>

                    {/* Delivery Info */}
                    <div className="space-y-3 mb-5 pb-5 border-b border-border">
                        <div className="flex items-start gap-3">
                            <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-text-secondary">Delivery To</p>
                                <p className="text-sm font-medium text-secondary">{order.customer.fullName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-text-secondary">Address</p>
                                <p className="text-sm text-secondary">{order.customer.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-text-secondary">Phone</p>
                                <p className="text-sm text-secondary">{order.customer.phone}</p>
                            </div>
                        </div>
                        {order.customer.email && (
                            <div className="flex items-start gap-3">
                                <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-text-secondary">Email</p>
                                    <p className="text-sm text-secondary">{order.customer.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-5 pb-5 border-b border-border">
                        {order.items.map((item) => (
                            <div key={item._id || item.id} className="flex justify-between text-sm">
                                <span className="text-text-secondary">
                                    {item.name} <span className="text-xs">×{item.quantity}</span>
                                </span>
                                <span className="font-medium text-secondary">Rs. {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="text-secondary">Rs. {order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Delivery</span>
                            <span className="text-secondary">Rs. {order.delivery}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-bold text-secondary">Total</span>
                            <span className="font-bold text-primary text-lg">Rs. {order.total}</span>
                        </div>
                    </div>

                    {/* Payment Badge */}
                    <div className="mt-4 bg-warning/10 rounded-lg p-3 flex items-center gap-2">
                        <span className="text-lg">💵</span>
                        <div>
                            <p className="text-sm font-medium text-secondary">Cash on Delivery</p>
                            <p className="text-xs text-text-secondary">Pay Rs. {order.total} when order is delivered</p>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="bg-primary/5 rounded-xl p-4 mb-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                    <p className="text-sm text-primary text-center">
                        📞 We&apos;ll call you on <strong>{order.customer.phone}</strong> to confirm your order
                    </p>
                </div>

                {/* Create Account CTA for Guest Users */}
                <div className="bg-white rounded-xl border-2 border-dashed border-primary/30 p-5 mb-6 animate-fade-up text-center" style={{ animationDelay: '350ms' }}>
                    <div className="text-2xl mb-2">🎁</div>
                    <h3 className="font-bold text-secondary text-base mb-1">Create an Account</h3>
                    <p className="text-xs text-text-secondary mb-3">
                        Track this order, save addresses & view order history
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all active:scale-[0.98]"
                    >
                        Sign Up — It's Free
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '400ms' }}>
                    <Link
                        href="/products"
                        className="flex-1 py-3 text-center bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 py-3 text-center border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
