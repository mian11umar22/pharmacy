import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    description: String,
}, {
    timestamps: true,
})

// Force model re-registration in dev
if (mongoose.models && mongoose.models.Setting) {
    delete mongoose.models.Setting
}

const Setting = mongoose.model('Setting', settingsSchema)
export default Setting
