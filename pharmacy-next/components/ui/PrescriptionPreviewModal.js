"use client"

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function PrescriptionPreviewModal({ isOpen, onClose, imageUrl }) {
    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative max-w-lg w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 p-2 bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-lg transition-colors z-10 cursor-pointer"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="Uploaded prescription"
                    className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl bg-white"
                />
            </div>
        </div>,
        document.body
    )
}
