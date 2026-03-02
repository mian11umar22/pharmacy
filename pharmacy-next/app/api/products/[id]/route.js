import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'

// GET /api/products/[id] — public, single product
export async function GET(request, { params }) {
    try {
        await dbConnect()
        const { id } = await params
        const product = await Product.findById(id).populate('category', 'name slug')

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json({ product })
    } catch (error) {
        console.error('Get product error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// PUT /api/products/[id] — admin, update product
export async function PUT(request, { params }) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const body = await request.json()

        // Recalculate original price
        if (body.discount > 0 && body.price) {
            body.originalPrice = Math.round(body.price / (1 - body.discount / 100))
        } else if (body.price) {
            body.originalPrice = body.price
        }

        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        return NextResponse.json({ success: true, product })
    } catch (error) {
        console.error('Update product error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}

// DELETE /api/products/[id] — admin, delete product
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const product = await Product.findByIdAndDelete(id)
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        return NextResponse.json({ success: true, message: 'Product deleted' })
    } catch (error) {
        console.error('Delete product error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
