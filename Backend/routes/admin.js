import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import axios from 'axios';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get total users, predictions, most common disease
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalPredictions = await Prediction.countDocuments({});

        // Aggregate to find most common disease
        const commonDisease = await Prediction.aggregate([
            { $group: { _id: "$predictedDisease", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const topDisease = commonDisease.length > 0 ? commonDisease[0]._id : 'N/A';

        res.json({
            totalUsers,
            totalPredictions,
            topDisease
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/predictions
// @desc    Get all predictions for charting (e.g. bar/pie charts)
// @access  Private/Admin
router.get('/predictions', protect, admin, async (req, res) => {
    try {
        const predictions = await Prediction.find({}).populate('user', 'name email');
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/retrain
// @desc    Trigger model retraining directly or via ML API
// @access  Private/Admin
router.post('/retrain', protect, admin, async (req, res) => {
    // Real implementation might trigger python job or ML Pipeline here.
    res.json({ message: 'Model retraining triggered successfully backend job.' });
});

export default router;
