import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

export async function GET(request) {
    try {
        const authUser = await getAuthUser(request)
        if (!authUser) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

        await dbConnect()
        const user = await User.findById(authUser._id).lean()

        return NextResponse.json({
            message: 'User Debug Info',
            database_record: user,
            auth_context_info: authUser
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
