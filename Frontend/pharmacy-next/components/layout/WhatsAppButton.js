"use client"

import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/923054964343"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 md:bottom-8 left-6 z-[9999] flex items-center gap-3 bg-white p-2 pr-5 rounded-full shadow-2xl border border-border hover:translate-y-[-4px] transition-all group active:scale-95 animate-fade-in"
        >
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-secondary uppercase leading-none mt-0.5">Need Help?</span>
                <span className="text-sm font-bold text-secondary">Chat with us</span>
            </div>
        </a>
    )
}

export default WhatsAppButton
