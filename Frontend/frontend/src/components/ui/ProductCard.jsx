import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const ProductCard = ({ product }) => {
    const { addToCart } = useCart()

    return (
        <div className="card group relative flex flex-col h-full animate-fade-up">
            {/* Discount Badge */}
            {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                    {product.discount}% OFF
                </span>
            )}

            {/* Image */}
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl bg-gray-50 aspect-square mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-text-secondary">{product.category}</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        {product.rating}
                    </div>
                </div>

                <Link to={`/product/${product.id}`} className="font-bold text-secondary text-base mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                </Link>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex flex-col">
                        {product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
                        )}
                        <span className="text-primary font-bold text-lg">Rs. {product.price}</span>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="btn-primary py-1.5 px-3 text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
