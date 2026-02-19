import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Banknote, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const DELIVERY_FEE = 150
const FREE_DELIVERY_THRESHOLD = 2000

const Checkout = () => {
    const navigate = useNavigate()
    const { cartItems, getCartTotal, clearCart } = useCart()

    const subtotal = getCartTotal()
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    const total = subtotal + delivery

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect to cart if empty
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
                <p className="text-text-secondary mb-6">Add some products before checkout.</p>
                <Link to="/products" className="bg-primary text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-dark transition-all">
                    Browse Products →
                </Link>
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Please enter your full name (min 3 characters)'
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address'
        }

        const phoneRegex = /^03\d{2}-?\d{7}$/
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter valid Pakistani number (03XX-XXXXXXX)'
        }

        if (!formData.address.trim() || formData.address.trim().length < 10) {
            newErrors.address = 'Please enter a complete address (min 10 characters)'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handlePlaceOrder = async (e) => {
        e.preventDefault()

        if (!validate()) {
            toast.error('Please fill in all required fields', {
                position: 'bottom-center',
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
            return
        }

        setIsSubmitting(true)

        // Simulate order placement (replace with API call later)
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
            customer: formData,
            paymentMethod: 'COD',
            date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }),
        }
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData))

        // TODO: Backend API will send email to customer + admin here

        // Clear cart and navigate
        clearCart()
        navigate('/order-success')
    }

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <span className="text-secondary font-medium">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Mobile Back */}
            <div className="md:hidden px-4 py-3">
                <button onClick={() => navigate('/cart')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">

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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Muhammad Ali"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm`}
                                    />
                                    {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ali@example.com"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm`}
                                    />
                                    {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Phone Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="03XX-XXXXXXX"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm`}
                                    />
                                    {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Delivery Address <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House # 123, Street 5, Block A, DHA Phase 6"
                                        rows="2"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm resize-none`}
                                    />
                                    {errors.address && <p className="text-danger text-xs mt-1">{errors.address}</p>}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1.5">
                                        Delivery Notes <span className="text-text-secondary font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Any special instructions for delivery..."
                                        rows="2"
                                        className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background text-sm resize-none"
                                    />
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
                                    {delivery === 0 ? (
                                        <span className="font-medium text-success">FREE</span>
                                    ) : (
                                        <span className="font-medium text-secondary">Rs. {delivery}</span>
                                    )}
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
                        onClick={handlePlaceOrder}
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

export default Checkout
