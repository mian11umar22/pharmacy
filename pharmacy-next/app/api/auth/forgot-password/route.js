import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { sendOTPEmail } from '@/lib/email'
import { saveOTP } from '@/lib/otpStore'

export async function POST(request) {
    try {
        await dbConnect()
        const { email } = await request.json()
        const normalizedEmail = email?.toLowerCase().trim()

        if (!normalizedEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            // For security, don't reveal if user exists or not
            return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' })
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // 💾 Save to in-memory store (instead of DB as requested)
        saveOTP(normalizedEmail, otp)

        // Send Email
        await sendOTPEmail(user.email, otp, user.name)

        return NextResponse.json({ message: 'OTP sent to your email.' })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
