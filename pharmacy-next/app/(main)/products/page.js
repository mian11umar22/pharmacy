"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpDown, ChevronRight, ChevronDown, X, Search, Loader2 } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'

const PRODUCTS_PER_PAGE = 12

const ProductsContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // URL Params
    const categoryParam = searchParams.get('category') || ''
    const subParam = searchParams.get('sub') || ''
    const itemParam = searchParams.get('item') || ''
    const sortBy = searchParams.get('sort') || 'popular'
    const searchQuery = searchParams.get('search') || ''
    const pageParam = parseInt(searchParams.get('page')) || 1

    // State
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)

    // Sidebar expanded state
    const [expandedCats, setExpandedCats] = useState(categoryParam ? [categoryParam] : [])
    const [expandedSubs, setExpandedSubs] = useState(subParam ? [`${categoryParam}/${subParam}`] : [])

    // Resolve active category names for display
    const activeCat = categories.find(c => c.slug === categoryParam)
    const activeSub = activeCat?.subcategories?.find(s => s.slug === subParam)
    const activeItem = activeSub?.items?.find(i => i.slug === itemParam)

    // Fetch Categories for Sidebar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (res.ok) {
                    setCategories(data.categories)
                    // If we have a category in URL, make sure its parent is expanded
                    if (categoryParam) setExpandedCats(prev => [...new Set([...prev, categoryParam])])
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setIsCategoriesLoading(false)
            }
        }
        fetchCategories()
    }, [categoryParam])

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const params = new URLSearchParams()
                if (categoryParam) params.set('category', categoryParam)
                if (subParam) params.set('sub', subParam)
                if (itemParam) params.set('item', itemParam)
                if (searchQuery) params.set('search', searchQuery)
                if (sortBy) params.set('sort', sortBy)
                params.set('page', pageParam.toString())
                params.set('limit', PRODUCTS_PER_PAGE.toString())

                const res = await fetch(`/api/products?${params.toString()}`)
                const data = await res.json()
                if (res.ok) {
                    setProducts(data.products)
                    setTotalProducts(data.total)
                }
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [categoryParam, subParam, itemParam, sortBy, searchQuery, pageParam])

    const getPageTitle = () => {
        if (activeItem) return activeItem.name
        if (activeSub) return activeSub.name
        if (activeCat) return activeCat.name
        return 'All Products'
    }

    const updateURL = (newParams) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null) params.delete(key)
            else params.set(key, value)
        })
        // Reset page on filter change if not specified
        if (!newParams.page) params.delete('page')

        router.push(`${pathname}?${params.toString()}`)
    }

    const clearAllFilters = () => {
        router.push('/products')
        setExpandedCats([])
        setExpandedSubs([])
    }

    const toggleCat = (catSlug) => {
        setExpandedCats(prev =>
            prev.includes(catSlug) ? prev.filter(s => s !== catSlug) : [...prev, catSlug]
        )
    }

    const toggleSub = (key) => {
        setExpandedSubs(prev =>
            prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
        )
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-text-secondary flex-wrap gap-y-1">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />

                        {!activeCat ? (
                            <span className="text-secondary font-medium">All Products</span>
                        ) : (
                            <>
                                <button onClick={() => updateURL({ category: null, sub: null, item: null })} className="hover:text-primary transition-colors">Products</button>
                                <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                                {!activeSub ? (
                                    <span className="text-secondary font-medium">{activeCat.name}</span>
                                ) : (
                                    <>
                                        <button onClick={() => updateURL({ sub: null, item: null })} className="hover:text-primary transition-colors">{activeCat.name}</button>
                                        <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                                        {!activeItem ? (
                                            <span className="text-secondary font-medium">{activeSub.name}</span>
                                        ) : (
                                            <>
                                                <button onClick={() => updateURL({ item: null })} className="hover:text-primary transition-colors">{activeSub.name}</button>
                                                <ChevronRight className="w-4 h-4 mx-1.5 flex-shrink-0" />
                                                <span className="text-secondary font-medium">{activeItem.name}</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                            {getPageTitle()}
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            {isLoading ? 'Searching...' : `${totalProducts} ${totalProducts === 1 ? 'product' : 'products'} found`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary hidden md:block">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => updateURL({ sort: e.target.value })}
                            className="w-full md:w-auto px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                        >
                            <option value="popular">Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">Price: High → Low</option>
                            <option value="discount">Best Deals</option>
                        </select>
                    </div>
                </div>

                {searchQuery && (
                    <div className="mb-4 flex items-center gap-2 text-sm bg-primary/5 text-primary px-4 py-2 rounded-lg">
                        <span>Searching for: <strong>&quot;{searchQuery}&quot;</strong></span>
                        <button onClick={() => updateURL({ search: null })} className="ml-auto hover:text-accent p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Hide on mobile, show on desktop */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-border p-4 sticky top-24">
                            <h3 className="font-bold text-secondary text-sm mb-3">Categories</h3>

                            {isCategoriesLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-gray-50 rounded animate-pulse"></div>)}
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => clearAllFilters()}
                                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors mb-1 ${!categoryParam ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-gray-50 hover:text-secondary'}`}
                                    >
                                        All Products
                                    </button>

                                    <div className="space-y-0.5">
                                        {categories.map(cat => (
                                            <div key={cat._id}>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => updateURL({ category: cat.slug, sub: null, item: null })}
                                                        className={`flex-1 text-left text-sm py-2 px-3 rounded-lg transition-colors truncate ${categoryParam === cat.slug && !subParam ? 'bg-primary/10 text-primary font-semibold' : categoryParam === cat.slug ? 'text-primary font-medium' : 'text-text-secondary hover:bg-gray-50 hover:text-secondary'}`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                    {cat.subcategories?.length > 0 && (
                                                        <button
                                                            onClick={() => toggleCat(cat.slug)}
                                                            className="p-1 text-text-secondary hover:text-primary cursor-pointer"
                                                        >
                                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCats.includes(cat.slug) ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>

                                                {expandedCats.includes(cat.slug) && cat.subcategories?.map(sub => (
                                                    <div key={sub._id} className="ml-4">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => updateURL({ category: cat.slug, sub: sub.slug, item: null })}
                                                                className={`flex-1 text-left text-xs py-1.5 px-3 rounded-lg transition-colors truncate ${subParam === sub.slug && !itemParam ? 'bg-primary/10 text-primary font-semibold' : subParam === sub.slug ? 'text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-secondary'}`}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                            {sub.items?.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleSub(`${cat.slug}/${sub.slug}`)}
                                                                    className="p-1 text-text-secondary hover:text-primary cursor-pointer"
                                                                >
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedSubs.includes(`${cat.slug}/${sub.slug}`) ? 'rotate-180' : ''}`} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {expandedSubs.includes(`${cat.slug}/${sub.slug}`) && sub.items?.map(item => (
                                                            <button
                                                                key={item._id}
                                                                onClick={() => updateURL({ category: cat.slug, sub: sub.slug, item: item.slug })}
                                                                className={`block w-full text-left text-xs py-1.5 px-3 ml-4 rounded-lg transition-colors truncate ${itemParam === item.slug ? 'text-primary font-semibold' : 'text-text-secondary hover:bg-gray-50 hover:text-secondary'}`}
                                                            >
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-white rounded-2xl border border-border animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {totalProducts > PRODUCTS_PER_PAGE && (
                                    <div className="flex justify-center mt-10 gap-2">
                                        {Array.from({ length: Math.ceil(totalProducts / PRODUCTS_PER_PAGE) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateURL({ page: (i + 1).toString() })}
                                                className={`w-10 h-10 rounded-lg border font-semibold transition-all ${pageParam === i + 1 ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-secondary border-border hover:border-primary'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <Search className="w-12 h-12 text-text-secondary/40 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-secondary mb-2">No products found</h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <ProductsContent />
        </Suspense>
    )
}
