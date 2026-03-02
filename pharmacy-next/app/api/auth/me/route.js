import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

// GET /api/auth/me — get current user
export async function GET(request) {
    try {
        const user = await getAuthUser(request)

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        })
    } catch (error) {
        console.error('Auth/me error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
