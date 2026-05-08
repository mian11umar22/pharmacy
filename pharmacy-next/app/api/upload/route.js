import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { requireAuth } from '@/lib/auth'

// POST /api/upload — authenticated users can upload images
export async function POST(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        const body = await request.json()

        if (!body.image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        const folder = body.folder || 'hope-pharmacy/products'
        const result = await uploadImage(body.image, folder)

        return NextResponse.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
        })
    } catch (error) {
        console.error('❌ Upload error:', error)
        return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 })
    }
}
