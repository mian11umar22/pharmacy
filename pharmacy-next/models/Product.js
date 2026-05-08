import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    image: {
        type: String,
        default: '',
    },
    imagePublicId: {
        type: String,
        default: '',
    },
    salesCount: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    subcategory: {
        type: String, // slug of subcategory
        default: '',
    },
    item: {
        type: String, // slug of item
        default: '',
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
})

// Index for efficient queries
productSchema.index({ category: 1, subcategory: 1, item: 1 })
productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ isActive: 1, createdAt: -1 })

// Force model re-registration in dev to handle schema changes
if (mongoose.models && mongoose.models.Product) {
    delete mongoose.models.Product
}

const Product = mongoose.model('Product', productSchema)
export default Product
