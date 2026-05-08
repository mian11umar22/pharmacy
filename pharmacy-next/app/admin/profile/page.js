"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, Lock, Save, Loader2, Upload, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const toastStyle = { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' }

export default function AdminProfilePage() {
    const { user, setUser, loading } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        image: '',
        imagePublicId: ''
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login')
        }
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                image: user.image || '',
                imagePublicId: user.imagePublicId || ''
            }))
            if (user.image) setImagePreview(user.image)
        }
    }, [user, loading, router])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error('Image size must be less than 2MB')
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        if (!formData.name) return toast.error('Name is required')

        try {
            setIsSubmitting(true)
            let imageUrl = formData.image
            let imagePublicId = formData.imagePublicId

            if (imageFile) {
                const base64Image = await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(imageFile)
                    reader.onload = () => resolve(reader.result)
                })

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64Image,
                        folder: 'hope-pharmacy/profiles'
                    })
                })

                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed')
                imageUrl = uploadData.url
                imagePublicId = uploadData.publicId
            }

            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    image: imageUrl,
                    imagePublicId: imagePublicId
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update profile')

            setUser(data.user)
            toast.success('Profile updated successfully', { style: toastStyle })
            setImageFile(null)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (!formData.currentPassword || !formData.newPassword) {
            return toast.error('Please fill both password fields')
        }
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error('Passwords do not match')
        }

        try {
            setIsSubmitting(true)
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to change password')

            toast.success('Password changed successfully', { style: toastStyle })
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading || !user) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
            <h1 className="text-xl sm:text-2xl font-bold text-secondary mb-6">Admin Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info & Pic */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100 shadow-sm relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-12 h-12 text-gray-300 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                                        )}
                                    </div>
                                    <label htmlFor="admin-photo" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-dark transition-all active:scale-90">
                                        <Upload className="w-4 h-4" />
                                    </label>
                                    <input type="file" id="admin-photo" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-bold text-secondary">{user.name}</h3>
                                    <p className="text-sm text-text-secondary">{user.email}</p>
                                    <p className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block mt-2 font-bold uppercase">Administrator</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 cursor-pointer shadow-md shadow-primary/10"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Update Profile
                            </button>
                        </form>
                    </section>
                </div>

                {/* Password Section */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-accent" />
                            <h2 className="font-bold text-secondary">Security</h2>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Confirm New</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl transition-all disabled:opacity-70 cursor-pointer shadow-md shadow-secondary/10"
                            >
                                Change Password
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}
