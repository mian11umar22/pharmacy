"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const MAX_VISIBLE = 6 // Show max 6 categories, rest in "More" dropdown

const CategoryBar = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeSubcategory, setActiveSubcategory] = useState(null)
    const [showMore, setShowMore] = useState(false)

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

    const visibleCategories = categories.slice(0, MAX_VISIBLE)
    const overflowCategories = categories.slice(MAX_VISIBLE)

    const handleCategoryEnter = (category) => {
        setActiveCategory(category._id)
        if (category.subcategories && category.subcategories.length > 0) {
            setActiveSubcategory(category.subcategories[0]._id)
        }
    }

    const handleCategoryLeave = () => {
        setActiveCategory(null)
        setActiveSubcategory(null)
    }

    const activeCat = categories.find(c => c._id === activeCategory)
    const activeSub = activeCat?.subcategories?.find(s => s._id === activeSubcategory)

    // Shared mega menu renderer
    const renderMegaMenu = (category) => (
        <div
            className="absolute top-full left-0 z-[100] pt-0"
            onMouseEnter={() => handleCategoryEnter(category)}
            onMouseLeave={handleCategoryLeave}
        >
            <div className="bg-white shadow-2xl rounded-b-2xl border border-border border-t-0 flex min-w-[550px] overflow-hidden">
                {/* Left: Subcategories */}
                <div className="w-[200px] bg-gray-50 border-r border-border py-2">
                    {category.subcategories?.map((sub) => (
                        <button
                            key={sub._id}
                            onMouseEnter={() => setActiveSubcategory(sub._id)}
                            className={clsx(
                                "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-all",
                                activeSubcategory === sub._id
                                    ? "bg-primary text-white font-bold"
                                    : "text-secondary hover:bg-gray-100 font-medium"
                            )}
                        >
                            {sub.name}
                            <ChevronRight className={clsx(
                                "w-4 h-4",
                                activeSubcategory === sub._id ? "text-white" : "text-text-secondary"
                            )} />
                        </button>
                    ))}
                </div>

                {/* Right: Items (Level 3) */}
                <div className="flex-1 p-5 min-h-[250px]">
                    {activeSub && activeCat?._id === category._id && (
                        <>
                            <h3 className="font-black text-secondary text-base mb-3 pb-2 border-b border-border">
                                {activeSub.name}
                            </h3>
                            {activeSub.items?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                    {activeSub.items.map((item) => (
                                        <Link
                                            key={item._id}
                                            href={`/products?category=${category.slug}&sub=${activeSub.slug}&item=${item.slug}`}
                                            className="text-sm text-text-secondary hover:text-primary py-1.5 transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text-secondary">Browse all products in this subcategory.</p>
                            )}
                            <Link
                                href={`/products?category=${category.slug}&sub=${activeSub.slug}`}
                                className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
                            >
                                View All {activeSub.name} →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="hidden md:block bg-white border-b border-border h-11">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full">
                    <div className="flex gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="hidden md:block bg-white border-b border-border relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-1">
                    {/* Visible Categories */}
                    {visibleCategories.map((category) => (
                        <div
                            key={category._id}
                            className="relative"
                            onMouseEnter={() => handleCategoryEnter(category)}
                            onMouseLeave={handleCategoryLeave}
                        >
                            <Link
                                href={`/products?category=${category.slug}`}
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-3 text-sm font-bold transition-colors border-b-2",
                                    activeCategory === category._id
                                        ? "text-primary border-primary"
                                        : "text-secondary border-transparent hover:text-primary"
                                )}
                            >
                                {category.name}
                                <ChevronDown className={clsx(
                                    "w-3.5 h-3.5 transition-transform",
                                    activeCategory === category._id && "rotate-180"
                                )} />
                            </Link>

                            {/* Mega Menu */}
                            {activeCategory === category._id && renderMegaMenu(category)}
                        </div>
                    ))}

                    {/* "More ▼" dropdown for overflow categories */}
                    {overflowCategories.length > 0 && (
                        <div
                            className="relative"
                            onMouseEnter={() => setShowMore(true)}
                            onMouseLeave={() => { setShowMore(false); handleCategoryLeave() }}
                        >
                            <button
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-3 text-sm font-bold transition-colors border-b-2 cursor-pointer",
                                    showMore
                                        ? "text-primary border-primary"
                                        : "text-secondary border-transparent hover:text-primary"
                                )}
                            >
                                More
                                <ChevronDown className={clsx(
                                    "w-3.5 h-3.5 transition-transform",
                                    showMore && "rotate-180"
                                )} />
                            </button>

                            {showMore && (
                                <div className="absolute top-full right-0 z-[100] pt-0">
                                    <div className="bg-white shadow-2xl rounded-b-2xl border border-border border-t-0 min-w-[200px] py-2 overflow-hidden">
                                        {overflowCategories.map((cat) => (
                                            <div
                                                key={cat._id}
                                                className="relative"
                                                onMouseEnter={() => handleCategoryEnter(cat)}
                                            >
                                                <Link
                                                    href={`/products?category=${cat.slug}`}
                                                    className={clsx(
                                                        "flex items-center justify-between px-4 py-2.5 text-sm transition-all",
                                                        activeCategory === cat._id
                                                            ? "bg-primary/10 text-primary font-bold"
                                                            : "text-secondary hover:bg-gray-50 font-medium"
                                                    )}
                                                >
                                                    {cat.name}
                                                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                                                </Link>

                                                {/* Sub mega menu for overflow items */}
                                                {activeCategory === cat._id && (
                                                    <div className="absolute top-0 right-full z-[101] pr-0">
                                                        <div className="bg-white shadow-2xl rounded-l-2xl border border-border flex min-w-[500px] overflow-hidden">
                                                            <div className="w-[200px] bg-gray-50 border-r border-border py-2">
                                                                {cat.subcategories?.map((sub) => (
                                                                    <button
                                                                        key={sub._id}
                                                                        onMouseEnter={() => setActiveSubcategory(sub._id)}
                                                                        className={clsx(
                                                                            "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-all",
                                                                            activeSubcategory === sub._id
                                                                                ? "bg-primary text-white font-bold"
                                                                                : "text-secondary hover:bg-gray-100 font-medium"
                                                                        )}
                                                                    >
                                                                        {sub.name}
                                                                        <ChevronRight className={clsx(
                                                                            "w-4 h-4",
                                                                            activeSubcategory === sub._id ? "text-white" : "text-text-secondary"
                                                                        )} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="flex-1 p-5 min-h-[200px]">
                                                                {activeSub && activeCat?._id === cat._id && (
                                                                    <>
                                                                        <h3 className="font-black text-secondary text-base mb-3 pb-2 border-b border-border">
                                                                            {activeSub.name}
                                                                        </h3>
                                                                        {activeSub.items?.length > 0 ? (
                                                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                                                {activeSub.items.map((item) => (
                                                                                    <Link
                                                                                        key={item._id}
                                                                                        href={`/products?category=${cat.slug}&sub=${activeSub.slug}&item=${item.slug}`}
                                                                                        className="text-sm text-text-secondary hover:text-primary py-1.5 transition-colors flex items-center gap-2 group"
                                                                                    >
                                                                                        <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
                                                                                        {item.name}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-sm text-text-secondary">Browse all products in this subcategory.</p>
                                                                        )}
                                                                        <Link
                                                                            href={`/products?category=${cat.slug}&sub=${activeSub.slug}`}
                                                                            className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
                                                                        >
                                                                            View All {activeSub.name} →
                                                                        </Link>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default CategoryBar
