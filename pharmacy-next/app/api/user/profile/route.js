import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { deleteImage } from '@/lib/cloudinary'

// PATCH /api/user/profile — Update user info or password
export async function PATCH(request) {
    try {
        const auth = await requireAuth(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const body = await request.json()
        const { name, phone, currentPassword, newPassword, image, imagePublicId } = body

        const user = await User.findById(auth.user._id).select('+password')
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        // Scenario 1: Password Update
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required to set a new one' }, { status: 400 })
            }
            const isMatch = await user.comparePassword(currentPassword)
            if (!isMatch) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 })
            }
            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
            }
            user.password = newPassword
        }

        // Scenario 2: Info Update
        if (name) user.name = name
        if (phone !== undefined) user.phone = phone

        // Scenario 3: Image Update
        if (image !== undefined) {
            console.log('🖼️ Updating image:', image ? 'New Image Provided' : 'Image Removed')
            // If there's an old image, delete it from Cloudinary
            if (user.imagePublicId && imagePublicId && user.imagePublicId !== imagePublicId) {
                await deleteImage(user.imagePublicId).catch(err => console.error('Cloudinary delete error:', err))
            }
            user.image = image
            user.imagePublicId = imagePublicId || ''
        }

        console.log('💾 Saving user data...', { name: user.name, phone: user.phone })
        const savedUser = await user.save()
        console.log('✅ User saved successfully:', savedUser.name)

        // Return updated user (excluding password)
        const updatedUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            imagePublicId: user.imagePublicId,
            role: user.role
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Profile updated successfully', 
            user: updatedUser 
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
