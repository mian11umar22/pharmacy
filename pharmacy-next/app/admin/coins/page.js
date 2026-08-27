"use client"

import { useState, useEffect } from 'react'
import { Loader2, Save, Coins } from 'lucide-react'
import toast from 'react-hot-toast'

const fieldConfig = [
    {
        key: 'coins_per_100_rupees',
        label: 'Coins per Rs. 100 shopping',
        helperText: 'e.g. 1 = customer gets 1 coin for every Rs. 100 spent',
        defaultValue: 1,
    },
    {
        key: 'referral_coins_referrer',
        label: 'Coins for referrer',
        helperText: 'Coins given to the person who shared the referral link',
        defaultValue: 50,
    },
    {
        key: 'referral_coins_new_user',
        label: 'Coins for new user (referral)',
        helperText: 'Coins given to the new user who signed up via referral',
        defaultValue: 20,
    },
    {
        key: 'login_coins',
        label: 'Coins on first login',
        helperText: 'Coins given to a user on their very first login',
        defaultValue: 5,
    },
    {
        key: 'coin_to_rupee_rate',
        label: '1 Coin = Rs. ?',
        helperText: 'e.g. 1 = 1 coin gives Rs. 1 discount at checkout',
        defaultValue: 1,
    },
    {
        key: 'max_coins_per_order',
        label: 'Max coins per order',
        helperText: 'Maximum coins a customer can redeem in a single order',
        defaultValue: 500,
    },
]

export default function AdminCoinsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [values, setValues] = useState(
        fieldConfig.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
    )

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings')
                const data = await res.json()
                setValues(prev => {
                    const next = { ...prev }
                    fieldConfig.forEach(field => {
                        const settingValue = data.settings?.[field.key]
                        next[field.key] = (settingValue === undefined || settingValue === null)
                            ? field.defaultValue
                            : settingValue
                    })
                    return next
                })
            } catch (error) {
                toast.error('Failed to load coin settings')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsSaving(true)
            for (const field of fieldConfig) {
                await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: field.key, value: Number(values[field.key]) || 0 })
                })
            }
            toast.success('Coin settings saved!', {
                style: { borderRadius: '10px', background: '#1B3A4B', color: '#fff', fontSize: '14px' },
            })
        } catch (error) {
            toast.error('Failed to save coin settings')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary flex items-center gap-2">
                    <Coins className="w-6 h-6 text-primary" />
                    Coins & Referral Settings
                </h1>
                <p className="text-sm text-text-secondary mt-1">Configure how coins are earned and redeemed across the store</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 shadow-sm space-y-5">
                {fieldConfig.map(field => (
                    <div key={field.key}>
                        <label className="block text-xs font-semibold text-secondary mb-1.5">{field.label}</label>
                        <input
                            type="number"
                            value={values[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            min="0"
                            placeholder={String(field.defaultValue)}
                            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                        />
                        <p className="text-xs text-text-secondary mt-1">{field.helperText}</p>
                    </div>
                ))}

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    )
}
