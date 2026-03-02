"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, Menu, X, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
]

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth()
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login?redirect=' + pathname)
            } else if (user.role !== 'admin') {
                router.push('/')
            }
        }
    }, [user, loading, router, pathname])

    const isActive = (href) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-secondary font-medium italic">Verifying admin access...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-secondary cursor-pointer">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="flex items-center">
                        <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 2% 0)' }}>
                            <Image
                                src="/images/logo.png"
                                alt="Hope Pharmacy"
                                width={100}
                                height={30}
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-slide-in-right" style={{ animationDirection: 'normal' }}>
                        <SidebarContent pathname={pathname} isActive={isActive} onClose={() => setSidebarOpen(false)} onLogout={logout} />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-60 bg-white border-r border-border flex-col">
                <SidebarContent pathname={pathname} isActive={isActive} onLogout={logout} />
            </aside>

            {/* Main Content */}
            <div className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
                {children}
            </div>
        </div>
    )
}

import Image from 'next/image'

function SidebarContent({ pathname, isActive, onClose, onLogout }) {
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            onLogout()
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <div className="overflow-hidden" style={{ clipPath: 'inset(2% 0 2% 0)' }}>
                        <Image
                            src="/images/logo.png"
                            alt="Hope Pharmacy"
                            width={120}
                            height={40}
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-gray-400 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-text-secondary hover:bg-gray-100 hover:text-secondary'
                                }`}
                        >
                            <Icon className="w-4.5 h-4.5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-all w-full cursor-pointer"
                >
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                </button>
            </div>
        </div>
    )
}
