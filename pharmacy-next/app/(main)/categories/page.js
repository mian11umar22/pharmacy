"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Search, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeLevel, setActiveLevel] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (res.ok) {
                    setCategories(data.categories)
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Get current title for header
    const getTitle = () => {
        if (activeLevel === 3 && selectedSubcategory) return selectedSubcategory.name
        if (activeLevel === 2 && selectedCategory) return selectedCategory.name
        return 'All Categories'
    }

    // Handle back navigation
    const goBack = () => {
        if (activeLevel === 3) {
            setActiveLevel(2)
            setSelectedSubcategory(null)
        } else if (activeLevel === 2) {
            setActiveLevel(1)
            setSelectedCategory(null)
        }
    }

    // Filter categories by search
    const filteredCategories = searchQuery
        ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : categories

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen pb-20">

            {/* Header */}
            <div className="bg-white sticky top-0 z-30 border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        {activeLevel > 1 && (
                            <button
                                onClick={goBack}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5 text-secondary" />
                            </button>
                        )}
                        <h1 className="text-xl font-black text-secondary">{getTitle()}</h1>
                    </div>
                </div>
            </div>

            {/* Search (Level 1 only) */}
            {activeLevel === 1 && (
                <div className="px-4 py-3 bg-white border-b border-border">
                    <div className="relative max-w-7xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                        />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
                    </div>
                </div>
            )}

            {/* Breadcrumbs (Level 2+) */}
            {activeLevel > 1 && (
                <div className="px-4 py-2 bg-white border-b border-border">
                    <div className="flex items-center gap-1 text-xs text-text-secondary max-w-7xl mx-auto">
                        <button onClick={() => { setActiveLevel(1); setSelectedCategory(null); setSelectedSubcategory(null) }} className="hover:text-primary transition-colors cursor-pointer">
                            All
                        </button>
                        {selectedCategory && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <button
                                    onClick={() => { setActiveLevel(2); setSelectedSubcategory(null) }}
                                    className={clsx("cursor-pointer", activeLevel === 2 ? "text-primary font-bold" : "hover:text-primary transition-colors")}
                                >
                                    {selectedCategory.name}
                                </button>
                            </>
                        )}
                        {selectedSubcategory && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-primary font-bold">{selectedSubcategory.name}</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-4">

                {/* Level 1: Main Categories */}
                {activeLevel === 1 && (
                    <div className="grid grid-cols-1 gap-2 animate-fade-in">
                        {filteredCategories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => {
                                    setSelectedCategory(category)
                                    setActiveLevel(2)
                                    setSearchQuery('')
                                }}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.98] cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl ${category.bgColor || 'bg-primary/5'} flex items-center justify-center`}>
                                    <span className={`text-lg font-black ${category.letterColor || 'text-primary'}`}>{category.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{category.name}</h3>
                                    <p className="text-xs text-text-secondary mt-0.5">
                                        {category.subcategories?.length || 0} subcategories
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                            </button>
                        ))}

                        {filteredCategories.length === 0 && (
                            <div className="text-center py-12 text-text-secondary">
                                <Search className="w-10 h-10 mx-auto mb-4 text-text-secondary/50" />
                                <p className="font-bold">No categories found</p>
                                <p className="text-sm mt-1">Try a different search term</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Level 2: Subcategories */}
                {activeLevel === 2 && selectedCategory && (
                    <div className="grid grid-cols-1 gap-2 animate-fade-in">
                        {/* View all products in this category */}
                        <Link
                            href={`/products?category=${selectedCategory.slug}`}
                            className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all group shadow-sm active:scale-[0.98]"
                        >
                            <div className={`w-10 h-10 rounded-xl ${selectedCategory.bgColor || 'bg-primary/10'} flex items-center justify-center`}>
                                <span className={`text-sm font-black ${selectedCategory.letterColor || 'text-primary'}`}>{selectedCategory.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-primary">View All {selectedCategory.name}</h3>
                                <p className="text-xs text-primary/70 mt-0.5">Browse all products</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </Link>

                        {selectedCategory.subcategories?.map((sub) => (
                            sub.items?.length === 0 ? (
                                // No Level 3 items — go directly to products
                                <Link
                                    key={sub._id}
                                    href={`/products?category=${selectedCategory.slug}&sub=${sub.slug}`}
                                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.98]"
                                >
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{sub.name}</h3>
                                        <p className="text-xs text-text-secondary mt-0.5">Browse products</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                                </Link>
                            ) : (
                                // Has Level 3 items — drill down
                                <button
                                    key={sub._id}
                                    onClick={() => {
                                        setSelectedSubcategory(sub)
                                        setActiveLevel(3)
                                    }}
                                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.98] cursor-pointer"
                                >
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{sub.name}</h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            {sub.items?.length || 0} items
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                                </button>
                            )
                        ))}
                    </div>
                )}

                {/* Level 3: Items (Final level - links to products) */}
                {activeLevel === 3 && selectedSubcategory && (
                    <div className="grid grid-cols-1 gap-2 animate-fade-in">
                        {/* View all products in this subcategory */}
                        <Link
                            href={`/products?category=${selectedCategory.slug}&sub=${selectedSubcategory.slug}`}
                            className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all group shadow-sm active:scale-[0.98]"
                        >
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-primary">View All {selectedSubcategory.name}</h3>
                                <p className="text-xs text-primary/70 mt-0.5">Browse all products</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </Link>

                        {selectedSubcategory.items?.map((item) => (
                            <Link
                                key={item._id}
                                href={`/products?category=${selectedCategory.slug}&sub=${selectedSubcategory.slug}&item=${item.slug}`}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.98]"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium text-secondary group-hover:text-primary transition-colors">{item.name}</h3>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
