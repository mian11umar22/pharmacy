import { Link } from 'react-router-dom'
import ProductCard from '../ui/ProductCard'
import { products } from '../../services/mockData'

const FeaturedProducts = () => {
    // Select top 4 products for featured section
    const featuredItems = products.slice(0, 4)

    return (
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div className="animate-fade-up">
                        <h2 className="text-3xl font-bold text-secondary mb-2">Featured Products</h2>
                        <p className="text-text-secondary">Top selling medicines and healthcare products</p>
                    </div>
                    <Link to="/products" className="text-primary font-semibold hover:text-primary-dark transition-colors hidden md:block">
                        View All &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredItems.map((product, index) => (
                        <div
                            key={product.id}
                            className="h-full animate-fade-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/products" className="btn-outline w-full block">View All Products</Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
