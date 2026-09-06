"use client"

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ChevronRight, ChevronLeft, ArrowLeft, Package, Check, Loader2, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ui/ProductCard'
import PrescriptionUploadModal from '@/components/ui/PrescriptionUploadModal'
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
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [added, setAdded] = useState(false)
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const [pendingAction, setPendingAction] = useState(null) // 'cart' | 'buy'

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

    // Pushes `quantity` units into the cart, optionally tagging each with the
    // uploaded prescription so it rides along into the checkout payload.
    const addItemsToCart = (prescriptionData) => {
        let addedCount = 0;
        for (let i = 0; i < quantity; i++) {
            const wasAdded = addToCart({ ...product, size: selectedSize, ...(prescriptionData || {}) })
            if (wasAdded) addedCount++;
        }
        return addedCount
    }

    const handleAddToCart = () => {
        if (!product) return
        if (product.variants?.length > 0 && !selectedSize) {
            toast.error('Please select a size first!', { position: 'bottom-center' })
            return
        }

        if (product.requiresPrescription) {
            setPendingAction('cart')
            setShowPrescriptionModal(true)
            return
        }

        const addedCount = addItemsToCart()

        if (addedCount === 0) {
            toast.error('Could not add to cart. Stock limit reached.', {
                position: 'bottom-center',
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }
            })
            return;
        }

        setAdded(true)
        toast.success(`${addedCount}x ${product.name} added to cart!`, {
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
        if (product.variants?.length > 0 && !selectedSize) {
            toast.error('Please select a size first!', { position: 'bottom-center' })
            return
        }

        if (product.requiresPrescription) {
            setPendingAction('buy')
            setShowPrescriptionModal(true)
            return
        }

        const addedCount = addItemsToCart()
        if (addedCount > 0) {
            router.push('/cart')
        }
    }

    const handlePrescriptionUploaded = (prescriptionData) => {
        const addedCount = addItemsToCart(prescriptionData)

        if (addedCount === 0) {
            toast.error('Could not add to cart. Stock limit reached.', {
                position: 'bottom-center',
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }
            })
            return
        }

        if (pendingAction === 'buy') {
            router.push('/cart')
        } else {
            setAdded(true)
            toast.success(`${addedCount}x ${product.name} added to cart!`, {
                duration: 2000,
                position: 'bottom-center',
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                iconTheme: { primary: '#0D9E71', secondary: '#fff' },
            })
            setTimeout(() => setAdded(false), 2000)
        }
        setPendingAction(null)
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

    const selectedVariant = product.variants?.find(v => v.size === selectedSize)
    const currentPrice = selectedVariant ? selectedVariant.price : product.price
    const currentOriginalPrice = selectedVariant ? Math.round(selectedVariant.price / (1 - (product.discount || 0) / 100)) : (product.originalPrice || 0)

    const savedAmount = currentOriginalPrice - currentPrice
    const categoryName = product.category?.name || 'Category'
    const categorySlug = product.category?.slug || ''

    const galleryImages = (product.images && product.images.length > 0)
        ? product.images.map(img => typeof img === 'string' ? img : img.url).filter(Boolean)
        : (product.image ? [product.image] : [])

    const activeImage = galleryImages[selectedImageIndex] || product.image

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

                    {/* Product Image Gallery (Daraz Style) */}
                    <div className="w-full md:w-1/2 lg:w-5/12">
                        {/* Main Display Box */}
                        <div className="relative bg-white rounded-2xl overflow-hidden border border-border p-4 md:p-8 aspect-square flex items-center justify-center shadow-sm group">
                            {product.discount > 0 && (
                                <span className="absolute top-4 left-4 bg-accent text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                                    {product.discount}% OFF
                                </span>
                            )}

                            {galleryImages.length > 1 && (
                                <span className="absolute top-4 right-4 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
                                    {selectedImageIndex + 1}/{galleryImages.length}
                                </span>
                            )}

                            {activeImage ? (
                                <Image
                                    src={activeImage}
                                    alt={product.name}
                                    fill
                                    className="w-full h-full object-contain hover:scale-105 transition-all duration-300"
                                    priority
                                />
                            ) : (
                                <div className="text-8xl">💊</div>
                            )}

                            {/* Chevron Next / Prev Controls */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full shadow-md backdrop-blur-sm opacity-80 hover:opacity-100 transition-all cursor-pointer z-10"
                                        aria-label="Previous Image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImageIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full shadow-md backdrop-blur-sm opacity-80 hover:opacity-100 transition-all cursor-pointer z-10"
                                        aria-label="Next Image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Row (Click/Hover to switch - Daraz Style) */}
                        {galleryImages.length > 1 && (
                            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                                {galleryImages.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedImageIndex(idx)}
                                        onMouseEnter={() => setSelectedImageIndex(idx)}
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white p-1 flex-shrink-0 cursor-pointer transition-all ${
                                            selectedImageIndex === idx
                                                ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm'
                                                : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                                        }`}
                                    >
                                        <Image
                                            src={imgUrl}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
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
                            <span className="text-3xl md:text-5xl font-black text-primary">Rs. {currentPrice}</span>
                            {currentOriginalPrice > currentPrice && (
                                <span className="text-xl text-gray-400 line-through mb-1.5">Rs. {currentOriginalPrice}</span>
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
                            {(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? (
                                <>
                                    <div className="w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-sm font-bold text-success">In Stock</span>
                                    <span className="text-xs text-text-secondary font-medium">({selectedVariant ? selectedVariant.stock : product.stock} units available)</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 bg-danger rounded-full"></div>
                                    <span className="text-sm font-bold text-danger">Out of Stock</span>
                                    <p className="text-xs text-text-secondary">Notify me when available</p>
                                </>
                            )}
                        </div>

                        {/* Size Selection (Conditionally shown for garments/items with variants) */}
                        {product.variants?.length > 0 && (
                            <div className="mb-8">
                                <label className="text-sm font-bold text-secondary mb-3 block flex items-center justify-between">
                                    SELECT SIZE
                                    {selectedSize && <span className="text-primary text-xs font-black">SELECTED: {selectedSize}</span>}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v._id || v.size}
                                            onClick={() => setSelectedSize(v.size)}
                                            disabled={v.stock === 0}
                                            className={`min-w-[50px] h-12 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center cursor-pointer ${selectedSize === v.size
                                                ? 'border-primary bg-primary text-white shadow-md'
                                                : 'border-border bg-white text-secondary hover:border-primary/50'
                                                } ${v.stock === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                        >
                                            {v.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                        onClick={() => {
                                            const currentMaxStock = selectedVariant ? selectedVariant.stock : (product.stock || 0);
                                            if (quantity >= currentMaxStock) {
                                                toast.error('Out of stock', {
                                                    style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '12px' }
                                                });
                                                return;
                                            }
                                            setQuantity(quantity + 1);
                                        }}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors cursor-pointer text-secondary disabled:opacity-30"
                                        disabled={quantity >= (selectedVariant ? selectedVariant.stock : (product.stock || 0))}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-text-secondary ml-2 font-medium">
                                    {(selectedVariant ? selectedVariant.stock : (product.stock || 0)) <= 0 ? 'Out of stock' : `${selectedVariant ? selectedVariant.stock : (product.stock || 0)} available`}
                                </p>
                            </div>
                        </div>

                        {/* Prescription Required Notice */}
                        {product.requiresPrescription && (
                            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-warning/10 border border-warning/30 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
                                <p className="text-xs font-bold text-warning">Prescription required — you&apos;ll be asked to upload one before this is added to your cart</p>
                            </div>
                        )}

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

            <PrescriptionUploadModal
                isOpen={showPrescriptionModal}
                onClose={() => { setShowPrescriptionModal(false); setPendingAction(null) }}
                onUploaded={handlePrescriptionUploaded}
                productName={product.name}
            />
        </div>
    )
}
