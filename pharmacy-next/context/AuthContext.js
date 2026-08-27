"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [coinBalance, setCoinBalance] = useState(null)

    const fetchCoinBalance = async () => {
        try {
            const res = await fetch('/api/rewards/balance')
            const data = await res.json()
            if (res.ok) {
                setCoinBalance(data.coinBalance ?? 0)
            }
        } catch (error) {
            console.error('Failed to fetch coin balance:', error)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me')
                const data = await res.json()
                if (res.ok && data.user) {
                    setUser(data.user)
                    fetchCoinBalance()
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    const login = (userData) => {
        setUser(userData)
        fetchCoinBalance()
    }

    const logout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            if (res.ok) {
                setUser(null)
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, coinBalance, fetchCoinBalance }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
