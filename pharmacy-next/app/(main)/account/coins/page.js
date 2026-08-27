"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Coins, Gift, History, Copy, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const reasonLabels = {
    shopping: 'Shopping',
    referral: 'Referral',
    login: 'Login',
    signup: 'Signup',
}

export default function CoinsRewardsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchBalance = async () => {
            if (!user) return
            try {
                const res = await fetch('/api/rewards/balance')
                const result = await res.json()
                if (res.ok) {
                    setData(result)
                }
            } catch (error) {
                console.error('Failed to fetch rewards balance:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBalance()
    }, [user])

    const handleCopy = () => {
        if (!data?.referralLink) return
        navigator.clipboard.writeText(data.referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading || !user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const transactions = data?.transactions || []

    return (
        <div className="bg-background min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/account" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-secondary" />
                    </Link>
                    <h1 className="text-lg font-bold text-secondary">Coins & Rewards</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

                {/* Coin Balance */}
                <section className="bg-white rounded-2xl border border-border shadow-sm p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Coins className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-secondary">Coin Balance</h2>
                            <p className="text-xs text-text-secondary">Earn and redeem coins on every order</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-4xl font-black text-primary">{data?.coinBalance ?? 0}</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mt-1">Available Coins</p>
                        <p className="text-xs text-text-secondary mt-3">1 Coin = Rs. 1 discount at checkout</p>
                    </div>
                </section>

                {/* Referral */}
                <section className="bg-white rounded-2xl border border-border shadow-sm p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Gift className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-bold text-secondary">Refer & Earn</h2>
                            <p className="text-xs text-text-secondary">Share your link. When your friend signs up and logs in, you both get bonus coins.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={data?.referralLink || ''}
                            className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm text-secondary focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            disabled={!data?.referralLink}
                            className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </section>

                {/* Transaction History */}
                <section className="bg-white rounded-2xl border border-border shadow-sm p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                            <History className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-secondary">Coins History</h2>
                            <p className="text-xs text-text-secondary">Your last 10 coin transactions</p>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <p className="text-sm text-text-secondary text-center py-8">No transactions yet</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <div key={tx._id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-secondary">{reasonLabels[tx.reason] || tx.reason}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            {new Date(tx.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className={`text-sm font-bold ${tx.type === 'earned' ? 'text-success' : 'text-danger'}`}>
                                        {tx.type === 'earned' ? '+' : '-'}{tx.coins}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
