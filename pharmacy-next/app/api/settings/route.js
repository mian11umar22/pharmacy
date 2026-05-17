import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Setting from '@/models/Setting'

// GET /api/settings — get public settings (no auth required)
export async function GET() {
    try {
        await dbConnect()

        // Only fetch specific allowed keys to avoid leaking sensitive admin settings
        const allowedKeys = [
            'delivery_fee', 'contact_phone', 'contact_email', 'site_notice',
            'top_marquee', 'hero_title_main', 'hero_title_highlight', 'hero_subtitle', 'ad_banner_1', 'ad_banner_2'
        ]
        const settings = await Setting.find({ key: { $in: allowedKeys } })

        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {
            // Defaults in case they aren't in DB yet
            delivery_fee: 150,
            top_marquee: 'Order Now: 03054964343 | 💊 Genuine Medicines at Your Doorstep | WhatsApp us your Prescription',
            hero_title_main: 'Trusted Medicines',
            hero_title_highlight: 'Delivered to You',
            hero_subtitle: 'Order genuine medicines, vitamins, and personal care products from the comfort of your home. Fast delivery across Pakistan.'
        })

        return NextResponse.json({ settings: settingsObj })
    } catch (error) {
        console.error('Get public settings error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
