import mongoose from 'mongoose'

const coinTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['earned', 'redeemed'],
        required: true,
    },
    reason: {
        type: String,
        enum: ['shopping', 'referral', 'login', 'signup'],
        required: true,
    },
    coins: {
        type: Number,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
        default: null,
    },
}, {
    timestamps: true,
})

// Force model re-registration in dev
if (mongoose.models && mongoose.models.CoinTransaction) {
    delete mongoose.models.CoinTransaction
}

const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema)
export default CoinTransaction
