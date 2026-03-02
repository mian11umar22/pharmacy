"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (res.ok) {
                    // Show only categories marked as featured, or first 6 as fallback
                    const featured = data.categories.filter(c => c.isFeatured)
                    setCategories(featured.length > 0 ? featured : data.categories.slice(0, 6))
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    if (isLoading) {
        return (
            <section className="py-12 md:py-20 bg-background/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 md:h-64 rounded-3xl bg-white border border-border/50 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (categories.length === 0) return null

    return (
        <section className="py-12 md:py-20 bg-background/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center md:items-end md:flex-row justify-between mb-8 md:mb-12 gap-4 text-center md:text-left">
                    <div className="animate-fade-up">
                        <h2 className="text-2xl md:text-4xl font-black text-secondary mb-2 tracking-tight">Popular <span className="text-primary">Categories</span></h2>
                        <p className="text-sm md:text-base text-text-secondary font-medium">Top quality products from trusted healthcare brands</p>
                    </div>
                    <Link href="/products" className="text-primary font-bold hover:underline mb-1 text-sm md:text-base">
                        View All Categories →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat._id}
                            href={`/products?category=${cat.slug}`}
                            className="group relative flex flex-col items-center p-4 md:p-8 rounded-2xl md:rounded-[32px] bg-white border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon or Image Placeholder */}
                            <div className={`relative z-10 w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/5 flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <span className={`text-xl md:text-3xl font-black text-primary`}>
                                    {cat.name.charAt(0)}
                                </span>
                            </div>
                            <h3 className="relative z-10 font-bold text-secondary text-center tracking-tight text-sm md:text-lg group-hover:text-primary transition-colors">
                                {cat.name}
                            </h3>

                            {/* Decorative dot */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories
