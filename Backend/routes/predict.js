import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Prediction from '../models/Prediction.js';
import axios from 'axios';

const router = express.Router();

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://127.0.0.1:8000/predict';

// @route   POST /api/predict
// @desc    Send symptoms to ML server and save prediction
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        // Call Python ML Microservice
        const mlResponse = await axios.post(ML_SERVER_URL, {
            symptoms
        });

        const mlData = mlResponse.data;

        // Save to Database
        const prediction = new Prediction({
            user: req.user._id,
            symptoms,
            predictedDisease: mlData.disease,
            probability: mlData.probability_percentage,
            riskLevel: mlData.risk_level
        });

        const createdPrediction = await prediction.save();

        res.status(201).json({
            _id: createdPrediction._id,
            ...mlData
        });
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ message: 'Error processing prediction with ML Service' });
    }
});

// @route   GET /api/predict/history
// @desc    Get user's prediction history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const history = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
