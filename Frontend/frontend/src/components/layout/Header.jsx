import { Link } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-primary text-white text-xs py-2 text-center font-medium">
                Free Delivery on orders above Rs. 2000! 🚚
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            M
                        </div>
                        <span className="text-xl font-bold text-secondary">MedStore</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search for medicines, health products..."
                            className="w-full pl-4 pr-10 py-2 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                        />
                        <Search className="absolute right-3 top-2.5 text-text-secondary w-5 h-5 cursor-pointer" />
                    </div>

                    {/* Icons Navigation */}
                    <div className="flex items-center gap-6">
                        <Link to="/products" className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            <span className="text-xs mt-0.5">Shop</span>
                        </Link>

                        <Link to="/login" className="hidden md:flex flex-col items-center text-text-secondary hover:text-primary transition">
                            <User className="w-6 h-6" />
                            <span className="text-xs mt-0.5">Login</span>
                        </Link>

                        <Link to="/cart" className="flex flex-col items-center text-text-secondary hover:text-primary transition relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                            <span className="text-xs mt-0.5 hidden md:block">Cart</span>
                        </Link>

                        <button
                            className="md:hidden text-secondary"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar (Visible only on mobile) */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            className="w-full pl-4 pr-10 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                        />
                        <Search className="absolute right-3 top-2.5 text-text-secondary w-5 h-5" />
                    </div>
                </div>
            </div>


            {/* Mobile Menu Dropdown */}
            {
                isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-border animate-fade-in absolute w-full left-0 shadow-lg">
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            <Link
                                to="/products"
                                className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-primary-light/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Shop Medicines
                            </Link>
                            <Link
                                to="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-primary-light/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login / Register
                            </Link>
                            <Link
                                to="/cart"
                                className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-primary-light/50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Cart
                            </Link>
                            <div className="border-t border-border pt-4">
                                <div className="flex items-center gap-3 text-sm text-text-secondary px-3">
                                    <span className="font-semibold">Need Help?</span>
                                    <a href="tel:03001234567" className="text-primary">0300-1234567</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </header >
    )
}

export default Header
