"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('cart')
            if (storedCart) {
                const parsed = JSON.parse(storedCart)
                setCartItems(parsed.map(item => ({
                    ...item,
                    quantity: Number(item.quantity) || 1
                })))
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage', error)
        }
        setIsLoaded(true)
    }, [])

    // Persist cart to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        }
    }, [cartItems, isLoaded])

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const productId = product._id || product.id
            const existingItem = prevItems.find((item) => (item._id || item.id) === productId)
            if (existingItem) {
                return prevItems.map((item) =>
                    (item._id || item.id) === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prevItems, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => (item._id || item.id) !== productId))
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0)
    }

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoaded
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
