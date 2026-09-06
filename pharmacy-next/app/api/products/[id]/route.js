import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'
import { applyDynamicSales } from '@/lib/sales'

// GET /api/products/[id] — public, single product
export async function GET(request, { params }) {
    try {
        await dbConnect()
        const { id } = await params
        const product = await Product.findById(id).populate('category', 'name slug')

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        const productWithSale = await applyDynamicSales(product)

        return NextResponse.json({ product: productWithSale })
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
        const existingProduct = await Product.findById(id)
        if (!existingProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        // Sync images array and primary image
        if (Array.isArray(body.images) && body.images.length > 0) {
            body.image = body.images[0].url
            body.imagePublicId = body.images[0].publicId || ''
        } else if (body.image) {
            body.images = [{ url: body.image, publicId: body.imagePublicId || '' }]
        }

        // Cleanup removed images from Cloudinary
        if (Array.isArray(body.images) && Array.isArray(existingProduct.images)) {
            const newPublicIds = new Set(body.images.map(img => img.publicId).filter(Boolean))
            for (const oldImg of existingProduct.images) {
                if (oldImg.publicId && !newPublicIds.has(oldImg.publicId)) {
                    try {
                        await deleteImage(oldImg.publicId)
                    } catch (e) {
                        console.error('Failed to delete old image from Cloudinary:', e)
                    }
                }
            }
        }

        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
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
        
        // Find product first to get image publicIds
        const product = await Product.findById(id)
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

        // Delete all associated images from Cloudinary
        if (Array.isArray(product.images) && product.images.length > 0) {
            for (const img of product.images) {
                if (img.publicId) {
                    try {
                        await deleteImage(img.publicId)
                    } catch (e) {
                        console.error('Failed to delete image from Cloudinary:', e)
                    }
                }
            }
        } else if (product.imagePublicId) {
            await deleteImage(product.imagePublicId)
        }

        // Delete from DB
        await Product.findByIdAndDelete(id)

        return NextResponse.json({ success: true, message: 'Product deleted' })
    } catch (error) {
        console.error('Delete product error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
