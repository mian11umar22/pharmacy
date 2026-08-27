import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import CoinTransaction from '@/models/CoinTransaction'
import { requireAuth } from '@/lib/auth'

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

// GET /api/rewards/balance — coin balance, referral link, and recent history
export async function GET(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()

        const user = await User.findById(auth.user._id).select('name coinBalance referralCode')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Backfill a referral code if this user doesn't have one yet
        if (!user.referralCode) {
            user.referralCode = await generateUniqueReferralCode(user.name)
            await user.save()
        }

        const transactions = await CoinTransaction.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10)

        const host = request.headers.get('host')
        const referralLink = `https://${host}/register?ref=${user.referralCode}`

        return NextResponse.json({
            coinBalance: user.coinBalance || 0,
            referralCode: user.referralCode || null,
            referralLink,
            transactions,
        })
    } catch (error) {
        console.error('Get rewards balance error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
