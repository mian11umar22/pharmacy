"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, LogOut, ChevronRight, User as UserIcon, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()

    const [stats, setStats] = useState({ totalOrders: 0, totalDelivered: 0 })
    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return
            try {
                const res = await fetch('/api/users/stats')
                const data = await res.json()
                if (res.ok && data.stats) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setLoadingStats(false)
            }
        }
        fetchStats()
    }, [user])

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-secondary font-medium">Loading account...</p>
        </div>
    )
    if (!user) return null

    return (
        <div className="bg-background min-h-screen">
            {/* Profile Header */}
            <div className="bg-primary">
                <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <UserIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white">
                            <h1 className="text-xl font-bold">{user.name}</h1>
                            <p className="text-white/70 text-sm">{user.email}</p>
                            <p className="text-white/50 text-xs mt-0.5 capitalize">Role: {user.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { label: 'Total Orders', value: stats.totalOrders, emoji: '📦' },
                        { label: 'Delivered', value: stats.totalDelivered, emoji: '✅' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl border border-border p-3 text-center shadow-sm">
                            <span className="text-lg">{stat.emoji}</span>
                            <p className="text-xl font-bold text-secondary mt-1">
                                {loadingStats ? '...' : stat.value}
                            </p>
                            <p className="text-[11px] text-text-secondary">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <Link
                        href="/account/orders"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-border"
                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-secondary text-sm">My Orders</p>
                            <p className="text-xs text-text-secondary">Track & view order history</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-5 h-5 text-danger" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-danger text-sm">Logout</p>
                            <p className="text-xs text-text-secondary">Sign out of your account</p>
                        </div>
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-6 mb-8 bg-primary/5 rounded-2xl p-5 border border-primary/10">
                    <p className="font-semibold text-secondary text-sm mb-1">Need Help? 💬</p>
                    <p className="text-xs text-text-secondary mb-3">Our team is available to assist you</p>
                    <a
                        href="https://wa.me/923054964343"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 px-5 rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <span>💬</span> Chat on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
