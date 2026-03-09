"use client"

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, ChevronRight, ChevronDown, ArrowLeft, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import { CATEGORIES_DATA } from '@/lib/categories-data'

const COLOR_OPTIONS = [
    { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-600' },
    { name: 'Green', bg: 'bg-green-100', text: 'text-green-600' },
    { name: 'Orange', bg: 'bg-orange-100', text: 'text-orange-600' },
    { name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-600' },
    { name: 'Emerald', bg: 'bg-emerald-100', text: 'text-emerald-600' },
    { name: 'Sky', bg: 'bg-sky-100', text: 'text-sky-600' },
    { name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-600' },
    { name: 'Red', bg: 'bg-red-100', text: 'text-red-600' },
    { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { name: 'Teal', bg: 'bg-teal-100', text: 'text-teal-600' },
]

const toastStyle = { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    // View state: which level we're viewing
    const [currentView, setCurrentView] = useState('list') // 'list', 'subcategories', 'items'
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)

    // Add form state
    const [newName, setNewName] = useState('')
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [isFeatured, setIsFeatured] = useState(false)

    // Edit state
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editIsFeatured, setEditIsFeatured] = useState(false)

    // Fetch categories on mount
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/categories')
            const data = await res.json()
            if (res.ok) {
                setCategories(data.categories || [])
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    // ===================== LEVEL 1: Categories =====================
    const handleAddCategory = async () => {
        if (!newName.trim()) return

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName.trim(),
                    bgColor: selectedColor.bg,
                    letterColor: selectedColor.text,
                    isFeatured: isFeatured
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories([...categories, data.category])
            setNewName('')
            setIsFeatured(false)
            toast.success('Category added!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleEditCategory = async (catId) => {
        if (!editName.trim()) return
        try {
            const res = await fetch(`/api/categories/${catId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim(), isFeatured: editIsFeatured })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === catId ? data.category : c))
            setEditingId(null)
            toast.success('Category updated!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteCategory = async (catId) => {
        if (!confirm('Are you sure? All subcategories will be deleted.')) return
        try {
            const res = await fetch(`/api/categories/${catId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Delete failed')

            setCategories(categories.filter(c => c._id !== catId))
            toast.success('Category deleted!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleFeatured = (catId) => {
        setCategories(categories.map(c =>
            c.id === catId ? { ...c, isFeatured: !c.isFeatured } : c
        ))
    }

    // ===================== LEVEL 2: Subcategories =====================
    const handleAddSubcategory = async () => {
        if (!newName.trim() || !selectedCategory) return
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: selectedCategory._id,
                    name: newName.trim()
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            setSelectedCategory(data.category)
            setNewName('')
            toast.success('Subcategory added!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleEditSubcategory = async (subId) => {
        if (!editName.trim()) return
        try {
            const res = await fetch(`/api/categories/${selectedCategory._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subcategoryId: subId,
                    name: editName.trim()
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            setSelectedCategory(data.category)
            setEditingId(null)
            toast.success('Subcategory updated!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteSubcategory = async (subId) => {
        try {
            const res = await fetch(`/api/categories/${selectedCategory._id}?sub=${subId}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            setSelectedCategory(data.category)
            toast.success('Subcategory deleted!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    // ===================== LEVEL 3: Items =====================
    const handleAddItem = async () => {
        if (!newName.trim() || !selectedCategory || !selectedSubcategory) return
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: selectedCategory._id,
                    subcategoryId: selectedSubcategory._id,
                    name: newName.trim()
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            const updatedCat = data.category
            setSelectedCategory(updatedCat)
            setSelectedSubcategory(updatedCat.subcategories.find(s => s._id === selectedSubcategory._id))
            setNewName('')
            toast.success('Item added!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleEditItem = async (itemId) => {
        if (!editName.trim()) return
        try {
            const res = await fetch(`/api/categories/${selectedCategory._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subcategoryId: selectedSubcategory._id,
                    itemId: itemId,
                    name: editName.trim()
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            const updatedCat = data.category
            setSelectedCategory(updatedCat)
            setSelectedSubcategory(updatedCat.subcategories.find(s => s._id === selectedSubcategory._id))
            setEditingId(null)
            toast.success('Item updated!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteItem = async (itemId) => {
        try {
            const res = await fetch(`/api/categories/${selectedCategory._id}?sub=${selectedSubcategory._id}&item=${itemId}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setCategories(categories.map(c => c._id === selectedCategory._id ? data.category : c))
            const updatedCat = data.category
            setSelectedCategory(updatedCat)
            setSelectedSubcategory(updatedCat.subcategories.find(s => s._id === selectedSubcategory._id))
            toast.success('Item deleted!', { style: toastStyle })
        } catch (error) {
            toast.error(error.message)
        }
    }

    // ===================== Navigation helpers =====================
    const goToSubcategories = (cat) => {
        setSelectedCategory(cat)
        setCurrentView('subcategories')
        setNewName('')
        setEditingId(null)
    }

    const goToItems = (sub) => {
        setSelectedSubcategory(sub)
        setCurrentView('items')
        setNewName('')
        setEditingId(null)
    }

    const goBack = () => {
        if (currentView === 'items') {
            setCurrentView('subcategories')
            setSelectedSubcategory(null)
        } else if (currentView === 'subcategories') {
            setCurrentView('list')
            setSelectedCategory(null)
        }
        setNewName('')
        setEditingId(null)
    }

    // ===================== Get current title =====================
    const getTitle = () => {
        if (currentView === 'items') return selectedSubcategory?.name
        if (currentView === 'subcategories') return selectedCategory?.name
        return 'Categories'
    }

    const getBreadcrumb = () => {
        if (currentView === 'items') return `${selectedCategory?.name} > ${selectedSubcategory?.name}`
        if (currentView === 'subcategories') return selectedCategory?.name
        return null
    }

    // ===================== Inline edit row =====================
    const EditableRow = ({ id, name, onSave, onDelete, children, leftIcon }) => (
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors">
            {leftIcon}
            {editingId === id ? (
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSave(id)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-background text-sm focus:outline-none"
                        autoFocus
                    />
                    <button onClick={() => onSave(id)} className="text-success cursor-pointer">
                        <Check className="w-4.5 h-4.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 cursor-pointer">
                        <X className="w-4.5 h-4.5" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary truncate">{name}</p>
                        {children}
                    </div>
                    <button
                        onClick={() => { setEditingId(id); setEditName(name) }}
                        className="text-text-secondary hover:text-primary transition-colors cursor-pointer p-1"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="text-text-secondary hover:text-danger transition-colors cursor-pointer p-1"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    )

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    {currentView !== 'list' && (
                        <button onClick={goBack} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h1 className="text-xl sm:text-2xl font-bold text-secondary">{getTitle()}</h1>
                </div>
                {getBreadcrumb() && (
                    <p className="text-xs text-text-secondary mt-1 ml-8">{getBreadcrumb()}</p>
                )}
            </div>

            {/* ==================== LEVEL 1: Categories List ==================== */}
            {currentView === 'list' && (
                <>
                    {/* Add Category Form */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-4 space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New category name..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>

                        {/* Color Picker + Featured */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="flex items-center gap-2 text-xs font-medium text-text-secondary border border-border rounded-lg px-3 py-1.5 hover:border-primary transition-colors cursor-pointer"
                                >
                                    <div className={`w-4 h-4 rounded-full ${selectedColor.bg}`}></div>
                                    {selectedColor.name}
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                {showColorPicker && (
                                    <div className="absolute top-full mt-1 left-0 bg-white border border-border rounded-xl shadow-xl z-50 p-2 grid grid-cols-5 gap-1.5 min-w-[180px]">
                                        {COLOR_OPTIONS.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => { setSelectedColor(color); setShowColorPicker(false) }}
                                                className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center hover:ring-2 hover:ring-primary cursor-pointer transition-all ${selectedColor.name === color.name ? 'ring-2 ring-primary' : ''}`}
                                                title={color.name}
                                            >
                                                {selectedColor.name === color.name && <Check className={`w-3 h-3 ${color.text}`} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-xs font-medium text-text-secondary cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                                />
                                Show on Homepage
                            </label>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border">
                        {categories.length === 0 && (
                            <p className="text-center text-sm text-text-secondary py-8">No categories yet. Add your first one above!</p>
                        )}
                        {categories.map((cat) => (
                            <div key={cat._id} className="px-4 sm:px-5 py-3 hover:bg-gray-50 transition-colors">
                                {editingId === cat._id ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(cat._id)}
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-background text-sm focus:outline-none"
                                                autoFocus
                                            />
                                            <button onClick={() => handleEditCategory(cat._id)} className="text-success cursor-pointer">
                                                <Check className="w-4.5 h-4.5" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="text-gray-400 cursor-pointer">
                                                <X className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                        <label className="flex items-center gap-2 text-xs font-medium text-text-secondary cursor-pointer select-none ml-1">
                                            <input
                                                type="checkbox"
                                                checked={editIsFeatured}
                                                onChange={(e) => setEditIsFeatured(e.target.checked)}
                                                className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                                            />
                                            Show on Homepage
                                        </label>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => goToSubcategories(cat)}
                                    >
                                        {/* Color circle */}
                                        <div className={`w-9 h-9 rounded-full ${cat.bgColor} flex items-center justify-center flex-shrink-0`}>
                                            <span className={`text-sm font-bold ${cat.letterColor}`}>{cat.name.charAt(0)}</span>
                                        </div>

                                        {/* Name and info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-secondary">{cat.name}</p>
                                            <p className="text-xs text-text-secondary">
                                                {cat.subcategories.length} subcategories
                                                {cat.isFeatured && <span className="ml-1.5 text-primary font-semibold">· Homepage</span>}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => { setEditingId(cat._id); setEditName(cat.name); setEditIsFeatured(cat.isFeatured || false) }}
                                                className="text-text-secondary hover:text-primary transition-colors cursor-pointer p-1.5"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat._id)}
                                                className="text-text-secondary hover:text-danger transition-colors cursor-pointer p-1.5"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <ChevronRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-[11px] text-text-secondary mt-3 text-center">
                        Click a category to manage its subcategories
                    </p>
                </>
            )}

            {/* ==================== LEVEL 2: Subcategories ==================== */}
            {currentView === 'subcategories' && selectedCategory && (
                <>
                    {/* Add Subcategory Form */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="New subcategory name..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory()}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={handleAddSubcategory}
                            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>

                    {/* Subcategories List */}
                    <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border">
                        {selectedCategory.subcategories.length === 0 && (
                            <p className="text-center text-sm text-text-secondary py-8">No subcategories yet. Add one above!</p>
                        )}
                        {selectedCategory.subcategories.map((sub) => (
                            <div key={sub._id} className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0"></div>

                                {editingId === sub._id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleEditSubcategory(sub._id)}
                                            className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-background text-sm focus:outline-none"
                                            autoFocus
                                        />
                                        <button onClick={() => handleEditSubcategory(sub._id)} className="text-success cursor-pointer">
                                            <Check className="w-4.5 h-4.5" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-400 cursor-pointer">
                                            <X className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => goToItems(sub)}
                                        >
                                            <p className="text-sm font-semibold text-secondary truncate">{sub.name}</p>
                                            <p className="text-xs text-text-secondary">
                                                {sub.items.length} items
                                                {sub.items.length === 0 && <span className="ml-1 text-orange-500">(optional)</span>}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setEditingId(sub._id); setEditName(sub.name) }}
                                            className="text-text-secondary hover:text-primary transition-colors cursor-pointer p-1"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubcategory(sub._id)}
                                            className="text-text-secondary hover:text-danger transition-colors cursor-pointer p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => goToItems(sub)}
                                            className="text-text-secondary hover:text-primary transition-colors cursor-pointer p-1"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-[11px] text-text-secondary mt-3 text-center">
                        Click a subcategory to manage its items · Items are optional
                    </p>
                </>
            )}

            {/* ==================== LEVEL 3: Items ==================== */}
            {currentView === 'items' && selectedSubcategory && (
                <>
                    {/* Add Item Form */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="New item name..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border">
                        {selectedSubcategory.items.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-sm text-text-secondary">No items yet.</p>
                                <p className="text-xs text-text-secondary mt-1">Items are <span className="text-orange-500 font-semibold">optional</span> — products can be assigned directly to this subcategory.</p>
                            </div>
                        )}
                        {selectedSubcategory.items.map((item) => (
                            <EditableRow
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                onSave={handleEditItem}
                                onDelete={handleDeleteItem}
                                leftIcon={<div className="w-1.5 h-1.5 rounded-full bg-primary/30 flex-shrink-0"></div>}
                            />
                        ))}
                    </div>

                    <p className="text-[11px] text-text-secondary mt-3 text-center">
                        This is the final level · Products will be assigned to these items
                    </p>
                </>
            )}
        </div>
    )
}
