import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minCartValue: {
        type: Number,
        default: 0,
    },
    maxUses: {
        type: Number,
        default: 0, // 0 = unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
})

// Force model re-registration in dev
if (mongoose.models && mongoose.models.Coupon) {
    delete mongoose.models.Coupon
}

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
