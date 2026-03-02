import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

// GET /api/users — admin, get all users
export async function GET(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 20
        const search = searchParams.get('search')

        const filter = {}
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        const skip = (page - 1) * limit
        const total = await User.countDocuments(filter)
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) })
    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
