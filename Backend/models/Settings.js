import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        healthReminders: { type: Boolean, default: true }
    },
    privacy: {
        shareDataForResearch: { type: Boolean, default: false },
        publicProfile: { type: Boolean, default: false }
    },
    ui: {
        darkMode: { type: Boolean, default: true },
        animations: { type: Boolean, default: true }
    }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
