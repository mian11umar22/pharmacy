import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't include password in queries by default
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    addresses: [{
        label: { type: String, default: 'Home' },
        address: String,
        city: String,
    }],
    image: {
        type: String,
        default: '',
    },
    imagePublicId: {
        type: String,
        default: '',
    },
    coinBalance: {
        type: Number,
        default: 0,
        required: false,
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
        required: false,
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        required: false,
    },
}, {
    timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Force model re-registration in dev to handle schema changes
if (mongoose.models && mongoose.models.User) {
    delete mongoose.models.User
}

const User = mongoose.model('User', userSchema)
export default User
