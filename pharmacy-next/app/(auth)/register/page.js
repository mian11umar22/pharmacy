"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}

        if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
        else if (formData.fullName.trim().length < 3) errs.fullName = 'Min 3 characters'
        else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName)) errs.fullName = 'Only letters allowed'

        if (!formData.email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email'

        if (!formData.phone.trim()) errs.phone = 'Phone number is required'
        else if (!/^\d{11}$/.test(formData.phone)) errs.phone = 'Must be 11 digits'

        if (!formData.password) errs.password = 'Password is required'
        else if (formData.password.length < 6) errs.password = 'Min 6 characters'

        if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm password'
        else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords don\'t match'

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        await new Promise(r => setTimeout(r, 1500))
        toast.success('Account created successfully!', {
            style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
        })
        setIsLoading(false)
        // router.push('/account')
    }

    const update = (field, value) => {
        setFormData({ ...formData, [field]: value })
        if (errors[field]) setErrors({ ...errors, [field]: '' })
    }

    // Password strength
    const passwordStrength = () => {
        const p = formData.password
        if (!p) return { level: 0, label: '', color: '' }
        let score = 0
        if (p.length >= 6) score++
        if (p.length >= 8) score++
        if (/[A-Z]/.test(p)) score++
        if (/[0-9]/.test(p)) score++
        if (/[^A-Za-z0-9]/.test(p)) score++

        if (score <= 2) return { level: score, label: 'Weak', color: 'bg-danger' }
        if (score <= 3) return { level: score, label: 'Fair', color: 'bg-warning' }
        return { level: score, label: 'Strong', color: 'bg-success' }
    }

    const strength = passwordStrength()

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">

                {/* Branding */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-4">
                        <span className="text-white text-2xl font-bold">H+</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-secondary">Create Account</h1>
                    <p className="text-text-secondary text-sm mt-1">Join Hope Pharmacy for a better experience</p>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mb-6">
                    {['Track Orders', 'Save Addresses', 'Order History'].map((item) => (
                        <span key={item} className="flex items-center gap-1 text-xs text-primary font-medium">
                            <Check className="w-3.5 h-3.5" />
                            {item}
                        </span>
                    ))}
                </div>

                {/* Registration Card */}
                <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8">

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Muhammad Ali"
                                    value={formData.fullName}
                                    onChange={(e) => update('fullName', e.target.value.replace(/[0-9]/g, ''))}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-danger' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                            </div>
                            {errors.fullName && <p className="text-danger text-xs mt-1 ml-1">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-danger' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-danger text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="tel"
                                    placeholder="03XXXXXXXXX"
                                    maxLength={11}
                                    value={formData.phone}
                                    onChange={(e) => update('phone', e.target.value.replace(/[^0-9]/g, ''))}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-danger' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                            </div>
                            {errors.phone && <p className="text-danger text-xs mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min 6 characters"
                                    value={formData.password}
                                    onChange={(e) => update('password', e.target.value)}
                                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-danger' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-danger text-xs mt-1 ml-1">{errors.password}</p>}

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 font-medium ${strength.color === 'bg-danger' ? 'text-danger' : strength.color === 'bg-warning' ? 'text-warning' : 'text-success'}`}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => update('confirmPassword', e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-danger' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-success' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-success" />
                                )}
                            </div>
                            {errors.confirmPassword && <p className="text-danger text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Sign In
                    </Link>
                </p>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-6 text-text-secondary">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span>🔒</span>
                        <span>Secure Signup</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <span>💊</span>
                        <span>Genuine Medicines</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
