import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, ChevronRight, ArrowLeft, Package, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { products } from '../services/mockData'
import ProductCard from '../components/ui/ProductCard'
import toast from 'react-hot-toast'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    const product = products.find((p) => p.id === Number(id))

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Product Not Found</h2>
                <p className="text-text-secondary mb-6">The product you're looking for doesn't exist.</p>
                <Link to="/products" className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                    Browse Products
                </Link>
            </div>
        )
    }

    // Related products (same category, exclude current)
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)

    const handleAddToCart = () => {
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
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
        navigate('/cart')
    }

    const savedAmount = product.originalPrice - product.price

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
                            {product.category}
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-1.5" />
                        <span className="text-secondary font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="md:hidden px-4 py-3">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12">

                    {/* Product Image */}
                    <div className="w-full md:w-1/2 lg:w-5/12">
                        <div className="relative bg-white rounded-2xl overflow-hidden border border-border p-4 md:p-8 aspect-square flex items-center justify-center">
                            {product.discount > 0 && (
                                <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                                    {product.discount}% OFF
                                </span>
                            )}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 lg:w-7/12">
                        {/* Category */}
                        <Link
                            to={`/products?category=${product.category}`}
                            className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 hover:bg-primary/20 transition-colors"
                        >
                            {product.category}
                        </Link>

                        {/* Name */}
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-4">{product.name}</h1>

                        {/* Price Section */}
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl md:text-4xl font-bold text-primary">Rs. {product.price}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-lg text-gray-400 line-through mb-1">Rs. {product.originalPrice}</span>
                            )}
                        </div>
                        {savedAmount > 0 && (
                            <p className="text-sm text-success font-medium mb-5">
                                You save Rs. {savedAmount} ({product.discount}% off)
                            </p>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
                            {product.stock > 0 ? (
                                <>
                                    <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-success">In Stock</span>
                                    <span className="text-xs text-text-secondary">({product.stock} available)</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2.5 h-2.5 bg-danger rounded-full"></div>
                                    <span className="text-sm font-medium text-danger">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-secondary mb-2 block">Quantity</label>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-14 h-10 flex items-center justify-center text-lg font-semibold text-secondary bg-gray-50 rounded-lg">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-gray-100 transition-colors cursor-pointer"
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${added
                                        ? 'bg-success text-white'
                                        : 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {added ? (
                                    <><Check className="w-5 h-5" /> Added to Cart!</>
                                ) : (
                                    <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                                )}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-xl border border-border p-5 md:p-6">
                                <h3 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" /> Description
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 pb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-secondary">Related Products</h2>
                            <Link
                                to={`/products?category=${product.category}`}
                                className="text-sm text-primary font-medium hover:underline hidden md:block"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDetail
