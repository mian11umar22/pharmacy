"use client"

import { Send } from 'lucide-react'

const PrescriptionBanner = () => {
    return (
        <section className="py-12 md:py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-xl shadow-lg min-h-[320px] md:min-h-[400px] flex items-center justify-center text-center">

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/images/prescription-bg.png')` }}
                    >
                        <div className="absolute inset-0 bg-black/50 md:bg-black/30 backdrop-blur-[0.5px]"></div>
                    </div>

                    <div className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                            Doctor Prescription
                        </h2>
                        <p className="text-sm md:text-2xl text-white mb-6 md:mb-10 leading-relaxed md:font-bold drop-shadow-xl max-w-sm md:max-w-none mx-auto">
                            Share your doctor&apos;s prescription with us, and we&apos;ll bring your medicine right to your door. It&apos;s that simple!
                        </p>

                        {/* WhatsApp button with pulsing glow ring */}
                        <div className="inline-flex relative">
                            {/* Outer glow ring — pulses */}
                            <span className="absolute inset-0 rounded-lg md:rounded-xl bg-[#10b981] animate-ping opacity-30 pointer-events-none"></span>

                            <a
                                href="https://wa.me/923054964343"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative inline-flex items-center gap-2 md:gap-3 bg-[#10b981] hover:bg-[#059669] text-white px-8 md:px-12 py-3 md:py-5 rounded-lg md:rounded-xl shadow-2xl transition-all hover:scale-105 active:scale-95 font-bold md:font-black text-xs md:text-2xl group"
                            >
                                <Send className="w-4 h-4 md:w-8 md:h-8 fill-white group-hover:rotate-12 transition-transform" />
                                <span>Send Prescription on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PrescriptionBanner