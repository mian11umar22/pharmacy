import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

// GET /api/categories — public, get all categories
export async function GET() {
    try {
        await dbConnect()
        const categories = await Category.find({}).sort({ order: 1, createdAt: 1 })
        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Get categories error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// POST /api/categories — admin, create category
export async function POST(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const body = await request.json()
        if (!body.name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
        }

        // Handle subcategory/item addition
        if (body.categoryId) {
            const category = await Category.findById(body.categoryId)
            if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

            if (body.subcategoryId) {
                // Adding item to subcategory
                const sub = category.subcategories.id(body.subcategoryId)
                if (!sub) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })

                const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                sub.items.push({ name: body.name, slug })
                await category.save()
                return NextResponse.json({ success: true, category }, { status: 201 })
            } else {
                // Adding subcategory
                const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                category.subcategories.push({ name: body.name, slug, items: [] })
                await category.save()
                return NextResponse.json({ success: true, category }, { status: 201 })
            }
        }

        // Creating new top-level category
        const category = await Category.create({
            name: body.name,
            slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            bgColor: body.bgColor || 'bg-blue-100',
            letterColor: body.letterColor || 'text-blue-600',
            isFeatured: body.isFeatured || false,
        })

        return NextResponse.json({ success: true, category }, { status: 201 })
    } catch (error) {
        console.error('❌ Create category error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
