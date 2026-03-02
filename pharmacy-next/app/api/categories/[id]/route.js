import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

// PUT /api/categories/[id] — admin, update category
export async function PUT(request, { params }) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const body = await request.json()

        // Update a subcategory or item
        if (body.subcategoryId) {
            const category = await Category.findById(id)
            if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

            if (body.itemId) {
                // Update item
                const sub = category.subcategories.id(body.subcategoryId)
                if (!sub) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
                const item = sub.items.id(body.itemId)
                if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
                item.name = body.name
                item.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            } else {
                // Update subcategory name
                const sub = category.subcategories.id(body.subcategoryId)
                if (!sub) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
                sub.name = body.name
                sub.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }

            await category.save()
            return NextResponse.json({ success: true, category })
        }

        // Update top-level category
        const updateData = {}
        if (body.name) {
            updateData.name = body.name
            updateData.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }
        if (body.bgColor !== undefined) updateData.bgColor = body.bgColor
        if (body.letterColor !== undefined) updateData.letterColor = body.letterColor
        if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
        if (body.order !== undefined) updateData.order = body.order

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

        return NextResponse.json({ success: true, category })
    } catch (error) {
        console.error('Update category error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}

// DELETE /api/categories/[id] — admin, delete category/subcategory/item
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const subcategoryId = searchParams.get('sub')
        const itemId = searchParams.get('item')

        if (subcategoryId) {
            const category = await Category.findById(id)
            if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

            if (itemId) {
                // Delete item from subcategory
                const sub = category.subcategories.id(subcategoryId)
                if (sub) sub.items.pull({ _id: itemId })
            } else {
                // Delete subcategory
                category.subcategories.pull({ _id: subcategoryId })
            }

            await category.save()
            return NextResponse.json({ success: true, category })
        }

        // Delete entire category
        const category = await Category.findByIdAndDelete(id)
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

        return NextResponse.json({ success: true, message: 'Category deleted' })
    } catch (error) {
        console.error('Delete category error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
