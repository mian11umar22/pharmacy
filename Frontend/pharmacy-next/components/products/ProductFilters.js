"use client"

import { categories } from '@/services/mockData'

const ProductFilters = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange }) => {
    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-bold text-secondary mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category === selectedCategory ? 'All' : category)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className={`text-sm ${selectedCategory === category ? 'text-primary font-semibold' : 'text-text-secondary group-hover:text-primary transition-colors'}`}>
                                {category}
                            </span>
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === 'All'}
                            onChange={() => setSelectedCategory('All')}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className={`text-sm ${selectedCategory === 'All' ? 'text-primary font-semibold' : 'text-text-secondary group-hover:text-primary transition-colors'}`}>
                            All Products
                        </span>
                    </label>
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-bold text-secondary mb-4">Price Range</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-20 pl-8 pr-2 py-1 text-sm border border-border rounded-md focus:outline-none focus:border-primary"
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-20 pl-8 pr-2 py-1 text-sm border border-border rounded-md focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>
                <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full mt-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Rs. 0</span>
                    <span>Rs. 5000+</span>
                </div>
            </div>
        </div>
    )
}

export default ProductFilters
