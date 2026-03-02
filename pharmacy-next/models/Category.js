import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
})

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    items: [itemSchema],
})

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    bgColor: {
        type: String,
        default: 'bg-blue-100',
    },
    letterColor: {
        type: String,
        default: 'text-blue-600',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    subcategories: [subcategorySchema],
}, {
    timestamps: true,
})

// Auto-generate slug from name before saving
categorySchema.pre('save', async function () {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
})

export default mongoose.models.Category || mongoose.model('Category', categorySchema)
