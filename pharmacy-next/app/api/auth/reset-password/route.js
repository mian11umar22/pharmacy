import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyOTP, clearOTP } from '@/lib/otpStore'

export async function POST(request) {
    try {
        await dbConnect()
        const { email, otp, password } = await request.json()
        const normalizedEmail = email?.toLowerCase().trim()

        if (!normalizedEmail || !otp || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        // 🔍 Verify from in-memory store
        const result = verifyOTP(normalizedEmail, otp)
        if (!result.valid) {
            return NextResponse.json({ error: result.message }, { status: 400 })
        }

        const user = await User.findOne({ email: normalizedEmail }).select('+password')

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Update password (pre-save hook will hash it)
        user.password = password
        await user.save()

        // 🧹 Clear from in-memory store
        clearOTP(normalizedEmail)

        return NextResponse.json({ success: true, message: 'Password reset successful' })
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
