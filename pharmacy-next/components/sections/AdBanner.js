"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdBanner({ slot = 'ad_banner_2' }) {
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                const data = await res.json()
                if (data.settings?.[slot]?.active && data.settings?.[slot]?.image) {
                    setBanner(data.settings[slot])
                }
            } catch (error) {
                console.error(`Failed to fetch ${slot}`, error)
            }
        }
        fetchSettings()
    }, [slot])

    if (!banner) return null

    const getBannerLink = () => {
        return banner.link || '#'
    }

    return (
        <section className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
            <Link 
                href={getBannerLink()}
                className="block w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group relative"
            >
                <img 
                    src={banner.image} 
                    alt="Special Offer" 
                    className="w-full h-auto object-cover md:max-h-[300px]"
                />
            </Link>
        </section>
    )
}
