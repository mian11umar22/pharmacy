"use client"

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-primary-light/50 to-white py-12 md:py-20 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl -z-10 translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="text-center md:text-left animate-fade-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                            Your Health, Our Priority 🌿
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mb-6">
                            Trusted Medicines <br className="hidden md:block" />
                            <span className="text-primary">Delivered to You</span>
                        </h1>
                        <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Order genuine medicines, vitamins, and personal care products from the comfort of your home. Fast delivery across Pakistan.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                href="/products"
                                className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-3 shadow-lg hover:shadow-primary/30"
                            >
                                Shop Now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center md:justify-start gap-8 text-sm text-text-secondary font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                100% Genuine
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                24/7 Support
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                Fast Delivery
                            </div>
                        </div>
                    </div>

                    {/* Image / Illustration Side */}
                    <div className="relative animate-scale-in">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 aspect-[4/3] md:aspect-square">
                            <Image
                                src="https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1770&auto=format&fit=crop"
                                alt="Pharmacist showing medicines"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Floating Cards simulating products */}
                            <div className="absolute top-4 left-4 bg-white p-3 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">💊</div>
                            </div>
                            <div className="absolute bottom-6 right-6 bg-white py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-bold text-secondary">Fast Delivery</span>
                            </div>
                        </div>

                        {/* Decor circles */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>



        </section >
    )
}

export default Hero
