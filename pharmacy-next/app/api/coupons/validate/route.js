import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

// POST /api/coupons/validate — Public: validate a coupon code at checkout
export async function POST(request) {
    try {
        await dbConnect()
        const { code, cartTotal } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
        }

        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() })

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
        }

        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
        }

        if (coupon.minCartValue > 0 && cartTotal < coupon.minCartValue) {
            return NextResponse.json({
                error: `Minimum cart total of Rs. ${coupon.minCartValue} required for this coupon`
            }, { status: 400 })
        }

        // Calculate discount amount
        let discountAmount = 0
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((cartTotal * coupon.discountValue) / 100)
        } else {
            discountAmount = coupon.discountValue
        }

        // Ensure discount does not exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal)

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
            discountAmount,
            message: coupon.discountType === 'percentage'
                ? `${coupon.discountValue}% discount applied!`
                : `Rs. ${coupon.discountValue} discount applied!`
        })
    } catch (error) {
        console.error('Validate coupon error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
