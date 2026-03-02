import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    image: String,
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderNumber: {
        type: String,
        unique: true,
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: String,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cod'],
        default: 'cod',
    },
    notes: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
})

// Auto-generate order number before saving
orderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const count = await mongoose.models.Order.countDocuments()
        this.orderNumber = `HP-${String(count + 1001).padStart(5, '0')}`
    }
})

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

// Force model re-registration in dev
if (mongoose.models && mongoose.models.Order) {
    delete mongoose.models.Order
}

const Order = mongoose.model('Order', orderSchema)
export default Order
