"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpDown, ChevronRight, X } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { products as allProducts, categories } from '@/services/mockData'

const PRODUCTS_PER_PAGE = 12

const ProductsContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
    const [sortBy, setSortBy] = useState('popular')
    const [showSortModal, setShowSortModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

    // Load More
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

    // Filtered products
    const [filteredProducts, setFilteredProducts] = useState(allProducts)

    // Sync URL with filters
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (selectedCategory !== 'All') {
            params.set('category', selectedCategory.toLowerCase())
        } else {
            params.delete('category')
        }

        if (searchQuery) {
            params.set('search', searchQuery)
        } else {
            params.delete('search')
        }

        const query = params.toString()
        const url = query ? `${pathname}?${query}` : pathname
        router.replace(url, { scroll: false })
    }, [selectedCategory, searchQuery, pathname, router])

    // Filter Logic
    useEffect(() => {
        let temp = [...allProducts]

        // Search filter
        if (searchQuery) {
            temp = temp.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Category Filter
        if (selectedCategory !== 'All') {
            temp = temp.filter(
                (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        }



        // Sorting
        if (sortBy === 'price-low') {
            temp.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            temp.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'newest') {
            temp.sort((a, b) => b.id - a.id)
        } else if (sortBy === 'discount') {
            temp.sort((a, b) => b.discount - a.discount)
        }

        setFilteredProducts(temp)
        setVisibleCount(PRODUCTS_PER_PAGE) // Reset on filter change
    }, [selectedCategory, sortBy, searchQuery])

    const visibleProducts = filteredProducts.slice(0, visibleCount)
    const hasMore = visibleCount < filteredProducts.length

    const clearAllFilters = () => {
        setSelectedCategory('All')
        setSortBy('popular')
        setSearchQuery('')
    }

    return (
        <div className="bg-background min-h-screen">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-secondary font-medium">
                            {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile category pills removed — users navigate via /categories page now */}

            {/* Mobile Sort Top Bar */}
            <div className="md:hidden flex gap-3 px-4 py-3 bg-white border-b border-border">
                <button
                    onClick={() => setShowSortModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-full text-sm font-semibold shadow-sm active:scale-95 transition-transform"
                >
                    <ArrowUpDown className="w-4 h-4" /> Sort
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                            {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>

                    {/* Desktop Sort */}
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-sm text-text-secondary">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                        >
                            <option value="popular">Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">Price: High → Low</option>
                            <option value="discount">Best Deals</option>
                        </select>
                    </div>
                </div>

                {/* Search query indicator */}
                {searchQuery && (
                    <div className="mb-4 flex items-center gap-2 text-sm bg-primary/5 text-primary px-4 py-2 rounded-lg">
                        <span>Searching for: <strong>"{searchQuery}"</strong></span>
                        <button onClick={() => setSearchQuery('')} className="ml-auto hover:text-accent">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="flex gap-8">

                    {/* Products Grid */}
                    <div className="flex-1">
                        {visibleProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {visibleProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Load More */}
                                {hasMore && (
                                    <div className="text-center mt-10">
                                        <button
                                            onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                                            className="px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            Load More Products
                                        </button>
                                        <p className="text-xs text-text-secondary mt-2">
                                            Showing {visibleProducts.length} of {filteredProducts.length}
                                        </p>
                                    </div>
                                )}
                            </>
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
                                    onClick={clearAllFilters}
                                    className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>





            {/* Mobile Sort Slide-up Modal */}
            {showSortModal && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowSortModal(false)}
                    ></div>

                    {/* Panel */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-secondary">Sort By</h2>
                            <button
                                onClick={() => setShowSortModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            {[
                                { value: 'popular', label: 'Popular' },
                                { value: 'newest', label: 'Newest' },
                                { value: 'price-low', label: 'Price: Low → High' },
                                { value: 'price-high', label: 'Price: High → Low' },
                                { value: 'discount', label: 'Best Deals' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value)
                                        setShowSortModal(false)
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${sortBy === option.value
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortBy === option.value ? 'border-primary' : 'border-gray-300'
                                        }`}>
                                        {sortBy === option.value && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                        )}
                                    </span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading Products...</div>}>
            <ProductsContent />
        </Suspense>
    )
}
