import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

// GET /api/products — public, list products with filters
export async function GET(request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)

        const category = searchParams.get('category')
        const sub = searchParams.get('sub')
        const item = searchParams.get('item')
        const search = searchParams.get('search')
        const sort = searchParams.get('sort') || 'newest'
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12

        // Build filter query
        const filter = { isActive: true }

        if (category) {
            // Find category by slug
            const cat = await Category.findOne({ slug: category })
            if (cat) filter.category = cat._id
        }
        if (sub) filter.subcategory = sub
        if (item) filter.item = item
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]
        }

        // Sort options
        const sortOptions = {
            'newest': { createdAt: -1 },
            'price-low': { price: 1 },
            'price-high': { price: -1 },
            'discount': { discount: -1 },
            'popular': { createdAt: -1 },
        }

        const skip = (page - 1) * limit
        const total = await Product.countDocuments(filter)
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOptions[sort] || sortOptions.newest)
            .skip(skip)
            .limit(limit)

        return NextResponse.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Get products error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// POST /api/products — admin, create product
export async function POST(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const body = await request.json()

        // Calculate original price if discount is set
        if (body.discount > 0 && body.price) {
            body.originalPrice = Math.round(body.price / (1 - body.discount / 100))
        } else {
            body.originalPrice = body.price
        }

        const product = await Product.create(body)
        return NextResponse.json({ success: true, product }, { status: 201 })
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
