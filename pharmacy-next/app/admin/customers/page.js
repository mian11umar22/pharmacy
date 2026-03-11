"use client"

import { useState, useEffect, useCallback } from 'react'
import { Search, Users, Loader2, ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Mail, Phone, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [selectedUser, setSelectedUser] = useState(null)

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true)
            const params = new URLSearchParams({ page, limit: 15 })
            if (search) params.set('search', search)
            const res = await fetch(`/api/users?${params}`)
            const data = await res.json()
            if (res.ok) {
                setUsers(data.users)
                setTotalPages(data.pages)
                setTotal(data.total)
            }
        } catch (error) {
            toast.error('Failed to load customers')
        } finally {
            setIsLoading(false)
        }
    }, [page, search])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    // Search on Enter or after 500ms debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchInput])

    const formatDate = (date) => {
        if (!date) return '—'
        return new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-secondary">Customers</h1>
                <p className="text-sm text-text-secondary mt-1">
                    {total > 0 ? `${total} registered customer${total !== 1 ? 's' : ''}` : 'All registered customers'}
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h2 className="font-bold text-secondary text-sm">All Customers ({total})</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                        <span className="text-sm text-text-secondary">Loading customers...</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-secondary font-semibold mb-1">
                            {search ? 'No customers found' : 'No customers yet'}
                        </p>
                        <p className="text-sm text-text-secondary">
                            {search ? `No results for "${search}"` : 'Customers will appear here after they register'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="sm:hidden divide-y divide-border">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
                                    className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-primary font-bold text-sm">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-secondary text-sm">{user.name}</p>
                                                <p className="text-xs text-text-secondary">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-text-secondary mt-2 ml-11">
                                        <span className="flex items-center gap-1">
                                            <ShoppingBag className="w-3 h-3" />
                                            {user.totalOrders} orders
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold text-primary">
                                            <TrendingUp className="w-3 h-3" />
                                            Rs. {user.totalSpent?.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Expanded Detail */}
                                    {selectedUser?._id === user._id && (
                                        <div className="mt-3 ml-11 space-y-1.5 text-xs text-secondary bg-gray-50 rounded-xl p-3">
                                            {user.phone && (
                                                <p className="flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-primary" />
                                                    {user.phone}
                                                </p>
                                            )}
                                            <p className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-primary" />
                                                {user.email}
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                Joined: {formatDate(user.createdAt)}
                                            </p>
                                            {user.lastOrderDate && (
                                                <p className="flex items-center gap-1.5">
                                                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                                                    Last order: {formatDate(user.lastOrderDate)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-text-secondary border-b border-border">
                                        <th className="text-left px-5 py-3 font-medium">Customer</th>
                                        <th className="text-left px-5 py-3 font-medium">Phone</th>
                                        <th className="text-left px-5 py-3 font-medium">Joined</th>
                                        <th className="text-left px-5 py-3 font-medium">Orders</th>
                                        <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                                        <th className="text-left px-5 py-3 font-medium">Last Order</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            {/* Customer Name + Email */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-primary font-bold text-sm">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-secondary">{user.name}</p>
                                                        <p className="text-xs text-text-secondary">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {user.phone || <span className="text-text-secondary">—</span>}
                                            </td>

                                            {/* Joined */}
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            {/* Orders */}
                                            <td className="px-5 py-3.5">
                                                <span className={`text-sm font-semibold ${user.totalOrders > 0 ? 'text-secondary' : 'text-text-secondary'}`}>
                                                    {user.totalOrders}
                                                </span>
                                                {user.totalOrders === 0 && (
                                                    <span className="text-xs text-text-secondary ml-1">orders</span>
                                                )}
                                            </td>

                                            {/* Total Spent */}
                                            <td className="px-5 py-3.5">
                                                {user.totalSpent > 0 ? (
                                                    <span className="text-sm font-bold text-primary">
                                                        Rs. {user.totalSpent.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-text-secondary">Rs. 0</span>
                                                )}
                                            </td>

                                            {/* Last Order */}
                                            <td className="px-5 py-3.5 text-sm text-secondary">
                                                {formatDate(user.lastOrderDate)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                                <p className="text-xs text-text-secondary">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-1.5 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-secondary" />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-1.5 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4 text-secondary" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
