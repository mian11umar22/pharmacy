import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { generateToken } from '@/lib/auth'

// POST /api/auth/register
export async function POST(request) {
    try {
        await dbConnect()
        const { name, email, password, phone } = await request.json()

        // Check if user exists
        const emailLower = email.toLowerCase()
        const existingUser = await User.findOne({ email: emailLower })
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
        }

        // Create user
        const user = await User.create({ name, email: emailLower, password, phone })

        // Link historical guest orders to this new user (based on email)
        try {
            const linkedResult = await Order.updateMany(
                {
                    'shippingAddress.email': emailLower,
                    user: null
                },
                { user: user._id }
            )
            console.log(`🔗 Linked ${linkedResult.modifiedCount} historical guest orders to new user: ${emailLower}`)
        } catch (linkError) {
            console.error('Error linking historical orders:', linkError)
        }

        // Generate token
        const token = generateToken(user._id)

        const response = NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        }, { status: 201 })

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
