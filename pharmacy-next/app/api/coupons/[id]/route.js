import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { requireAuth } from '@/lib/auth'

// PATCH /api/coupons/[id] — Admin: update a coupon
export async function PATCH(request, { params }) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })
        if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await dbConnect()
        const body = await request.json()
        const { id } = await params

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        )

        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, coupon })
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 })
        }
        console.error('Update coupon error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// DELETE /api/coupons/[id] — Admin: delete a coupon
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })
        if (auth.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await dbConnect()
        const { id } = await params

        const coupon = await Coupon.findByIdAndDelete(id)
        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Coupon deleted' })
    } catch (error) {
        console.error('Delete coupon error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
