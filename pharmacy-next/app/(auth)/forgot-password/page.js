"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Key, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, RefreshCw, Timer } from 'lucide-react'
import toast from 'react-hot-toast'

import Image from 'next/image'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [timer, setTimer] = useState(0)

    // Timer logic for Resend OTP cooldown
    useEffect(() => {
        let interval
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        if (e) e.preventDefault()
        if (!email) return toast.error('Please enter your email')

        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Verification code sent')
                setStep(2)
                setTimer(60) // Start 60s cooldown for resend button
            } else {
                throw new Error(data.error || 'Failed to send OTP')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Resend OTP
    const handleResendOTP = async () => {
        if (timer > 0 || isLoading) return
        await handleSendOTP()
    }

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) return toast.error('Enter 6-digit OTP')

        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('OTP verified successfully')
                setStep(3)
            } else {
                throw new Error(data.error || 'Invalid OTP')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password.length < 6) return toast.error('Password must be at least 6 characters')
        if (password !== confirmPassword) return toast.error('Passwords do not match')

        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Password reset successful!')
                router.push('/login')
            } else {
                throw new Error(data.error || 'Failed to reset password')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">

                {/* Header Section */}
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
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary">
                            {step === 1 && <Mail className="w-8 h-8" />}
                            {step === 2 && <Key className="w-8 h-8" />}
                            {step === 3 && <ShieldCheck className="w-8 h-8" />}
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold text-secondary">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'New Password'}
                    </h1>
                    <div className="mt-2 h-10 flex items-center justify-center">
                        <p className="text-text-secondary text-sm max-w-[280px]">
                            {step === 1 && "Enter your email and we&apos;ll send you a 6-digit code to reset your password."}
                            {step === 2 && `We&apos;ve sent a 6-digit verification code to ${email}`}
                            {step === 3 && "Verification successful! You can now set a new secure password."}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8">

                    {/* Step 1: Email Form */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background/50 h-13 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-sm hover:shadow-md"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending Code...
                                    </span>
                                ) : (
                                    <>Get Verification Code <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Form */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2 ml-1">
                                    <label className="text-sm font-semibold text-secondary">Verification Code</label>
                                    <div className="flex items-center gap-1.5 text-[10px] text-danger font-bold uppercase tracking-wider bg-danger/5 px-2 py-0.5 rounded border border-danger/10">
                                        <Timer className="w-3 h-3" />
                                        Expires in 15m
                                    </div>
                                </div>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                    <input
                                        type="text"
                                        maxLength="6"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-border text-center text-2xl font-black tracking-[12px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background/50 h-14 transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : (
                                        <>Verify & Continue <CheckCircle2 className="w-4 h-4" /></>
                                    )}
                                </button>

                                <div className="text-center pt-2">
                                    {timer > 0 ? (
                                        <div className="text-xs text-text-secondary font-medium inline-flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                            <RefreshCw className="w-3 h-3 animate-spin opacity-50" />
                                            Resend code available in <span className="text-primary font-bold">{timer}s</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={handleResendOTP}
                                            className="text-sm font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 cursor-pointer decoration-2 underline-offset-4 hover:underline transition-all"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                            Didn&apos;t get the code? Resend
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-1.5 mt-2 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" /> Change Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password Form */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background/50 h-13 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1.5 ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background/50 h-13 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-sm hover:shadow-md"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating Password...
                                    </span>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Badges */}
                <div className="flex items-center justify-center gap-4 mt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full text-gray-500 border border-gray-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Security Verified</span>
                    </div>
                </div>

                <p className="text-center text-sm text-text-secondary mt-8">
                    Remember your password?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
