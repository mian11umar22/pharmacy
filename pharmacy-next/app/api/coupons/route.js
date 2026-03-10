import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { requireAuth } from '@/lib/auth'

// GET /api/coupons — Admin: get all coupons
export async function GET(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })
        if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await dbConnect()
        const coupons = await Coupon.find({}).sort({ createdAt: -1 })
        return NextResponse.json({ coupons })
    } catch (error) {
        console.error('Get coupons error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// POST /api/coupons — Admin: create a new coupon
export async function POST(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })
        if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await dbConnect()
        const body = await request.json()

        const { code, discountType, discountValue, minCartValue, maxUses, expiryDate, isActive } = body

        if (!code || !discountType || discountValue === undefined) {
            return NextResponse.json({ error: 'Code, discount type, and value are required' }, { status: 400 })
        }

        if (!['percentage', 'flat'].includes(discountType)) {
            return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 })
        }

        if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
            return NextResponse.json({ error: 'Percentage must be between 1 and 100' }, { status: 400 })
        }

        if (discountType === 'flat' && discountValue <= 0) {
            return NextResponse.json({ error: 'Flat discount must be greater than 0' }, { status: 400 })
        }

        const coupon = await Coupon.create({
            code: code.trim().toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            minCartValue: Number(minCartValue) || 0,
            maxUses: Number(maxUses) || 0,
            expiryDate: expiryDate || null,
            isActive: isActive !== undefined ? isActive : true,
        })

        return NextResponse.json({ success: true, coupon }, { status: 201 })
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 })
        }
        console.error('Create coupon error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
