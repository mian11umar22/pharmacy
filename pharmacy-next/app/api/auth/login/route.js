import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'

// POST /api/auth/login
export async function POST(request) {
    try {
        await dbConnect()
        const { email, password } = await request.json()

        // Find user with password
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Check password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Generate token
        const token = generateToken(user._id)

        const response = NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        })

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
