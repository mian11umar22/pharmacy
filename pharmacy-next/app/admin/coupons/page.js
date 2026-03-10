"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Loader2, X, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minCartValue: '',
    maxUses: '',
    expiryDate: '',
    isActive: true,
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editingCoupon, setEditingCoupon] = useState(null) // holds coupon being edited
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [togglingId, setTogglingId] = useState(null)

    const fetchCoupons = async () => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/coupons')
            const data = await res.json()
            if (res.ok) setCoupons(data.coupons)
        } catch (error) {
            toast.error('Failed to load coupons')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchCoupons() }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon)
        setForm({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minCartValue: coupon.minCartValue || '',
            maxUses: coupon.maxUses || '',
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            isActive: coupon.isActive,
        })
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.code.trim()) return toast.error('Coupon code is required')
        if (!form.discountValue || Number(form.discountValue) <= 0) return toast.error('Discount value must be greater than 0')
        if (form.discountType === 'percentage' && Number(form.discountValue) > 100) return toast.error('Percentage cannot exceed 100')

        const payload = {
            ...form,
            discountValue: Number(form.discountValue),
            minCartValue: Number(form.minCartValue) || 0,
            maxUses: Number(form.maxUses) || 0,
            expiryDate: form.expiryDate || null,
        }

        try {
            setIsSaving(true)

            if (editingCoupon) {
                // UPDATE existing coupon
                const res = await fetch(`/api/coupons/${editingCoupon._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                const data = await res.json()
                if (res.ok) {
                    toast.success(`Coupon "${data.coupon.code}" updated!`, {
                        style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                    })
                    setForm(emptyForm)
                    setEditingCoupon(null)
                    setShowForm(false)
                    fetchCoupons()
                } else {
                    toast.error(data.error || 'Failed to update coupon')
                }
            } else {
                // CREATE new coupon
                const res = await fetch('/api/coupons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                const data = await res.json()
                if (res.ok) {
                    toast.success(`Coupon "${data.coupon.code}" created!`, {
                        style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                    })
                    setForm(emptyForm)
                    setShowForm(false)
                    fetchCoupons()
                } else {
                    toast.error(data.error || 'Failed to create coupon')
                }
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggle = async (coupon) => {
        try {
            setTogglingId(coupon._id)
            const res = await fetch(`/api/coupons/${coupon._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !coupon.isActive })
            })
            if (res.ok) {
                toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`, {
                    style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                })
                fetchCoupons()
            }
        } catch (error) {
            toast.error('Failed to update coupon')
        } finally {
            setTogglingId(null)
        }
    }

    const handleDelete = async (id, code) => {
        if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
        try {
            setDeletingId(id)
            const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success(`Coupon "${code}" deleted`, {
                    style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
                })
                fetchCoupons()
            } else {
                toast.error('Failed to delete coupon')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-secondary">Coupon Codes</h1>
                    <p className="text-sm text-text-secondary mt-1">Create and manage discount coupons</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingCoupon(null); setForm(emptyForm) }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    Add Coupon
                </button>
            </div>

            {/* Add Coupon Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-border p-5 mb-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-secondary">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
                        <button onClick={() => { setShowForm(false); setEditingCoupon(null) }} className="text-text-secondary hover:text-secondary cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Code */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">Coupon Code <span className="text-danger">*</span></label>
                            <input
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="e.g. TALHA123"
                                disabled={!!editingCoupon}
                                className={`w-full px-3 py-2.5 rounded-lg border border-border text-sm font-mono font-semibold uppercase focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background ${editingCoupon ? 'opacity-60 cursor-not-allowed' : ''}`}
                                style={{ textTransform: 'uppercase' }}
                            />
                            {editingCoupon && <p className="text-xs text-text-secondary mt-1">Coupon code cannot be changed after creation</p>}
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">Discount Type <span className="text-danger">*</span></label>
                            <select
                                name="discountType"
                                value={form.discountType}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                            >
                                <option value="percentage">Percentage (% off)</option>
                                <option value="flat">Flat (Rs. off)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">
                                Discount Value <span className="text-danger">*</span>
                                <span className="text-text-secondary font-normal ml-1">
                                    ({form.discountType === 'percentage' ? '% off' : 'Rs. off'})
                                </span>
                            </label>
                            <input
                                type="number"
                                name="discountValue"
                                value={form.discountValue}
                                onChange={handleChange}
                                placeholder={form.discountType === 'percentage' ? '10' : '50'}
                                min="1"
                                max={form.discountType === 'percentage' ? '100' : undefined}
                                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                            />
                        </div>

                        {/* Min Cart Value */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">
                                Min Cart Value <span className="text-text-secondary font-normal">(optional, Rs.)</span>
                            </label>
                            <input
                                type="number"
                                name="minCartValue"
                                value={form.minCartValue}
                                onChange={handleChange}
                                placeholder="0 = no minimum"
                                min="0"
                                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                            />
                        </div>

                        {/* Max Uses */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">
                                Max Uses <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <input
                                type="number"
                                name="maxUses"
                                value={form.maxUses}
                                onChange={handleChange}
                                placeholder="0 = unlimited"
                                min="0"
                                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-xs font-semibold text-secondary mb-1.5">
                                Expiry Date <span className="text-text-secondary font-normal">(optional)</span>
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={form.expiryDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                            />
                        </div>

                        {/* Active toggle */}
                        <div className="sm:col-span-2 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 accent-primary cursor-pointer"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-secondary cursor-pointer">
                                Active (coupon usable immediately)
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="sm:col-span-2 flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? (editingCoupon ? 'Saving...' : 'Creating...') : (editingCoupon ? 'Save Changes' : 'Create Coupon')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-sm font-semibold py-2.5 px-5 rounded-xl border border-border text-secondary hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <h2 className="font-bold text-secondary text-sm">All Coupons ({coupons.length})</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-text-secondary">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-sm">Loading coupons...</span>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-16">
                        <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-secondary font-semibold mb-1">No coupons yet</p>
                        <p className="text-sm text-text-secondary">Click "Add Coupon" to create your first coupon code</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="sm:hidden divide-y divide-border">
                            {coupons.map((coupon) => (
                                <div key={coupon._id} className="px-5 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold font-mono text-secondary text-sm tracking-wider">{coupon.code}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-primary font-semibold mb-1">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `Rs. ${coupon.discountValue} off`}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                                        {coupon.minCartValue > 0 && <span>Min: Rs. {coupon.minCartValue}</span>}
                                        <span>Used: {coupon.usedCount}{coupon.maxUses > 0 ? `/${coupon.maxUses}` : ''}</span>
                                        {coupon.expiryDate && <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(coupon)}
                                            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border hover:bg-gray-50 transition-all cursor-pointer"
                                        >
                                            <Pencil className="w-3.5 h-3.5 text-primary" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggle(coupon)}
                                            disabled={togglingId === coupon._id}
                                            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {togglingId === coupon._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : coupon.isActive ? <ToggleRight className="w-3.5 h-3.5 text-success" /> : <ToggleLeft className="w-3.5 h-3.5 text-gray-400" />}
                                            {coupon.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon._id, coupon.code)}
                                            disabled={deletingId === coupon._id}
                                            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-danger/30 text-danger hover:bg-danger/5 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {deletingId === coupon._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-text-secondary border-b border-border">
                                        <th className="text-left px-5 py-3 font-medium">Code</th>
                                        <th className="text-left px-5 py-3 font-medium">Discount</th>
                                        <th className="text-left px-5 py-3 font-medium">Min Cart</th>
                                        <th className="text-left px-5 py-3 font-medium">Uses</th>
                                        <th className="text-left px-5 py-3 font-medium">Expiry</th>
                                        <th className="text-left px-5 py-3 font-medium">Status</th>
                                        <th className="text-left px-5 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <span className="font-bold font-mono text-secondary text-sm tracking-wider">{coupon.code}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-sm font-semibold text-primary">
                                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`}
                                                </span>
                                                <span className="text-xs text-text-secondary ml-1">
                                                    {coupon.discountType === 'percentage' ? 'percent' : 'flat'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {coupon.minCartValue > 0 ? `Rs. ${coupon.minCartValue}` : <span className="text-text-secondary">None</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {coupon.usedCount}
                                                {coupon.maxUses > 0 ? <span className="text-text-secondary">/{coupon.maxUses}</span> : <span className="text-text-secondary"> / ∞</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-PK') : <span className="text-text-secondary">No expiry</span>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${coupon.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
                                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(coupon)}
                                                        title="Edit coupon"
                                                        className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(coupon)}
                                                        disabled={togglingId === coupon._id}
                                                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-secondary transition-all cursor-pointer disabled:opacity-50"
                                                    >
                                                        {togglingId === coupon._id
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : coupon.isActive
                                                                ? <ToggleRight className="w-4 h-4 text-success" />
                                                                : <ToggleLeft className="w-4 h-4 text-gray-400" />
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon._id, coupon.code)}
                                                        disabled={deletingId === coupon._id}
                                                        title="Delete coupon"
                                                        className="p-1.5 rounded-lg hover:bg-danger/5 text-danger transition-all cursor-pointer disabled:opacity-50"
                                                    >
                                                        {deletingId === coupon._id
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <Trash2 className="w-4 h-4" />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
