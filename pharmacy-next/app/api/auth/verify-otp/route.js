import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyOTP } from '@/lib/otpStore'

export async function POST(request) {
    try {
        await dbConnect()
        const { email, otp } = await request.json()
        const normalizedEmail = email?.toLowerCase().trim()
        const normalizedOtp = otp?.toString().replace(/\s/g, '')

        if (!normalizedEmail || !normalizedOtp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        // 🔍 Verify from in-memory store
        const result = verifyOTP(normalizedEmail, normalizedOtp)

        if (!result.valid) {
            return NextResponse.json({ error: result.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'OTP verified' })
    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
