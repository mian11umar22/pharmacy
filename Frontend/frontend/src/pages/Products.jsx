import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import { products as initialProducts } from '../services/mockData'

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState(initialProducts)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })
    const [sortBy, setSortBy] = useState('popular')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Sync URL with Category
    useEffect(() => {
        if (selectedCategory !== 'All') {
            setSearchParams({ category: selectedCategory })
        } else {
            setSearchParams({})
        }
    }, [selectedCategory, setSearchParams])

    // Filter Logic
    useEffect(() => {
        let tempProducts = [...products]

        // Category Filter
        if (selectedCategory !== 'All' && selectedCategory.toLowerCase() !== 'all') {
            tempProducts = tempProducts.filter(
                (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        }

        // Price Filter
        tempProducts = tempProducts.filter(
            (p) => p.price >= priceRange.min && p.price <= priceRange.max
        )

        // Sorting
        if (sortBy === 'price-low') {
            tempProducts.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            tempProducts.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'newest') {
            // Mock newest logic (id based)
            tempProducts.sort((a, b) => b.id - a.id)
        }

        setFilteredProducts(tempProducts)
    }, [products, selectedCategory, priceRange, sortBy])

    return (
        <div className="bg-background min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Mobile Filter Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary">All Products</h1>
                        <p className="text-text-secondary text-sm mt-1">
                            Showing {filteredProducts.length} results
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="md:hidden flex items-center gap-2 btn-outline w-full justify-center"
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm text-text-secondary whitespace-nowrap hidden md:block">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-field w-full md:w-48 py-2 md:py-1.5 text-sm"
                            >
                                <option value="popular">Popularity</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className={`w-full md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-border sticky top-24">
                            <div className="flex items-center justify-between md:hidden mb-4">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <button onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                                    ✕
                                </button>
                            </div>
                            <ProductFilters
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
                                    🔍
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">No products found</h3>
                                <p className="text-text-secondary text-center max-w-xs mb-6">
                                    Try adjusting your filters or search criteria.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All')
                                        setPriceRange({ min: 0, max: 5000 })
                                    }}
                                    className="btn-primary"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
