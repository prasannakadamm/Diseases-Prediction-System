import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user gamification and profile data
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/user/gamify
// @desc    Award points/badges
// @access  Private
router.post('/gamify', protect, async (req, res) => {
    try {
        const { points, badge } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            if (points) {
                user.points += points;
            }
            if (badge && !user.badges.includes(badge)) {
                user.badges.push(badge);
            }
            await user.save();
            res.json({
                points: user.points,
                badges: user.badges
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/user/wellness
// @desc    Update mental wellness score
// @access  Private
router.post('/wellness', protect, async (req, res) => {
    try {
        const { stress, sleep, mood } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Simple formula: Mood (0-10) + Sleep (0-10) + (10 - Stress (0-10))
            const rawScore = Number(mood) + Number(sleep) + (10 - Number(stress));
            const percentage = Math.round((rawScore / 30) * 100);

            user.mentalWellnessScore = percentage;
            user.points += 20; // Gamification Reward
            await user.save();

            res.json({ mentalWellnessScore: percentage, points: user.points });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile data
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;

            // Allow 0 or valid numbers, ensure empty strings are ignored
            if (req.body.age !== undefined && req.body.age !== '') {
                user.age = req.body.age;
            }
            user.gender = req.body.gender || user.gender;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                age: updatedUser.age,
                gender: updatedUser.gender,
                points: updatedUser.points,
                badges: updatedUser.badges
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Import the new Models for Settings and Notifications
import Settings from '../models/Settings.js';
import Notification from '../models/Notification.js';

// @route   GET /api/user/settings
// @desc    Get user settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user._id });
        if (!settings) {
            // Create default settings if they don't exist yet
            settings = await Settings.create({ user: req.user._id });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/user/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user._id });

        if (settings) {
            settings.notifications = req.body.notifications || settings.notifications;
            settings.privacy = req.body.privacy || settings.privacy;
            settings.ui = req.body.ui || settings.ui;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            res.status(404).json({ message: 'Settings not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/user/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
    try {
        // Find recent notifications, sorted newest first
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
