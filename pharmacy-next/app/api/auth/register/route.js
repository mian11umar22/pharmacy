import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
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

// POST /api/auth/register
export async function POST(request) {
    try {
        await dbConnect()
        const { name, email, password, phone, referralCode } = await request.json()

        // Check if user exists
        const emailLower = email.toLowerCase()
        const existingUser = await User.findOne({ email: emailLower })
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
        }

        // Resolve referrer from optional referral code (ignore silently if not found)
        let referredBy = null
        if (referralCode) {
            const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() }).select('_id')
            if (referrer) {
                referredBy = referrer._id
            }
        }

        // Generate this user's own unique referral code
        const newReferralCode = await generateUniqueReferralCode(name)

        // Create user
        const user = await User.create({
            name,
            email: emailLower,
            password,
            phone,
            referralCode: newReferralCode,
            referredBy,
        })

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

        // Award first-login coins (and referral coins, if applicable) — must never break signup
        try {
            await awardFirstLoginCoins(user._id)
        } catch (coinError) {
            console.error('Coin award error:', coinError)
        }

        // Generate token
        const token = generateToken(user._id)

        const response = NextResponse.json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
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
