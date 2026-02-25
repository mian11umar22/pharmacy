"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const initialCategories = [
    { id: 1, name: 'Pain Relief', products: 12, emoji: '💊' },
    { id: 2, name: 'Vitamins', products: 8, emoji: '🧬' },
    { id: 3, name: 'Antibiotics', products: 6, emoji: '🦠' },
    { id: 4, name: 'Nutrition', products: 5, emoji: '🥛' },
    { id: 5, name: 'Skin Care', products: 10, emoji: '✨' },
    { id: 6, name: 'First Aid', products: 7, emoji: '🩹' },
    { id: 7, name: 'Baby Care', products: 4, emoji: '👶' },
]

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState(initialCategories)
    const [newName, setNewName] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')

    const handleAdd = () => {
        if (!newName.trim()) return
        const newCat = {
            id: Date.now(),
            name: newName.trim(),
            products: 0,
            emoji: '📁',
        }
        setCategories([...categories, newCat])
        setNewName('')
        toast.success('Category added', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    const handleEdit = (cat) => {
        setEditingId(cat.id)
        setEditName(cat.name)
    }

    const handleSaveEdit = (id) => {
        if (!editName.trim()) return
        setCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c))
        setEditingId(null)
        toast.success('Category updated', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    const handleDelete = (id) => {
        setCategories(categories.filter(c => c.id !== id))
        toast.success('Category deleted', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary">Categories</h1>
                <p className="text-sm text-text-secondary mt-1">{categories.length} categories</p>
            </div>

            {/* Add New */}
            <div className="bg-white rounded-xl border border-border p-4 mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="New category name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl border border-border overflow-hidden divide-y divide-border">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <span className="text-xl">{cat.emoji}</span>

                        {editingId === cat.id ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(cat.id)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-background text-sm focus:outline-none"
                                    autoFocus
                                />
                                <button onClick={() => handleSaveEdit(cat.id)} className="text-success cursor-pointer">
                                    <Check className="w-4.5 h-4.5" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="text-gray-400 cursor-pointer">
                                    <X className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-secondary">{cat.name}</p>
                                    <p className="text-xs text-text-secondary">{cat.products} products</p>
                                </div>
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-text-secondary hover:text-danger transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
