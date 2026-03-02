"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '../ui/ProductCard'
import ProductSkeleton from '../ui/ProductSkeleton'

const FeaturedProducts = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch the latest 8 products as "featured"
                const res = await fetch('/api/products?limit=8&sort=newest')
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
        <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div className="animate-fade-up">
                        <h2 className="text-2xl md:text-4xl font-black text-secondary mb-2 tracking-tight">Featured <span className="text-primary">Products</span></h2>
                        <p className="text-sm md:text-base text-text-secondary font-medium">Top quality medicines and healthcare essentials</p>
                    </div>
                    <Link href="/products" className="text-primary font-bold hover:underline mb-1 text-sm md:text-base hidden md:block">
                        View All Products →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))
                    ) : products.length > 0 ? (
                        products.map((product, index) => (
                            <div
                                key={product._id}
                                className="h-full animate-fade-up"
                                style={{ animationDelay: `${index * 100}ms` }}
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
                    <Link href="/products" className="bg-primary text-white font-bold py-3 px-6 rounded-xl block shadow-md">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
