import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

// Generate JWT token
export function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' })
}

// Verify token and return user (or null)
export async function getAuthUser(request) {
    try {
        const token = request.cookies.get('token')?.value
            || request.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) return null

        const decoded = jwt.verify(token, JWT_SECRET)
        await dbConnect()
        const user = await User.findById(decoded.id).select('-password')

        return user || null
    } catch {
        return null
    }
}

// Middleware: Require authentication
export async function requireAuth(request) {
    const user = await getAuthUser(request)
    if (!user) {
        return { error: 'Not authenticated. Please login.', status: 401 }
    }
    return { user }
}

// Middleware: Require admin role
export async function requireAdmin(request) {
    const result = await requireAuth(request)
    if (result.error) return result

    if (result.user.role !== 'admin') {
        return { error: 'Admin access required', status: 403 }
    }
    return result
}
