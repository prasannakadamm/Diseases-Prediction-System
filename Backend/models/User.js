import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
        },
        points: {
            type: Number,
            default: 0,
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        highestStreak: {
            type: Number,
            default: 0,
        },
        lastLogin: {
            type: Date,
        },
        mentalWellnessScore: {
            type: Number,
            default: null // Null means they haven't taken the screening yet
        },
        badges: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
