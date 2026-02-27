"use client"

import Link from 'next/link'
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const MobileNav = () => {
    const { getCartCount } = useCart()
    const pathname = usePathname()
    const cartCount = getCartCount()

    // Hide on Cart and Checkout pages (they have their own sticky action bars)
    if (pathname === '/cart' || pathname === '/checkout') {
        return null
    }

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: LayoutGrid, label: 'Categories', href: '/categories' },
        { icon: ShoppingCart, label: 'Cart', href: '/cart', count: cartCount },
        { icon: User, label: 'Account', href: '/login' },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 z-[100] flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                        "flex flex-col items-center gap-1 transition-all",
                        pathname === item.href || (item.href === '/categories' && pathname.startsWith('/categories'))
                            ? "text-primary scale-110"
                            : "text-text-secondary hover:text-primary"
                    )}
                >
                    <div className="relative">
                        <item.icon className={clsx(
                            "w-6 h-6",
                            pathname === item.href || (item.href === '/categories' && pathname.startsWith('/categories'))
                                ? "stroke-[2.5px]"
                                : "stroke-2"
                        )} />
                        {item.count > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {item.count}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </Link>
            ))}
        </div>
    )
}

export default MobileNav
