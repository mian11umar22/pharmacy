import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import CoinTransaction from '@/models/CoinTransaction'
import Setting from '@/models/Setting'
import { requireAuth } from '@/lib/auth'

// POST /api/rewards/redeem — redeem coins for a checkout discount
export async function POST(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { coinsToRedeem } = await request.json()

        if (!coinsToRedeem || coinsToRedeem <= 0) {
            return NextResponse.json({ error: 'coinsToRedeem must be greater than 0' }, { status: 400 })
        }

        const user = await User.findById(auth.user._id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (coinsToRedeem > (user.coinBalance || 0)) {
            return NextResponse.json({ error: 'Insufficient coin balance' }, { status: 400 })
        }

        const maxCoinsSetting = await Setting.findOne({ key: 'max_coins_per_order' })
        const maxCoinsPerOrder = maxCoinsSetting ? maxCoinsSetting.value : 500

        if (coinsToRedeem > maxCoinsPerOrder) {
            return NextResponse.json({ error: `Cannot redeem more than ${maxCoinsPerOrder} coins per order` }, { status: 400 })
        }

        const rateSetting = await Setting.findOne({ key: 'coin_to_rupee_rate' })
        const coinToRupeeRate = rateSetting ? rateSetting.value : 1

        const discountAmount = coinsToRedeem * coinToRupeeRate

        try {
            user.coinBalance -= coinsToRedeem
            await user.save()

            await CoinTransaction.create({
                userId: user._id,
                type: 'redeemed',
                reason: 'shopping',
                coins: coinsToRedeem,
            })
        } catch (dbError) {
            console.error('Coin redemption save error:', dbError)
            return NextResponse.json({ error: 'Failed to redeem coins' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            coinsUsed: coinsToRedeem,
            discountAmount,
            remainingBalance: user.coinBalance,
        })
    } catch (error) {
        console.error('Redeem coins error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
