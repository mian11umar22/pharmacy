"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '../../context/CartContext'
import CategoryBar from './CategoryBar'
import TrackOrderModal from '../ui/TrackOrderModal'

import { useAuth } from '../../context/AuthContext'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [marqueeText, setMarqueeText] = useState('Order Now: 03054964343 | 💊 Genuine Medicines at Your Doorstep | WhatsApp us your Prescription')
    const router = useRouter()
    const { getCartCount } = useCart()
    const { user, logout } = useAuth()

    const cartCount = getCartCount()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                const data = await res.json()
                if (data.settings?.top_marquee) {
                    setMarqueeText(data.settings.top_marquee)
                }
            } catch (error) {
                console.error("Failed to fetch marquee", error)
            }
        }
        fetchSettings()
    }, [])

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
                    {marqueeText}
                </marquee>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 2% 0)' }}>
                            <Image
                                src="/images/logo.png"
                                alt="Hope Pharmacy"
                                width={160}
                                height={60}
                                className="h-16 w-auto object-contain"
                                priority
                            />
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

                        <button 
                            onClick={() => setIsTrackingModalOpen(true)}
                            className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition cursor-pointer"
                        >
                            <MapPin className="w-6 h-6" />
                            <span className="text-xs mt-0.5">Track</span>
                        </button>

                        {user ? (
                            <div className="relative group hidden md:block">
                                <button className="flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                                        {user.image ? (
                                            <Image src={user.image} alt="Profile" width={36} height={36} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <p className="text-xs font-bold text-secondary truncate max-w-[100px] leading-tight">
                                            {user.name.split(' ')[0]}
                                        </p>
                                        <p className="text-[10px] text-text-secondary capitalize leading-tight mt-0.5">
                                            {user.role}
                                        </p>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-text-secondary group-hover:rotate-180 transition-transform duration-300" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
                                    <div className="p-2">
                                        <Link
                                            href={user.role === 'admin' ? '/admin' : '/account'}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            {user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                                        </Link>
                                        <div className="h-px bg-border my-1"></div>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition group">
                                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Login</span>
                            </Link>
                        )}

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

            {/* Desktop Categories Bar */}
            <CategoryBar />

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
                        
                        <button
                            onClick={() => {
                                setIsMenuOpen(false)
                                setIsTrackingModalOpen(true)
                            }}
                            className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            📍 Track Order
                        </button>

                        {user ? (
                            <>
                                <Link
                                    href={user.role === 'admin' ? '/admin' : '/account'}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-border" />
                                    ) : (
                                        <span>👤</span>
                                    )}
                                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        logout()
                                    }}
                                    className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-danger hover:bg-gray-50 transition-colors"
                                >
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-3 rounded-lg text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                👤 Login / Register
                            </Link>
                        )}

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

            <TrackOrderModal 
                isOpen={isTrackingModalOpen} 
                onClose={() => setIsTrackingModalOpen(false)} 
            />
        </header>
    )

}

export default Header
