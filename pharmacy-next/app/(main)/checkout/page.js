"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Banknote, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

const DELIVERY_FEE = 150

// ── Zod Validation Schema ──────────────────────────────
const checkoutSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, 'Full name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be under 50 characters')
        .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, and hyphens')
        .regex(/^(?!.*\s{2})/, 'Name cannot have consecutive spaces')
        .regex(/^[a-zA-Z]/, 'Name must start with a letter'),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),

    phone: z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .regex(/^\d{11}$/, 'Phone number must be exactly 11 digits (numbers only)'),

    address: z
        .string()
        .trim()
        .min(1, 'Address is required')
        .min(10, 'Please enter a complete address (min 10 characters)')
        .max(200, 'Address is too long')
        .regex(/[a-zA-Z]/, 'Address must contain at least some letters'),

    notes: z
        .string()
        .trim()
        .max(200, 'Notes must be under 200 characters')
        .optional()
        .or(z.literal('')),
})
// ────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const router = useRouter()
    const { cartItems, getCartTotal, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const subtotal = getCartTotal()
    const delivery = cartItems.length > 0 ? DELIVERY_FEE : 0
    const total = subtotal + delivery

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            notes: '',
        },
    })

    // Redirect to cart if empty (only after hydration to avoid SSR mismatch)
    useEffect(() => {
        if (isHydrated && cartItems.length === 0 && !isSubmitting) {
            router.push('/products')
        }
    }, [isHydrated, cartItems, router, isSubmitting])

    if (!isHydrated || cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Redirecting...</h2>
            </div>
        )
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true)

        // Simulate order placement
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate mock order number
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

        // Save order info for success page
        const orderData = {
            orderNumber,
            items: cartItems,
            subtotal,
            delivery,
            total,
            customer: data,
            paymentMethod: 'COD',
            date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }),
        }
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData))

        // Clear cart and navigate
        clearCart()
        router.push('/order-success')
    }

    const onError = () => {
        toast.error('Please fill in all required fields correctly', {
            position: 'bottom-center',
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    // Helper for input class
    const inputClass = (fieldName) =>
        `w-full px-4 py-2.5 rounded-lg border ${errors[fieldName] ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm`

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <span className="text-secondary font-medium">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Mobile Back */}
            <div className="md:hidden px-4 py-3">
                <button onClick={() => router.push('/cart')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">

                <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-6">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* Left Column — Delivery Form */}
                    <div className="flex-1">

                        {/* Delivery Details */}
                        <div className="bg-white rounded-xl border border-border p-5 md:p-6 mb-6">
                            <h2 className="text-lg font-bold text-secondary mb-5">Delivery Details</h2>

                            <div className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Full Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Muhammad Ali"
                                        {...register('fullName')}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[0-9]/g, '')}
                                        className={inputClass('fullName')}
                                    />
                                    {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="ali@example.com"
                                        {...register('email')}
                                        className={inputClass('email')}
                                    />
                                    {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Phone Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="03XXXXXXXXX"
                                        maxLength={11}
                                        {...register('phone')}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                        className={inputClass('phone')}
                                    />
                                    {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Delivery Address <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        placeholder="House # 123, Street 5, Block A, DHA Phase 6, Lahore"
                                        rows="2"
                                        {...register('address')}
                                        className={`${inputClass('address')} resize-none`}
                                    />
                                    {errors.address && <p className="text-danger text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Delivery Notes <span className="text-text-secondary font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        placeholder="Any special instructions for delivery..."
                                        rows="2"
                                        {...register('notes')}
                                        className={`${inputClass('notes')} resize-none`}
                                    />
                                    {errors.notes && <p className="text-danger text-xs mt-1">{errors.notes.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl border border-border p-5 md:p-6">
                            <h2 className="text-lg font-bold text-secondary mb-4">Payment Method</h2>

                            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked
                                    readOnly
                                    className="w-5 h-5 text-primary accent-primary"
                                />
                                <Banknote className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-secondary text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-text-secondary">Pay when your order is delivered</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Right Column — Order Review */}
                    <div className="lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-border p-5 md:p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-secondary mb-4">Order Review</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-secondary truncate">{item.name}</p>
                                            <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-secondary flex-shrink-0">
                                            Rs. {item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-border pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="font-medium text-secondary">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Delivery</span>
                                    <span className="font-medium text-secondary">Rs. {delivery}</span>
                                </div>
                                <div className="border-t border-border pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-secondary text-base">Total</span>
                                        <span className="font-bold text-primary text-xl">Rs. {total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order — Desktop */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="hidden lg:block w-full mt-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-lg cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Placing Order...
                                    </span>
                                ) : (
                                    'Place Order — COD 💵'
                                )}
                            </button>

                            <p className="text-xs text-text-secondary text-center mt-3 hidden lg:block">
                                By placing this order you agree to our terms
                            </p>
                        </div>
                    </div>
                </div>
            </form>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-text-secondary">Total</p>
                        <p className="text-xl font-bold text-primary">Rs. {total}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit, onError)}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Placing...' : 'Place Order 💵'}
                    </button>
                </div>
            </div>

            {/* Bottom spacer */}
            <div className="lg:hidden h-20"></div>
        </div>
    )
}
