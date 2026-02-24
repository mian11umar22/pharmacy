"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const { getCartCount } = useCart()

    const cartCount = getCartCount()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar with classic Marquee */}
            <div className="bg-primary text-white text-xs py-2">
                <marquee behavior="scroll" direction="left" scrollamount="5">
                    Order Now: 03054964343    |   💊 Genuine Medicines at Your Doorstep   |   WhatsApp us your Prescription
                </marquee>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                            H+
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-secondary leading-none">HOPE</span>
                            <span className="text-[10px] font-bold text-primary tracking-[0.2em] mt-0.5">PHARMACY</span>
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for medicines, healthcare products..."
                            className="w-full pl-4 pr-10 py-2 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                        />
                        <button type="submit" className="absolute right-3 top-2.5 text-text-secondary hover:text-primary transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Icons Navigation */}
                    <div className="flex items-center gap-6">
                        <Link href="/products" className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            <span className="text-xs mt-0.5">Shop</span>
                        </Link>

                        <Link href="/login" className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition">
                            <User className="w-6 h-6" />
                            <span className="text-xs mt-0.5">Login</span>
                        </Link>

                        <Link href="/cart" className="flex flex-col items-center text-text-secondary hover:text-primary transition relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                            <span className="text-xs mt-0.5 hidden md:block">Cart</span>
                        </Link>

                        <button
                            className="md:hidden text-secondary"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search medicines..."
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                        />
                        <button type="submit" className="absolute right-3 top-3 text-text-secondary">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-border animate-fade-in shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link
                            href="/products"
                            className="block px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🛒 Shop Medicines
                        </Link>
                        <Link
                            href="/login"
                            className="block px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            👤 Login / Register
                        </Link>
                        <Link
                            href="/cart"
                            className="block px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🛍️ My Cart ({cartCount})
                        </Link>
                        <div className="border-t border-border pt-3 mt-3">
                            <div className="flex flex-col gap-2 text-sm text-text-secondary px-3">
                                <span className="font-semibold">Need Help?</span>
                                <div className="flex flex-col gap-1">
                                    <a href="tel:03054964343" className="text-primary font-bold">Call: 0305-4964343</a>
                                    <span className="text-xs">Email: Hopepharmacywalton@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )

}

export default Header
