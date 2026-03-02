"use client"

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ChevronRight, ArrowLeft, Package, Check, Loader2, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const { id } = params
    const router = useRouter()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`/api/products/${id}`)
                const data = await res.json()

                if (res.ok) {
                    setProduct(data.product)
                    // Fetch related products (same category)
                    fetchRelated(data.product.category?._id || data.product.category, data.product._id)
                } else {
                    setError(data.error || 'Product not found')
                }
            } catch (err) {
                console.error('Fetch product error:', err)
                setError('Failed to load product')
            } finally {
                setIsLoading(false)
            }
        }

        const fetchRelated = async (categoryId, currentId) => {
            try {
                // Fetch products by category ID
                const res = await fetch(`/api/products?category_id=${categoryId}&limit=5`)
                const data = await res.json()
                if (res.ok) {
                    setRelatedProducts(data.products.filter(p => p._id !== currentId).slice(0, 4))
                }
            } catch (err) {
                console.error('Fetch related products error:', err)
            }
        }

        if (id) fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        if (!product) return
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
        setAdded(true)
        toast.success(`${quantity}x ${product.name} added to cart!`, {
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
        setTimeout(() => setAdded(false), 2000)
    }

    const handleBuyNow = () => {
        if (!product) return
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
        router.push('/cart')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
                <AlertCircle className="w-16 h-16 text-danger mb-4" />
                <h2 className="text-2xl font-bold text-secondary mb-2">{error || 'Product Not Found'}</h2>
                <p className="text-text-secondary mb-6 text-center max-w-md">The product you&apos;re looking for might have been removed or is temporarily unavailable.</p>
                <Link href="/products" className="bg-primary text-white font-medium py-3 px-8 rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-[0.98]">
                    Browse All Products
                </Link>
            </div>
        )
    }

    const savedAmount = (product.originalPrice || 0) - product.price
    const categoryName = product.category?.name || 'Category'
    const categorySlug = product.category?.slug || ''

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary flex-wrap gap-y-1">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                        {categorySlug && (
                            <>
                                <Link href={`/products?category=${categorySlug}`} className="hover:text-primary transition-colors">
                                    {categoryName}
                                </Link>
                                <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                            </>
                        )}
                        <span className="text-secondary font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="md:hidden px-4 py-3">
                <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12">

                    {/* Product Image */}
                    <div className="w-full md:w-1/2 lg:w-5/12">
                        <div className="relative bg-white rounded-2xl overflow-hidden border border-border p-4 md:p-8 aspect-square flex items-center justify-center shadow-sm">
                            {(product.discount > 0) && (
                                <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                                    {product.discount}% OFF
                                </span>
                            )}
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="text-8xl">💊</div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 lg:w-7/12">
                        {/* Category Label */}
                        {categorySlug && (
                            <Link
                                href={`/products?category=${categorySlug}`}
                                className="inline-block text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 hover:bg-primary/20 transition-colors"
                            >
                                {categoryName.toUpperCase()}
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="text-2xl md:text-4xl font-black text-secondary mb-4 leading-tight">{product.name}</h1>

                        {/* Price Section */}
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl md:text-5xl font-black text-primary">Rs. {product.price}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-xl text-gray-400 line-through mb-1.5">Rs. {product.originalPrice}</span>
                            )}
                        </div>
                        {savedAmount > 0 && (
                            <p className="text-sm text-success font-bold mb-6 flex items-center gap-1.5">
                                <span className="bg-success/10 px-2 py-0.5 rounded">SAVE Rs. {savedAmount}</span>
                                <span className="text-text-secondary font-medium">({product.discount}% off)</span>
                            </p>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-8 pb-8 border-b border-border">
                            {product.stock > 0 ? (
                                <>
                                    <div className="w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-sm font-bold text-success">In Stock</span>
                                    <span className="text-xs text-text-secondary font-medium">({product.stock} units available)</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 bg-danger rounded-full"></div>
                                    <span className="text-sm font-bold text-danger">Out of Stock</span>
                                    <p className="text-xs text-text-secondary">Notify me when available</p>
                                </>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <label className="text-sm font-bold text-secondary mb-3 block">QUANTITY</label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center border border-border rounded-xl bg-gray-50 overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors cursor-pointer text-secondary disabled:opacity-30"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-14 h-12 flex items-center justify-center text-lg font-bold text-secondary">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors cursor-pointer text-secondary disabled:opacity-30"
                                        disabled={quantity >= (product.stock || 99)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-text-secondary ml-2 font-medium">Maximum 10 units per order</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-[1.5] py-4 px-8 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.98] ${added
                                    ? 'bg-success text-white'
                                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-primary/30'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {added ? (
                                    <><Check className="w-6 h-6" /> ADDED!</>
                                ) : (
                                    <><ShoppingCart className="w-6 h-6" /> ADD TO CART</>
                                )}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 py-4 px-8 rounded-2xl font-black text-lg border-2 border-primary text-primary hover:bg-primary/5 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                BUY NOW
                            </button>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                                <h3 className="text-lg font-black text-secondary mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" /> ITEM DETAILS
                                </h3>
                                <div className="text-text-secondary text-sm leading-relaxed space-y-4">
                                    {product.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 md:mt-24 pb-12 border-t border-border pt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-secondary">You May Also <span className="text-primary">Need</span></h2>
                                <p className="text-text-secondary text-sm md:text-base mt-1">Based on this category</p>
                            </div>
                            <Link
                                href={`/products?category=${categorySlug}`}
                                className="text-sm font-bold text-primary hover:underline hidden md:block"
                            >
                                EXPLORE MORE →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
