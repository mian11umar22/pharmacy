import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* About — full width on mobile */}
                <div className="mb-8 md:hidden">
                    <Link href="/" className="inline-block bg-white p-2 rounded-lg mb-4">
                        <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 2% 0)' }}>
                            <Image
                                src="/images/logo.png"
                                alt="Hope Pharmacy"
                                width={140}
                                height={50}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                    </Link>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Pakistan's Premium Pharmacy. Your trusted partner for genuine medicines and healthcare essentials, delivered to your doorstep.
                    </p>
                </div>

                {/* Desktop: 4-column grid / Mobile: 2-col for links, full for rest */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

                    {/* About — desktop only (mobile shown above) */}
                    <div className="hidden md:block">
                        <Link href="/" className="inline-block bg-white p-3 rounded-xl mb-4">
                            <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 5% 0)' }}>
                                <Image
                                    src="/images/logo.png"
                                    alt="Hope Pharmacy"
                                    width={180}
                                    height={70}
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Pakistan's Premium Pharmacy. We provide authentic medicines and qualified pharmacist consultation across Lahore and nationwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition">All Products</Link></li>
                            <li><Link href="/cart" className="hover:text-primary transition">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Account</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/account" className="hover:text-primary transition">My Account</Link></li>
                            <li><Link href="/account/orders" className="hover:text-primary transition">Order History</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition">Login / Register</Link></li>
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
