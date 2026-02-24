"use client"

import { ShoppingCart, Check } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
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

    return (
        <div className="bg-white rounded-xl shadow-card p-3 md:p-4 group relative flex flex-col h-full animate-fade-up hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            {/* Discount Badge */}
            {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
                    {product.discount}% OFF
                </span>
            )}

            {/* Image */}
            <Link href={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl bg-white aspect-[4/5] mb-3 md:mb-4 border border-border/20 p-2">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <p className="text-xs text-text-secondary mb-1">{product.category}</p>

                <Link href={`/product/${product.id}`} className="font-semibold text-secondary text-sm md:text-base mb-2 md:mb-3 hover:text-primary transition-colors line-clamp-2 leading-snug">
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
        </div>
    )
}

export default ProductCard
