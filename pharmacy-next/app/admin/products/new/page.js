"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = ['Pain Relief', 'Vitamins', 'Antibiotics', 'Nutrition', 'Skin Care', 'First Aid', 'Baby Care']

export default function AddProductPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        stock: '',
    })

    const update = (field, value) => setForm({ ...form, [field]: value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category) {
            toast.error('Please fill required fields', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
            return
        }

        setIsSubmitting(true)
        await new Promise(r => setTimeout(r, 1000))
        toast.success('Product saved successfully!', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
        setIsSubmitting(false)
        router.push('/admin/products')
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/products" className="text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-secondary">Add Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1.5">
                            Product Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Panadol Extra 500mg"
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Description</label>
                        <textarea
                            placeholder="Product description..."
                            rows="3"
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">
                                Price (Rs.) <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={form.price}
                                onChange={(e) => update('price', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Discount (%)</label>
                            <input
                                type="number"
                                placeholder="0"
                                min="0"
                                max="100"
                                value={form.discount}
                                onChange={(e) => update('discount', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">
                                Category <span className="text-danger">*</span>
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => update('category', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                                <option value="">Select...</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Stock</label>
                            <input
                                type="number"
                                placeholder="0"
                                min="0"
                                value={form.stock}
                                onChange={(e) => update('stock', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Image Upload Placeholder */}
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Product Image</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <p className="text-2xl mb-1">📷</p>
                            <p className="text-xs text-text-secondary">Click to upload image</p>
                            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
            </form>
        </div>
    )
}
