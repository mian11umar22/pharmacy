"use client"

import { useState, useEffect } from 'react'
import { X, Search, Package, CheckCircle2, Clock, Truck, Home, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function TrackOrderModal({ isOpen, onClose }) {
    const [orderNumber, setOrderNumber] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [trackingData, setTrackingData] = useState(null)

    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setOrderNumber('')
            setPhone('')
            setError('')
            setTrackingData(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleTrack = async (e) => {
        e.preventDefault()
        setError('')
        setTrackingData(null)

        if (!orderNumber.trim() || !phone.trim()) {
            setError('Please enter both Order ID and Phone Number.')
            return
        }

        try {
            setIsLoading(true)
            const res = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: orderNumber.trim(),
                    phone: phone.trim()
                })
            })

            const data = await res.json()

            if (res.ok && data.success) {
                setTrackingData(data.data)
            } else {
                setError(data.message || 'Order with this tracking id does not exist.')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const statuses = [
        { id: 'pending', label: 'Order Placed', icon: Clock },
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
        { id: 'processing', label: 'Processing', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: Home },
    ]

    const currentStatusIndex = trackingData?.status === 'cancelled' 
        ? -1 
        : statuses.findIndex(s => s.id === trackingData?.status)
    const activeIndex = trackingData?.status === 'cancelled' ? -1 : (currentStatusIndex >= 0 ? currentStatusIndex : 0)

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8">
                    {!trackingData ? (
                        /* Tracking Form */
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-secondary mb-2">Track Your Order Now</h2>
                            <p className="text-sm text-text-secondary mb-8">Please enter your Order ID & Phone Number</p>

                            <form onSubmit={handleTrack} className="space-y-4">
                                <div className="text-left">
                                    <label htmlFor="modal-order" className="block text-sm font-medium text-secondary mb-1.5 ml-1">
                                        Order ID <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="modal-order"
                                        placeholder="e.g. HP-01001"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#F4F7FB] rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="text-left">
                                    <label htmlFor="modal-phone" className="block text-sm font-medium text-secondary mb-1.5 ml-1">
                                        Phone Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="modal-phone"
                                        placeholder="e.g. 03001234567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#F4F7FB] rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-danger text-left ml-1 animate-fade-in">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 mt-4 transition-transform hover:scale-[1.02] active:scale-95"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Track my Order'
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Tracking Result */
                        <div className="animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-secondary">Order Status</h2>
                                <p className="text-sm font-medium text-primary mt-1">{trackingData.orderNumber}</p>
                            </div>

                            {trackingData.status === 'cancelled' ? (
                                <div className="text-center p-6 bg-danger/10 rounded-xl border border-danger/20">
                                    <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
                                    <p className="font-bold text-danger">This order was cancelled.</p>
                                </div>
                            ) : (
                                <div className="relative pl-6 py-2">
                                    {/* Vertical Progress Line */}
                                    <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-gray-100 rounded-full"></div>
                                    
                                    {/* Active Vertical Line */}
                                    <div 
                                        className="absolute left-[33px] top-4 w-0.5 bg-primary rounded-full transition-all duration-700 ease-out"
                                        style={{ height: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
                                    ></div>

                                    <div className="space-y-6 relative z-10">
                                        {statuses.map((step, idx) => {
                                            const Icon = step.icon
                                            const isCompleted = idx <= activeIndex
                                            const isCurrent = idx === activeIndex

                                            return (
                                                <div key={step.id} className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        isCompleted 
                                                            ? 'bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-white' 
                                                            : 'bg-white text-gray-300 border-2 border-gray-100 ring-4 ring-white'
                                                    } ${isCurrent ? 'scale-110' : ''}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${isCompleted ? 'text-secondary' : 'text-text-secondary'}`}>
                                                            {step.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <p className="text-[10px] text-primary font-bold uppercase tracking-wide mt-0.5 animate-pulse">
                                                                Current
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setTrackingData(null)}
                                className="w-full mt-8 py-3 rounded-xl border-2 border-gray-100 text-text-secondary font-bold hover:border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Track Another Order
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
