"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'


const toastStyle = { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }

export default function AddProductPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        subcategory: '',
        item: '',
        stock: '',
    })

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            const data = await res.json()
            if (res.ok) setCategories(data.categories || [])
        } catch (error) {
            toast.error('Failed to load categories')
        }
    }

    const fetchProduct = async (id) => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/products/${id}`)
            const data = await res.json()
            if (res.ok) {
                const p = data.product
                setForm({
                    name: p.name,
                    description: p.description || '',
                    price: p.price,
                    discount: p.discount || '',
                    category: p.category?._id || p.category,
                    subcategory: p.subcategory || '',
                    item: p.item || '',
                    stock: p.stock || '',
                })
                if (p.image) setImagePreview(p.image)
            } else {
                toast.error(data.error || 'Product not found')
                router.push('/admin/products')
            }
        } catch (error) {
            toast.error('Failed to load product details')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
        if (editId) {
            fetchProduct(editId)
        }
    }, [editId])

    const update = (field, value) => {
        const newForm = { ...form, [field]: value }
        if (field === 'category') {
            newForm.subcategory = ''
            newForm.item = ''
        }
        if (field === 'subcategory') {
            newForm.item = ''
        }
        setForm(newForm)
    }

    // Get data for cascading dropdowns from real categories
    const selectedCat = categories.find(c => c._id === form.category)
    const selectedSub = selectedCat?.subcategories.find(s => s.slug === form.subcategory || s._id === form.subcategory)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category) {
            toast.error('Please fill required fields', { style: toastStyle })
            return
        }

        setIsSubmitting(true)
        try {
            let imageUrl = imagePreview // Use existing image if no new file is uploaded

            // 1. Upload image if present (and changed)
            if (imageFile) {
                // Convert file to base64
                const base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(imageFile)
                    reader.onload = () => resolve(reader.result)
                    reader.onerror = error => reject(error)
                })

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64Image,
                        folder: 'hope-pharmacy/products'
                    })
                })

                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed')
                imageUrl = uploadData.url
            }

            // 2. Save/Update product
            const url = editId ? `/api/products/${editId}` : '/api/products'
            const method = editId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    discount: Number(form.discount || 0),
                    stock: Number(form.stock || 0),
                    image: imageUrl
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to save product')

            toast.success(editId ? 'Product updated!' : 'Product saved!', { style: toastStyle })
            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-text-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading product details...</p>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/products" className="text-text-secondary hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-secondary">{editId ? 'Edit Product' : 'Add Product'}</h1>
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

                    {/* Cascading Category Dropdowns */}
                    <div className="space-y-3 p-4 bg-background rounded-xl border border-border">
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Category Assignment</p>

                        {/* Level 1: Category */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">
                                Category <span className="text-danger">*</span>
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => update('category', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Level 2: Subcategory (shows only when category selected) */}
                        {selectedCat && selectedCat.subcategories.length > 0 && (
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">
                                    Subcategory <span className="text-text-secondary font-normal">(optional)</span>
                                </label>
                                <select
                                    value={form.subcategory}
                                    onChange={(e) => update('subcategory', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                    <option value="">All {selectedCat.name}</option>
                                    {selectedCat.subcategories.map(sub => (
                                        <option key={sub._id} value={sub.slug}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Level 3: Item (shows only when subcategory selected and has items) */}
                        {selectedSub && selectedSub.items.length > 0 && (
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5">
                                    Item <span className="text-text-secondary font-normal">(optional)</span>
                                </label>
                                <select
                                    value={form.item}
                                    onChange={(e) => update('item', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                    <option value="">All {selectedSub.name}</option>
                                    {selectedSub.items.map(item => (
                                        <option key={item._id} value={item.slug}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Visual breadcrumb preview */}
                        {form.category && (
                            <div className="flex items-center gap-1 text-xs text-primary font-medium pt-1">
                                <span>{selectedCat?.name}</span>
                                {form.subcategory && <><span className="text-text-secondary">›</span><span>{selectedSub?.name}</span></>}
                                {form.item && <><span className="text-text-secondary">›</span><span>{selectedSub?.items.find(i => i.slug === form.item)?.name}</span></>}
                            </div>
                        )}
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

                    {/* Image Upload Placeholder */}
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Product Image</label>
                        <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="image-upload"
                            className="block border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer overflow-hidden max-h-[200px]"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="max-h-[160px] mx-auto rounded-lg object-contain" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
                                    <p className="text-xs text-text-secondary">Click to upload image</p>
                                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                                </>
                            )}
                        </label>
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
