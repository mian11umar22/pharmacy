import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Upload image from base64 or URL
export async function uploadImage(file, folder = 'hope-pharmacy') {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        })
        return { url: result.secure_url, publicId: result.public_id }
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw new Error('Image upload failed')
    }
}

// Delete image by public ID
export async function deleteImage(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Cloudinary delete error:', error)
    }
}
