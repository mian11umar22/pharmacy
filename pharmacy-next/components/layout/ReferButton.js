"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Gift, X, Copy, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ReferButton = () => {
    const pathname = usePathname()
    const { user } = useAuth()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [referralLink, setReferralLink] = useState(null)
    const [copied, setCopied] = useState(false)

    // On Cart/Checkout, MobileNav is hidden, so buttons go lower
    const isActionBarPage = pathname === '/cart' || pathname === '/checkout'

    const handleOpen = async () => {
        setIsModalOpen(true)
        setIsLoading(true)
        try {
            const res = await fetch('/api/rewards/balance')
            const data = await res.json()
            if (res.ok) {
                setReferralLink(data.referralLink || null)
            }
        } catch (error) {
            console.error('Failed to fetch referral link:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setCopied(false)
    }

    const handleCopy = () => {
        if (!referralLink) return
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!user) return null

    return (
        <>
            <button
                onClick={handleOpen}
                className={`fixed ${isActionBarPage ? 'bottom-[140px]' : 'bottom-[145px]'} md:bottom-[96px] right-6 z-[99] flex items-center bg-transparent md:bg-white md:p-2 md:pr-5 rounded-full md:shadow-2xl md:border md:border-border hover:translate-y-[-4px] transition-all group active:scale-95 animate-fade-in`}
            >
                <div className="w-14 h-14 md:w-10 md:h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl md:shadow-lg group-hover:rotate-12 transition-transform">
                    <Gift className="w-8 h-8 md:w-6 md:h-6" />
                </div>
                <div className="hidden md:flex flex-col ml-3 text-left">
                    <span className="text-[10px] font-bold text-text-secondary uppercase leading-none mt-0.5">Earn Rewards</span>
                    <span className="text-sm font-bold text-secondary">Refer & Earn</span>
                </div>
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-2xl shadow-lg w-full max-w-[420px] p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-text-secondary hover:text-secondary transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-bold text-secondary mb-2 pr-6">Refer & Earn 🎁</h2>
                        <p className="text-sm text-text-secondary mb-5">
                            Share your link. When your friend signs up and logs in, you both get bonus coins!
                        </p>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : referralLink ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl text-sm text-secondary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary text-center py-6">Generating your referral link...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ReferButton
