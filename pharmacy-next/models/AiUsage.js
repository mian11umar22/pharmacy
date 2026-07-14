// Trigger Vercel Build for Env Vars
import mongoose from 'mongoose'

const aiUsageSchema = new mongoose.Schema({
    date: {
        type: String, // Storing date as YYYY-MM-DD for easy querying
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
})

// Force model re-registration in dev to handle schema changes
if (mongoose.models && mongoose.models.AiUsage) {
    delete mongoose.models.AiUsage
}

const AiUsage = mongoose.model('AiUsage', aiUsageSchema)
export default AiUsage
