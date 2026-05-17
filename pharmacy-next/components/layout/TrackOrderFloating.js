"use client"

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { usePathname } from 'next/navigation'
import TrackOrderModal from '../ui/TrackOrderModal'

const TrackOrderFloating = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const pathname = usePathname()

    // Adjust position based on whether the mobile bottom nav is visible
    const isActionBarPage = pathname === '/cart' || pathname === '/checkout'

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`fixed ${isActionBarPage ? 'bottom-[140px]' : 'bottom-[145px]'} md:bottom-[104px] right-6 z-[99] flex items-center bg-transparent md:bg-white md:p-2 md:pr-5 rounded-full md:shadow-2xl md:border md:border-border hover:translate-y-[-4px] transition-all group active:scale-95 animate-fade-in`}
            >
                <div className="w-14 h-14 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-xl md:shadow-lg group-hover:rotate-12 transition-transform border-[3px] border-white md:border-none">
                    <MapPin className="w-6 h-6 md:w-5 md:h-5" />
                </div>
                <div className="hidden md:flex flex-col ml-3 text-left">
                    <span className="text-[10px] font-bold text-text-secondary uppercase leading-none mt-0.5">Where is it?</span>
                    <span className="text-sm font-bold text-secondary">Track Order</span>
                </div>
            </button>

            <TrackOrderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default TrackOrderFloating
