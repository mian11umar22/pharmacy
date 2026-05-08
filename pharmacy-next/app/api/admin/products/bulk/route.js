import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(request) {
    try {
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { ids, discount } = await request.json()

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 })
        }

        if (typeof discount !== 'number' || discount < 0 || discount > 100) {
            return NextResponse.json({ error: 'Invalid discount value' }, { status: 400 })
        }

        // Fetch products to get their originalPrices
        const products = await Product.find({ _id: { $in: ids } })

        const bulkOps = products.map(product => {
            // Logic: Use originalPrice as base. If not available, use current price.
            const basePrice = product.originalPrice || product.price
            const newPrice = Math.round(basePrice * (1 - discount / 100))
            
            return {
                updateOne: {
                    filter: { _id: product._id },
                    update: {
                        $set: {
                            discount: discount,
                            price: newPrice,
                            originalPrice: basePrice
                        }
                    }
                }
            }
        })

        if (bulkOps.length > 0) {
            await Product.bulkWrite(bulkOps)
        }

        return NextResponse.json({ 
            success: true, 
            message: `${bulkOps.length} products updated successfully` 
        })

    } catch (error) {
        console.error('Bulk update error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
