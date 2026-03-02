import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Setting from '@/models/Setting'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/settings — get all settings
export async function GET(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const settings = await Setting.find()

        // Convert array to object for easier use on frontend
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        return NextResponse.json({ settings: settingsObj })
    } catch (error) {
        console.error('Get settings error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// POST /api/admin/settings — update/create settings
export async function POST(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const body = await request.json()
        const { key, value } = body

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 })
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        )

        return NextResponse.json({ success: true, setting })
    } catch (error) {
        console.error('Update setting error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
