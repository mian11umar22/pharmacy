"use client"

import { categories } from '@/services/mockData'

const ProductFilters = ({ selectedCategory, setSelectedCategory }) => {
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
        </div>
    )
}

export default ProductFilters
