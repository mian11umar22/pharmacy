"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, X, Check, Home, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock addresses
const initialAddresses = [
    {
        id: 1,
        label: 'Home',
        icon: 'home',
        name: 'Muhammad Ali',
        phone: '03001234567',
        address: 'House # 123, Street 5, Block A, DHA Phase 6, Lahore',
        isDefault: true,
    },
    {
        id: 2,
        label: 'Office',
        icon: 'office',
        name: 'Muhammad Ali',
        phone: '03001234567',
        address: '2nd Floor, Arfa Tower, Ferozpur Road, Lahore',
        isDefault: false,
    },
]

export default function AddressesPage() {
    const [addresses, setAddresses] = useState(initialAddresses)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        label: 'Home',
        name: '',
        phone: '',
        address: '',
    })

    const resetForm = () => {
        setFormData({ label: 'Home', name: '', phone: '', address: '' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (addr) => {
        setFormData({
            label: addr.label,
            name: addr.name,
            phone: addr.phone,
            address: addr.address,
        })
        setEditingId(addr.id)
        setShowForm(true)
    }

    const handleDelete = (id) => {
        setAddresses(addresses.filter(a => a.id !== id))
        toast.success('Address removed', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })))
        toast.success('Default address updated', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
    }

    const handleSave = () => {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
            toast.error('Please fill all fields', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
            return
        }

        if (editingId) {
            setAddresses(addresses.map(a =>
                a.id === editingId
                    ? { ...a, label: formData.label, name: formData.name, phone: formData.phone, address: formData.address, icon: formData.label === 'Home' ? 'home' : 'office' }
                    : a
            ))
            toast.success('Address updated', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
        } else {
            const newAddr = {
                id: Date.now(),
                label: formData.label,
                icon: formData.label === 'Home' ? 'home' : 'office',
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                isDefault: addresses.length === 0,
            }
            setAddresses([...addresses, newAddr])
            toast.success('Address added', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
        }
        resetForm()
    }

    return (
        <div className="bg-background min-h-screen pb-6">
            {/* Top Bar */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/account" className="text-text-secondary hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-bold text-secondary">Saved Addresses</h1>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => { resetForm(); setShowForm(true) }}
                            className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-4">

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-4 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-secondary text-sm">
                                {editingId ? 'Edit Address' : 'New Address'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-secondary cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Label Toggle */}
                            <div>
                                <label className="block text-xs font-semibold text-secondary mb-2">Label</label>
                                <div className="flex gap-2">
                                    {['Home', 'Office'].map((label) => (
                                        <button
                                            key={label}
                                            onClick={() => setFormData({ ...formData, label })}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${formData.label === label
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                                                }`}
                                        >
                                            {label === 'Home' ? <Home className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-secondary mb-1.5">Name</label>
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-secondary mb-1.5">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="03XXXXXXXXX"
                                    maxLength={11}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-secondary mb-1.5">Full Address</label>
                                <textarea
                                    placeholder="House #, Street, Area, City"
                                    rows="2"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                            >
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Address Cards */}
                <div className="space-y-3">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                    {addr.icon === 'home'
                                        ? <Home className={`w-5 h-5 ${addr.isDefault ? 'text-primary' : 'text-text-secondary'}`} />
                                        : <Building2 className={`w-5 h-5 ${addr.isDefault ? 'text-primary' : 'text-text-secondary'}`} />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-secondary text-sm">{addr.label}</p>
                                        {addr.isDefault && (
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                DEFAULT
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-secondary">{addr.name}</p>
                                    <p className="text-xs text-text-secondary mt-0.5">{addr.phone}</p>
                                    <p className="text-xs text-text-secondary mt-1">{addr.address}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
                                    >
                                        <Check className="w-3.5 h-3.5" /> Set Default
                                    </button>
                                )}
                                <div className="flex-1"></div>
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary font-medium cursor-pointer"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-danger font-medium cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {addresses.length === 0 && !showForm && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">
                            📍
                        </div>
                        <h3 className="text-lg font-bold text-secondary mb-2">No saved addresses</h3>
                        <p className="text-sm text-text-secondary mb-6 max-w-xs">
                            Add your delivery address for faster checkout
                        </p>
                        <button
                            onClick={() => { resetForm(); setShowForm(true) }}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
