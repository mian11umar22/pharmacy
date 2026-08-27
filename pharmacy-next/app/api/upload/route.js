import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
// Base64 grows the payload ~33% over raw bytes; 8MB of base64 text caps the
// decoded image around ~6MB, which is generous for a phone camera photo.
const MAX_BASE64_LENGTH = 8 * 1024 * 1024

// POST /api/upload — open to guests too (prescriptions are uploaded before login/checkout)
export async function POST(request) {
    try {
        const body = await request.json()

        if (!body.image || typeof body.image !== 'string') {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        const dataUrlMatch = body.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
        if (!dataUrlMatch) {
            return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
        }

        const mimeType = dataUrlMatch[1].toLowerCase()
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return NextResponse.json({ error: 'Only image files (JPEG, PNG, WEBP, HEIC) are allowed' }, { status: 400 })
        }

        if (body.image.length > MAX_BASE64_LENGTH) {
            return NextResponse.json({ error: 'Image is too large. Please upload a file under 6MB' }, { status: 413 })
        }

        // Restrict which folders can be written to — callers may only pass a
        // known-safe subfolder name, never an arbitrary Cloudinary path.
        const allowedFolders = ['hope-pharmacy/products', 'hope-pharmacy/prescriptions']
        const folder = allowedFolders.includes(body.folder) ? body.folder : 'hope-pharmacy/products'

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
