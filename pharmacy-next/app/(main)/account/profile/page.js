"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, User, Phone, Lock, Save, Loader2, Eye, EyeOff, Upload } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function ProfileSettingsPage() {
    const { user, loading, setUser } = useAuth()
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
    const [showPasswords, setShowPasswords] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
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

            // 1. Upload image if changed
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

            setUser(data.user) // Update global auth context
            toast.success('Profile updated successfully', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff' }
            })
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
        if (formData.newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters')
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

            toast.success('Password changed successfully', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff' }
            })
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/account" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-secondary" />
                    </Link>
                    <h1 className="text-lg font-bold text-secondary">Profile Settings</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                
                {/* Personal Information */}
                <section className="bg-white rounded-2xl border border-border shadow-sm p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-secondary">Personal Information</h2>
                            <p className="text-xs text-text-secondary">Basic details about your account</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100 shadow-sm relative">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-300 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                                    )}
                                    {isSubmitting && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-dark transition-all active:scale-90"
                                >
                                    <Upload className="w-4 h-4" />
                                </label>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-[10px] text-text-secondary mt-3 font-medium uppercase tracking-wider">Tap icon to change photo</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Email Address (Read-only)</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 border border-border rounded-xl text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="e.g. 0300 1234567"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 shadow-md shadow-primary/20"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Update Profile
                        </button>
                    </form>
                </section>

                {/* Change Password */}
                <section className="bg-white rounded-2xl border border-border shadow-sm p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-bold text-secondary">Security</h2>
                            <p className="text-xs text-text-secondary">Update your login password</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="ml-auto text-primary text-xs font-bold hover:underline"
                        >
                            {showPasswords ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">New Password</label>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="At least 6 chars"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 shadow-md shadow-secondary/20"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                            Change Password
                        </button>
                    </form>
                </section>

                <div className="text-center">
                    <p className="text-xs text-text-secondary">
                        Changes are saved instantly to your account. <br/>
                        Stay safe and never share your password.
                    </p>
                </div>
            </div>
        </div>
    )
}
