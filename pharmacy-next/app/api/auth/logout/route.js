import { NextResponse } from 'next/server'

// POST /api/auth/logout
export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out' })

    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    })

    return response
}
