"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ProductCard from '../ui/ProductCard'
import ProductSkeleton from '../ui/ProductSkeleton'

// Hook: fires once when element enters viewport
function useInView(options = {}) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true)
                observer.disconnect() // fire only once
            }
        }, { threshold: 0.1, ...options })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, inView]
}

const FeaturedProducts = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [sectionRef, sectionInView] = useInView()

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=8&sort=popularity')
                const data = await res.json()
                if (res.ok) {
                    setProducts(data.products)
                }
            } catch (error) {
                console.error('Failed to fetch featured products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFeaturedProducts()
    }, [])

    return (
        <section ref={sectionRef} className="py-14 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div
                    className={`flex justify-between items-end mb-8 transition-all duration-700 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-secondary mb-2 tracking-tight">
                            Best <span className="text-primary">Sellers</span>
                        </h2>
                        <p className="text-sm md:text-base text-text-secondary font-medium">
                            Most popular healthcare essentials trusted by our customers
                        </p>
                    </div>
                    <Link href="/products" className="text-primary font-bold hover:underline mb-1 text-sm md:text-base hidden md:block">
                        View All Products →
                    </Link>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))
                    ) : products.length > 0 ? (
                        products.map((product, index) => (
                            <div
                                key={product._id}
                                className="h-full transition-all duration-700"
                                style={{
                                    transitionDelay: `${index * 80}ms`,
                                    opacity: sectionInView ? 1 : 0,
                                    transform: sectionInView ? 'translateY(0)' : 'translateY(32px)',
                                }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-text-secondary">
                            No products found at the moment.
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/products"
                        className="bg-primary text-white font-bold py-3 px-6 rounded-xl block shadow-md hover:bg-primary/90 transition-colors"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts