import User from '@/models/User'
import CoinTransaction from '@/models/CoinTransaction'
import Setting from '@/models/Setting'

async function getSettingValue(key, defaultValue) {
    const setting = await Setting.findOne({ key })
    return setting ? setting.value : defaultValue
}

// Awards first-login coins (and referral coins, if applicable) to a user.
// Safe to call multiple times — a CoinTransaction with reason 'login' marks
// the award as already given, so it never double-awards.
export async function awardFirstLoginCoins(userId) {
    const existingLoginTx = await CoinTransaction.findOne({ userId, reason: 'login' })
    if (existingLoginTx) return

    const user = await User.findById(userId)
    if (!user) return

    const loginCoins = await getSettingValue('login_coins', 5)

    await CoinTransaction.create({
        userId: user._id,
        type: 'earned',
        reason: 'login',
        coins: loginCoins,
    })
    user.coinBalance = (user.coinBalance || 0) + loginCoins
    await user.save()

    if (user.referredBy) {
        const referralCoinsNewUser = await getSettingValue('referral_coins_new_user', 20)
        const referralCoinsReferrer = await getSettingValue('referral_coins_referrer', 50)

        await CoinTransaction.create({
            userId: user._id,
            type: 'earned',
            reason: 'signup',
            coins: referralCoinsNewUser,
        })
        user.coinBalance = (user.coinBalance || 0) + referralCoinsNewUser
        await user.save()

        const referrer = await User.findById(user.referredBy)
        if (referrer) {
            await CoinTransaction.create({
                userId: referrer._id,
                type: 'earned',
                reason: 'referral',
                coins: referralCoinsReferrer,
            })
            referrer.coinBalance = (referrer.coinBalance || 0) + referralCoinsReferrer
            await referrer.save()
        }
    }
}
