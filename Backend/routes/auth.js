import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            role: 'user', // Default to user. Admins are created separately or directly in DB.
            points: 10, // Sign up bonus
            currentStreak: 1,
            highestStreak: 1,
            lastLogin: new Date()
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                streak: user.currentStreak,
                badges: user.badges,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const now = new Date();
            if (user.lastLogin) {
                const lastLoginDate = new Date(user.lastLogin);
                const normalNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const normalLast = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
                const diffTime = Math.abs(normalNow - normalLast);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    user.currentStreak += 1;
                    user.points += 5; // Daily login reward
                    if (user.currentStreak > user.highestStreak) {
                        user.highestStreak = user.currentStreak;
                    }
                } else if (diffDays > 1) {
                    user.currentStreak = 1;
                }
            } else {
                user.currentStreak = 1;
                user.highestStreak = 1;
            }
            user.lastLogin = now;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                streak: user.currentStreak,
                badges: user.badges,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
