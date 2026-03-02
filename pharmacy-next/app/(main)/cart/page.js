"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, ChevronRight, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
    const router = useRouter()

    const [deliveryFee, setDeliveryFee] = useState(0)
    const [isLoadingFee, setIsLoadingFee] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                const data = await res.json()
                if (res.ok && data.settings) {
                    setDeliveryFee(Number(data.settings.delivery_fee) || 150)
                }
            } catch (error) {
                console.error('Failed to fetch delivery fee:', error)
                setDeliveryFee(150) // Fallback
            } finally {
                setIsLoadingFee(false)
            }
        }
        fetchSettings()
    }, [])

    const subtotal = getCartTotal()
    const delivery = cartItems.length > 0 ? deliveryFee : 0
    const total = subtotal + delivery

    const handleRemove = (item) => {
        removeFromCart(item._id || item.id)
        toast.success(`${item.name} removed from cart`, {
            duration: 2000,
            position: 'bottom-center',
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
        })
    }

    const handleClearCart = () => {
        clearCart()
        toast.success('Cart cleared!', {
            duration: 2000,
            position: 'bottom-center',
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    // Empty Cart State
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
                <p className="text-text-secondary mb-8 text-center max-w-sm">
                    Looks like you haven't added any products yet. Browse our store and find what you need!
                </p>
                <Link
                    href="/products"
                    className="bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-dark transition-all shadow-sm"
                >
                    Browse Products →
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <span className="text-secondary font-medium">Shopping Cart</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                        Shopping Cart <span className="text-lg font-normal text-text-secondary">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    </h1>
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-danger hover:underline font-medium hidden md:block cursor-pointer"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* Cart Items Column */}
                    <div className="flex-1">
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const itemId = item._id || item.id;
                                return (
                                    <div
                                        key={itemId}
                                        className="bg-white rounded-xl border border-border p-4 flex gap-4 animate-fade-in"
                                    >
                                        {/* Image */}
                                        <Link href={`/products/${itemId}`} className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-gray-50"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="text-xs text-text-secondary">{item.category?.name || item.category}</p>
                                                    <Link href={`/products/${itemId}`} className="font-semibold text-secondary text-sm md:text-base hover:text-primary transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    className="text-gray-400 hover:text-danger transition-colors p-1 cursor-pointer flex-shrink-0"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-secondary bg-gray-50 rounded-lg">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right">
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-text-secondary">Rs. {item.price} × {item.quantity}</p>
                                                    )}
                                                    <p className="text-primary font-bold text-base md:text-lg">
                                                        Rs. {item.price * item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6 flex items-center justify-between">
                            <Link
                                href="/products"
                                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Continue Shopping
                            </Link>
                            <button
                                onClick={handleClearCart}
                                className="text-sm text-danger hover:underline font-medium md:hidden cursor-pointer"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Column */}
                    <div className="lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-border p-5 md:p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-secondary mb-5">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="font-medium text-secondary">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Delivery</span>
                                    <span className="font-medium text-secondary">Rs. {delivery}</span>
                                </div>

                                <div className="border-t border-border pt-3 mt-3">
                                    <div className="flex justify-between text-base">
                                        <span className="font-bold text-secondary">Total</span>
                                        <span className="font-bold text-primary text-lg">Rs. {total}</span>
                                    </div>
                                </div>
                            </div>



                            {/* Checkout Button (Desktop) */}
                            <button
                                onClick={() => router.push('/checkout')}
                                className="hidden lg:block w-full mt-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-lg cursor-pointer text-center"
                            >
                                Proceed to Checkout →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total</p>
                        <p className="text-xl font-black text-primary">Rs. {total}</p>
                    </div>
                    <button
                        onClick={() => router.push('/checkout')}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        Checkout →
                    </button>
                </div>
            </div>

            {/* Bottom spacer for mobile sticky bar */}
            <div className="lg:hidden h-20"></div>
        </div>
    )
}
