import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'
import { applyDynamicSales } from '@/lib/sales'

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
        const stockFilter = searchParams.get('stockFilter') || 'all'

        // FIX: cap page to minimum 1 (prevents negative/zero page)
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1)

        // FIX: cap limit to max 100 (prevents ?limit=100000 DB dump attack)
        const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit')) || 12), 100)

        // FIX: admin flag now comes from verified auth token, NOT from query param
        // Previously anyone could pass ?admin=true and see inactive products
        const authResult = await requireAdmin(request).catch(() => ({ error: true }))
        const isAdmin = !authResult.error

        const filter = isAdmin ? {} : { isActive: true }

        if (category) {
            const cat = await Category.findOne({ slug: category })
            if (cat) filter.category = cat._id
        }
        if (sub) filter.subcategory = sub
        if (item) filter.item = item

        if (search) {
            // FIX: cap input to 100 chars to prevent abuse
            const rawSearch = search.trim().slice(0, 100)
            filter.$text = { $search: rawSearch }
        }

        // Stock filter — only applied for admin views
        if (isAdmin) {
            if (stockFilter === 'low') {
                filter.stock = { $gt: 0, $lte: 10 }
            } else if (stockFilter === 'out') {
                filter.stock = 0
            }
        }

        // Sort options
        // FIX: removed duplicate 'popular' key (was identical to 'newest')
        const sortOptions = {
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 },
            'price-low': { price: 1 },
            'price-high': { price: -1 },
            'discount': { discount: -1 },
            'name-asc': { name: 1 },
            'name-desc': { name: -1 },
            'stock-low': { stock: 1 },
            'stock-high': { stock: -1 },
            'popularity': { salesCount: -1 },
        }

        // FIX: validate sort param — unknown sort key falls back to 'newest' explicitly
        const sortKey = sortOptions[sort] ? sort : 'newest'

        const skip = (page - 1) * limit
        const total = await Product.countDocuments(filter)
        const products = await Product.find(filter, search ? { score: { $meta: 'textScore' } } : {})
            .populate('category', 'name slug')
            .sort(search ? { score: { $meta: 'textScore' } } : sortOptions[sortKey])
            .skip(skip)
            .limit(limit)

        const productsWithSales = await applyDynamicSales(products)

        return NextResponse.json({
            products: productsWithSales,
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