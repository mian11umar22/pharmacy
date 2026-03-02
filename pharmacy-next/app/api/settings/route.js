import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Setting from '@/models/Setting'

// GET /api/settings — get public settings (no auth required)
export async function GET() {
    try {
        await dbConnect()

        // Only fetch specific allowed keys to avoid leaking sensitive admin settings
        const allowedKeys = ['delivery_fee', 'contact_phone', 'contact_email', 'site_notice']
        const settings = await Setting.find({ key: { $in: allowedKeys } })

        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {
            // Defaults in case they aren't in DB yet
            delivery_fee: 150
        })

        return NextResponse.json({ settings: settingsObj })
    } catch (error) {
        console.error('Get public settings error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
