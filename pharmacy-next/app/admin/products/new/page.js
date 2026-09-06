"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Upload, Loader2, Trash2, Plus, Sparkles, Star } from 'lucide-react'
import toast from 'react-hot-toast'


const toastStyle = { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }

export default function AddProductPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('edit')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([]) // Array of { id, url, publicId, file }

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        subcategory: '',
        item: '',
        stock: '',
        salesCount: '',
        variants: [], // { size: '', price: '', stock: '' }
        requiresPrescription: false,
    })

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/categories')
            const data = await res.json()
            if (res.ok) setCategories(data.categories || [])
        } catch (error) {
            toast.error('Failed to load categories')
        }
    }, [])

    const fetchProduct = useCallback(async (id) => {
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
                    salesCount: p.salesCount || 0,
                    variants: p.variants || [],
                    requiresPrescription: p.requiresPrescription || false,
                })

                if (Array.isArray(p.images) && p.images.length > 0) {
                    setImages(p.images.map((img, i) => ({
                        id: `existing-${i}-${Date.now()}`,
                        url: img.url,
                        publicId: img.publicId || '',
                        file: null
                    })))
                } else if (p.image) {
                    setImages([{
                        id: `existing-0-${Date.now()}`,
                        url: p.image,
                        publicId: p.imagePublicId || '',
                        file: null
                    }])
                } else {
                    setImages([])
                }
            } else {
                toast.error(data.error || 'Product not found')
                router.push('/admin/products')
            }
        } catch (error) {
            toast.error('Failed to load product details')
        } finally {
            setIsLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchCategories()
        if (editId) {
            fetchProduct(editId)
        }
    }, [editId, fetchCategories, fetchProduct])

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

    const addVariant = () => {
        setForm(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', price: prev.price, stock: '' }]
        }))
    }

    const removeVariant = (index) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }))
    }

    const updateVariant = (index, field, value) => {
        const newVariants = [...form.variants]
        newVariants[index] = { ...newVariants[index], [field]: value }
        setForm(prev => ({ ...prev, variants: newVariants }))
    }

    // Image handlers (Max 4)
    const handleImageFilesChange = (e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        if (images.length + files.length > 4) {
            toast.error('Maximum 4 images allowed per product', { style: toastStyle })
        }

        const availableSlots = 4 - images.length
        if (availableSlots <= 0) return

        const filesToAdd = files.slice(0, availableSlots)
        const newItems = filesToAdd.map(file => ({
            id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: URL.createObjectURL(file),
            publicId: '',
            file: file,
        }))

        setImages(prev => [...prev, ...newItems])
        e.target.value = ''
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const setAsPrimaryImage = (index) => {
        if (index === 0) return
        setImages(prev => {
            const copy = [...prev]
            const [selected] = copy.splice(index, 1)
            copy.unshift(selected)
            return copy
        })
        toast.success('Set as primary main image', { style: toastStyle })
    }

    // Get data for cascading dropdowns from real categories
    const selectedCat = categories.find(c => c._id === form.category)
    const selectedSub = selectedCat?.subcategories.find(s => s.slug === form.subcategory || s._id === form.subcategory)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category) {
            toast.error('Please fill required fields', { style: toastStyle })
            return
        }

        // Validate variants if any exist
        if (form.variants.length > 0) {
            const invalidVariant = form.variants.find(v => !v.size || !v.price || !v.stock)
            if (invalidVariant) {
                toast.error('Please fill all Size, Price, and Stock fields for all variants', { style: toastStyle })
                return
            }
        }

        setIsSubmitting(true)
        try {
            // Upload all new image files to Cloudinary concurrently
            const uploadedImages = await Promise.all(
                images.map(async (img) => {
                    if (img.file) {
                        const base64Image = await new Promise((resolve, reject) => {
                            const reader = new FileReader()
                            reader.readAsDataURL(img.file)
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

                        return { url: uploadData.url, publicId: uploadData.publicId }
                    } else {
                        return { url: img.url, publicId: img.publicId }
                    }
                })
            )

            // 2. Save/Update product
            const url = editId ? `/api/products/${editId}` : '/api/products'
            const method = editId ? 'PUT' : 'POST'

            const primaryImage = uploadedImages[0]?.url || ''
            const primaryPublicId = uploadedImages[0]?.publicId || ''

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    discount: Number(form.discount || 0),
                    stock: Number(form.stock || 0),
                    salesCount: Number(form.salesCount || 0),
                    variants: form.variants.map(v => ({
                        ...v,
                        price: Number(v.price),
                        stock: Number(v.stock)
                    })),
                    images: uploadedImages,
                    image: primaryImage,
                    imagePublicId: primaryPublicId,
                    requiresPrescription: form.requiresPrescription
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

    const handleGenerateAI = async () => {
        if (!form.name) {
            toast.error('Please enter a Product Name first', { style: toastStyle })
            return
        }

        setIsGeneratingAI(true)
        try {
            const catName = categories.find(c => c._id === form.category)?.name || ''
            
            const res = await fetch('/api/admin/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    category: catName,
                })
            })
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate')
            }
            
            update('description', data.description)
            toast.success('Description generated successfully!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message, { style: toastStyle })
        } finally {
            setIsGeneratingAI(false)
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
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-secondary">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={isGeneratingAI}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {isGeneratingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                {isGeneratingAI ? 'Generating...' : 'Write with AI'}
                            </button>
                        </div>
                        <textarea
                            placeholder="Product description..."
                            rows="5"
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

                    <label className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.requiresPrescription}
                            onChange={(e) => update('requiresPrescription', e.target.checked)}
                            className="w-5 h-5 rounded accent-primary cursor-pointer"
                        />
                        <div>
                            <p className="text-sm font-semibold text-secondary">Requires Prescription</p>
                            <p className="text-[10px] text-text-secondary">Customers must upload a prescription image before adding this to cart</p>
                        </div>
                    </label>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Sales Count (Popularity)</label>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={form.salesCount}
                            onChange={(e) => update('salesCount', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Variant Management (Sizes) */}
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-bold text-secondary">Product Variants (Sizes)</h3>
                                <p className="text-[10px] text-text-secondary">Add sizes like S, M, L, XL for garments</p>
                            </div>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Size
                            </button>
                        </div>

                        {form.variants.length > 0 ? (
                            <div className="space-y-3">
                                {form.variants.map((variant, index) => (
                                    <div key={index} className="flex items-end gap-2 bg-background p-3 rounded-xl border border-border">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-text-secondary mb-1">
                                                SIZE <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. XL"
                                                value={variant.size}
                                                onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-[10px] font-bold text-text-secondary mb-1">
                                                PRICE <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-[10px] font-bold text-text-secondary mb-1">
                                                STOCK <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors mb-0.5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-[10px] text-text-secondary">No sizes added. Default price/stock will be used.</p>
                            </div>
                        )}
                    </div>

                    {/* Image Upload Manager (Max 4 images) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-secondary">
                                Product Images ({images.length}/4)
                            </label>
                            <span className="text-[11px] text-text-secondary">
                                First image will be the primary main image
                            </span>
                        </div>

                        <input
                            type="file"
                            id="images-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={images.length >= 4}
                            onChange={handleImageFilesChange}
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {images.map((img, index) => (
                                <div
                                    key={img.id || index}
                                    className={`relative group rounded-xl border p-2 flex flex-col items-center justify-center bg-gray-50 aspect-square overflow-hidden transition-all ${
                                        index === 0 ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border'
                                    }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`Product Image ${index + 1}`}
                                        fill
                                        className="object-contain p-1"
                                    />

                                    {/* Primary Badge */}
                                    {index === 0 ? (
                                        <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                            <Star className="w-2.5 h-2.5 fill-current" /> Main
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setAsPrimaryImage(index)}
                                            className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-primary text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            Set Main
                                        </button>
                                    )}

                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1.5 right-1.5 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                        title="Remove Image"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Image Card */}
                            {images.length < 4 && (
                                <label
                                    htmlFor="images-upload"
                                    className="border-2 border-dashed border-border rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer aspect-square"
                                >
                                    <Upload className="w-6 h-6 mb-1 text-text-secondary" />
                                    <p className="text-xs font-semibold text-secondary">Add Image</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Max 4 images</p>
                                </label>
                            )}
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
