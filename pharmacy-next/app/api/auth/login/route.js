import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'
import { awardFirstLoginCoins } from '@/lib/awardFirstLoginCoins'

// Generate a short unique referral code: first 4 letters of name (uppercase) + 4 random digits
async function generateUniqueReferralCode(name) {
    const namePart = (name || '')
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .padEnd(4, 'X')
        .slice(0, 4)

    let code
    let exists = true
    while (exists) {
        const digits = Math.floor(1000 + Math.random() * 9000)
        code = `${namePart}${digits}`
        exists = await User.findOne({ referralCode: code }).select('_id')
    }
    return code
}

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

        // Award first-login coins (and referral coins, if applicable) — must never break login
        try {
            // Backfill a referral code for existing users who don't have one yet
            if (!user.referralCode) {
                user.referralCode = await generateUniqueReferralCode(user.name)
                await user.save()
            }

            await awardFirstLoginCoins(user._id)
        } catch (coinError) {
            console.error('Coin award error:', coinError)
        }

        // Generate token
        const token = generateToken(user._id)

        const response = NextResponse.json({
            success: true,
            user: { 
                id: user._id,
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                role: user.role,
                image: user.image,
                imagePublicId: user.imagePublicId
            },
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
