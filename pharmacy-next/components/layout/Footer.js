import Link from 'next/link'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* About — full width on mobile */}
                <div className="mb-8 md:hidden">
                    <h3 className="text-xl font-extrabold mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-white text-base">H+</div>
                        HOPE PHARMACY
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Pakistan's Premium Pharmacy. Your trusted partner for genuine medicines and healthcare essentials, delivered to your doorstep.
                    </p>
                </div>

                {/* Desktop: 4-column grid / Mobile: 2-col for links, full for rest */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

                    {/* About — desktop only (mobile shown above) */}
                    <div className="hidden md:block">
                        <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-white text-base">H+</div>
                            HOPE PHARMACY
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Pakistan's Premium Pharmacy. We provide authentic medicines and qualified pharmacist consultation across Lahore and nationwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition">All Products</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/products?category=Medicine" className="hover:text-primary transition">Medicine</Link></li>
                            <li><Link href="/products?category=Personal Care" className="hover:text-primary transition">Personal Care</Link></li>
                            <li><Link href="/products?category=Baby Care" className="hover:text-primary transition">Baby Care</Link></li>
                            <li><Link href="/products?category=Nutrition" className="hover:text-primary transition">Nutrition</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 md:col-span-1 mt-2 md:mt-0">
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <span>0305-4964343</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <span className="break-all text-xs">Hopepharmacywalton@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span className="text-[11px] leading-tight">Abid road Islam nagar main Walton Lahore Cantt</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="hover:text-primary transition"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Hope Pharmacy. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
