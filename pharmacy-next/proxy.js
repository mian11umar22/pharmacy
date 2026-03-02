import { NextResponse } from 'next/server'

export function proxy(request) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // 1. Protect /admin and /account routes from Guests
    if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
        if (!token) {
            // Redirect to login if no token is present
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // 2. Prevent logged in users from visiting Login/Signup
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/account', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
        '/login',
        '/register'
    ],
}
