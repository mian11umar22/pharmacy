"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, Menu, X, LogOut } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
]

export default function AdminLayout({ children }) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const isActive = (href) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-secondary cursor-pointer">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">H+</span>
                        </div>
                        <span className="font-bold text-secondary text-sm">Admin Panel</span>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-slide-in-right" style={{ animationDirection: 'normal' }}>
                        <SidebarContent pathname={pathname} isActive={isActive} onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-60 bg-white border-r border-border flex-col">
                <SidebarContent pathname={pathname} isActive={isActive} />
            </aside>

            {/* Main Content */}
            <div className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
                {children}
            </div>
        </div>
    )
}

function SidebarContent({ pathname, isActive, onClose }) {
    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm font-bold">H+</span>
                    </div>
                    <div>
                        <p className="font-bold text-secondary text-sm">Hope Pharmacy</p>
                        <p className="text-[10px] text-text-secondary">Admin Panel</p>
                    </div>
                </div>
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
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-all w-full cursor-pointer">
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                </button>
            </div>
        </div>
    )
}
