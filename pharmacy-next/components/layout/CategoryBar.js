"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CATEGORIES_DATA } from '../../lib/categories-data'
import { clsx } from 'clsx'

const CategoryBar = () => {
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeSubcategory, setActiveSubcategory] = useState(null)

    const handleCategoryEnter = (category) => {
        setActiveCategory(category.id)
        if (category.subcategories.length > 0) {
            setActiveSubcategory(category.subcategories[0].id)
        }
    }

    const handleCategoryLeave = () => {
        setActiveCategory(null)
        setActiveSubcategory(null)
    }

    const activeCat = CATEGORIES_DATA.find(c => c.id === activeCategory)
    const activeSub = activeCat?.subcategories.find(s => s.id === activeSubcategory)

    return (
        <div className="hidden md:block bg-white border-b border-border relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-1">
                    {CATEGORIES_DATA.map((category) => (
                        <div
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => handleCategoryEnter(category)}
                            onMouseLeave={handleCategoryLeave}
                        >
                            <Link
                                href={`/products?category=${category.id}`}
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-3 text-sm font-bold transition-colors border-b-2",
                                    activeCategory === category.id
                                        ? "text-primary border-primary"
                                        : "text-secondary border-transparent hover:text-primary"
                                )}
                            >
                                {category.name}
                                <ChevronDown className={clsx(
                                    "w-3.5 h-3.5 transition-transform",
                                    activeCategory === category.id && "rotate-180"
                                )} />
                            </Link>

                            {/* Mega Menu Dropdown */}
                            {activeCategory === category.id && (
                                <div
                                    className="absolute top-full left-0 z-[100] pt-0"
                                    onMouseEnter={() => handleCategoryEnter(category)}
                                    onMouseLeave={handleCategoryLeave}
                                >
                                    <div className="bg-white shadow-2xl rounded-b-2xl border border-border border-t-0 flex min-w-[550px] overflow-hidden">

                                        {/* Left: Subcategories */}
                                        <div className="w-[200px] bg-gray-50 border-r border-border py-2">
                                            {category.subcategories.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onMouseEnter={() => setActiveSubcategory(sub.id)}
                                                    className={clsx(
                                                        "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-all",
                                                        activeSubcategory === sub.id
                                                            ? "bg-primary text-white font-bold"
                                                            : "text-secondary hover:bg-gray-100 font-medium"
                                                    )}
                                                >
                                                    {sub.name}
                                                    <ChevronRight className={clsx(
                                                        "w-4 h-4",
                                                        activeSubcategory === sub.id ? "text-white" : "text-text-secondary"
                                                    )} />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Right: Items (Level 3) */}
                                        <div className="flex-1 p-5 min-h-[250px]">
                                            {activeSub && (
                                                <>
                                                    <h3 className="font-black text-secondary text-base mb-3 pb-2 border-b border-border">
                                                        {activeSub.name}
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                        {activeSub.items.map((item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/products?category=${category.id}&sub=${activeSub.id}&item=${item.id}`}
                                                                className="text-sm text-text-secondary hover:text-primary py-1.5 transition-colors flex items-center gap-2 group"
                                                            >
                                                                <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <Link
                                                        href={`/products?category=${category.id}&sub=${activeSub.id}`}
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
                </nav>
            </div>
        </div>
    )
}

export default CategoryBar
