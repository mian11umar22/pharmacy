"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!formData.email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email'
        if (!formData.password) errs.password = 'Password is required'
        else if (formData.password.length < 6) errs.password = 'Min 6 characters'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            toast.success('Login successful!', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })

            // Call login from context
            login(data.user)

            // Dynamic Redirection based on role
            if (data.user.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/account')
            }
            router.refresh()
        } catch (error) {
            toast.error(error.message, {
                style: { borderRadius: '10px', background: '#ff4b4b', color: '#fff', fontSize: '14px' },
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">

                {/* Branding Section */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 2% 0)' }}>
                            <Image
                                src="/images/logo.png"
                                alt="Hope Pharmacy"
                                width={160}
                                height={60}
                                className="h-16 w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-secondary">Welcome Back</h1>
                    <p className="text-text-secondary text-sm mt-1">Sign in to your Hope Pharmacy account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-danger' : 'border-border'} bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-danger text-xs mt-1.5 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-semibold text-secondary">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary font-medium hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                            {errors.password && <p className="text-danger text-xs mt-1.5 ml-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs text-text-secondary font-medium">OR</span>
                        <div className="flex-1 h-px bg-border"></div>
                    </div>

                    {/* Guest Checkout Option */}
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-border rounded-xl text-sm font-semibold text-secondary hover:border-primary hover:text-primary transition-all active:scale-[0.98]"
                    >
                        <span>🛒</span>
                        Continue Shopping as Guest
                    </Link>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-primary font-bold hover:underline">
                        Create Account
                    </Link>
                </p>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-6 text-text-secondary">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span>🔒</span>
                        <span>Secure Login</span>
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
