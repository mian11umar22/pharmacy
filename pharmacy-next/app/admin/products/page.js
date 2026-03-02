"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'


export default function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/products')
            const data = await res.json()
            if (res.ok) setProducts(data.products || [])
        } catch (error) {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Delete failed')
            setProducts(products.filter(p => p._id !== id))
            toast.success('Product deleted', { style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' } })
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-secondary">Products</h1>
                    <p className="text-sm text-text-secondary mt-1">{products.length} products</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
                {filtered.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl border border-border p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                ) : '💊'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-secondary text-sm truncate">{product.name}</p>
                                <p className="text-xs text-text-secondary">{product.category?.name || '—'}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="font-bold text-primary text-sm">Rs. {product.price}</span>
                                    {product.discount > 0 && (
                                        <span className="text-[10px] font-bold text-white bg-accent px-1.5 py-0.5 rounded">
                                            -{product.discount}%
                                        </span>
                                    )}
                                    <span className="text-xs text-text-secondary">Stock: {product.stock}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                            <Link
                                href={`/admin/products/new?edit=${product._id}`}
                                className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary font-medium cursor-pointer"
                            >
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="flex items-center gap-1 text-xs text-text-secondary hover:text-danger font-medium cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs text-text-secondary border-b border-border bg-gray-50/50">
                            <th className="text-left px-5 py-3 font-medium">Product</th>
                            <th className="text-left px-5 py-3 font-medium">Category</th>
                            <th className="text-left px-5 py-3 font-medium">Price</th>
                            <th className="text-left px-5 py-3 font-medium">Discount</th>
                            <th className="text-left px-5 py-3 font-medium">Stock</th>
                            <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        {product.image ? (
                                            <img src={product.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">💊</div>
                                        )}
                                        <span className="text-sm font-medium text-secondary">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-text-secondary">{product.category?.name || '—'}</td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-secondary">Rs. {product.price}</td>
                                <td className="px-5 py-3.5">
                                    {product.discount > 0 ? (
                                        <span className="text-xs font-bold text-white bg-accent px-2 py-0.5 rounded">
                                            -{product.discount}%
                                        </span>
                                    ) : (
                                        <span className="text-xs text-text-secondary">—</span>
                                    )}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-sm font-medium ${product.stock <= 10 ? 'text-danger' : 'text-secondary'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3 justify-center">
                                        <Link
                                            href={`/admin/products/new?edit=${product._id}`}
                                            className="text-text-secondary hover:text-primary transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-text-secondary hover:text-danger transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-3xl mb-2">📦</p>
                    <p className="text-sm text-text-secondary">No products found</p>
                </div>
            )}
        </div>
    )
}
