"use client"

import { ShoppingCart, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import PrescriptionUploadModal from '@/components/ui/PrescriptionUploadModal'

const ProductCard = ({ product }) => {
    const router = useRouter()
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

    const completeAddToCart = (prescriptionData) => {
        const wasAdded = addToCart({ ...product, ...(prescriptionData || {}) })

        if (!wasAdded) {
            toast.error('Out of stock', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    borderRadius: '10px',
                    background: '#1B3A4B',
                    color: '#fff',
                    fontSize: '14px',
                },
            })
            return
        }

        setAdded(true)
        toast.success(`${product.name} added to cart!`, {
            duration: 2000,
            position: 'bottom-center',
            style: {
                borderRadius: '10px',
                background: '#1B3A4B',
                color: '#fff',
                fontSize: '14px',
            },
            iconTheme: {
                primary: '#0D9E71',
                secondary: '#fff',
            },
        })
        setTimeout(() => setAdded(false), 1500)
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()

        // If product has sizes, redirect to details page to pick one
        if (product.variants?.length > 0) {
            router.push(`/products/${product._id}`)
            toast('Please select a size first!', {
                icon: '📏',
                style: {
                    borderRadius: '10px',
                    background: '#1B3A4B',
                    color: '#fff',
                    fontSize: '14px',
                }
            })
            return
        }

        if (product.requiresPrescription) {
            setShowPrescriptionModal(true)
            return
        }

        completeAddToCart()
    }

    return (
        <div className="bg-white rounded-xl shadow-card p-3 md:p-4 group relative flex flex-col h-full animate-fade-up hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            {/* Badges Container */}
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap gap-1.5 pointer-events-none">
                {product.discount > 0 && (
                    <span className="bg-accent text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-fade-in">
                        {product.discount}% OFF
                    </span>
                )}
                {product.salesCount >= 20 && (
                    <span className="bg-primary text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-fade-in">
                        Best Seller
                    </span>
                )}
            </div>

            {/* Image */}
            <Link
                href={`/products/${product._id}`}
                className="group block relative overflow-hidden rounded-xl bg-white aspect-[4/5] mb-3 md:mb-4 border border-border/20 p-2"
            >
                <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                            <span className="text-4xl">💊</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <p className="text-xs text-text-secondary mb-1">{product.category?.name || 'Category'}</p>

                <Link href={`/products/${product._id}`} className="font-semibold text-secondary text-sm md:text-base mb-2 md:mb-3 hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {product.name}
                </Link>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between pt-2 md:pt-3 border-t border-border/50">
                    <div className="flex flex-col">
                        {product.originalPrice > product.price && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
                        )}
                        <span className="text-primary font-bold text-sm md:text-lg">Rs. {product.price}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`py-2 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${added
                            ? 'bg-success text-white'
                            : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md'
                            }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Added!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Add</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <PrescriptionUploadModal
                isOpen={showPrescriptionModal}
                onClose={() => setShowPrescriptionModal(false)}
                onUploaded={(prescriptionData) => {
                    setShowPrescriptionModal(false)
                    completeAddToCart(prescriptionData)
                }}
                productName={product.name}
            />
        </div>
    )
}

export default ProductCard
