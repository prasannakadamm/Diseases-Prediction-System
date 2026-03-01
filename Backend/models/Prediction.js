import mongoose from 'mongoose';

const predictionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        symptoms: [
            {
                type: String,
                required: true,
            },
        ],
        predictedDisease: {
            type: String,
            required: true,
        },
        probability: {
            type: Number,
            required: true,
        },
        riskLevel: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
