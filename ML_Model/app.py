from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import pickle
import json
import numpy as np

app = FastAPI(title="Disease Prediction ML API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and symptoms list
try:
    with open('disease_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully.")
    
    with open('symptoms_list.json', 'r') as f:
        symptoms_list = json.load(f)
    print(f"Symptoms expected: {len(symptoms_list)}")
except Exception as e:
    print(f"Error loading model artifacts: {e}")
    model = None
    symptoms_list = []

# Define standard risk levels for diseases based on historical medical severity
DISEASE_RISK_LEVELS = {
    "Diabetes": "Medium",
    "Heart Disease": "High",
    "Liver Disease": "High",
    "Malaria": "Medium",
    "Dengue": "Medium",
    "Pneumonia": "High",
    "COVID-19": "Medium",
    "Kidney Disease": "High",
    "Hypertension": "Medium",
    "Migraine": "Low",
    "Thyroid": "Medium"
}

DISEASE_PRECAUTIONS = {
    "Diabetes": ["Maintain a healthy diet", "Exercise regularly", "Monitor blood sugar levels"],
    "Heart Disease": ["Avoid smoking", "Eat a heart-healthy diet", "Manage stress", "Regular check-ups"],
    "Liver Disease": ["Avoid alcohol", "Drink plenty of water", "Eat a balanced diet"],
    "Malaria": ["Use mosquito nets", "Take antimalarial medication", "Avoid mosquito bites"],
    "Dengue": ["Prevent mosquito bites", "Stay hydrated", "Seek medical attention if severe"],
    "Pneumonia": ["Get vaccinated", "Practice good hygiene", "Don't smoke"],
    "COVID-19": ["Wear a mask", "Wash hands frequently", "Practice social distancing"],
    "Kidney Disease": ["Control blood pressure", "Manage diabetes", "Eat a healthy diet"],
    "Hypertension": ["Reduce sodium intake", "Exercise regularly", "Manage stress"],
    "Migraine": ["Identify and avoid triggers", "Manage stress", "Get enough sleep"],
    "Thyroid": ["Eat a balanced diet", "Get regular check-ups", "Take prescribed medication"]
}

DISEASE_SPECIALISTS = {
    "Diabetes": "Endocrinologist",
    "Heart Disease": "Cardiologist",
    "Liver Disease": "Hepatologist",
    "Malaria": "Infectious Disease Specialist",
    "Dengue": "Infectious Disease Specialist",
    "Pneumonia": "Pulmonologist",
    "COVID-19": "Pulmonologist / Infectious Disease Specialist",
    "Kidney Disease": "Nephrologist",
    "Hypertension": "Cardiologist / General Physician",
    "Migraine": "Neurologist",
    "Thyroid": "Endocrinologist"
}

class PredictionRequest(BaseModel):
    symptoms: List[str]

@app.get("/")
def home():
    return {"message": "AI Disease Prediction Server is running."}

@app.get("/symptoms")
def get_symptoms():
    return {"symptoms": symptoms_list}

@app.post("/predict")
def predict(data: PredictionRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
        
    user_symptoms = data.symptoms
    
    # Initialize the input vector with zeros
    input_vector = np.zeros(len(symptoms_list))
    
    # Map user symptoms to the input vector
    for symptom in user_symptoms:
        if symptom in symptoms_list:
            index = symptoms_list.index(symptom)
            input_vector[index] = 1
            
    # Reshape for single prediction
    input_vector = input_vector.reshape(1, -1)
    
    # Get prediction and probabilities
    prediction = model.predict(input_vector)[0]
    probabilities = model.predict_proba(input_vector)[0]
    
    # Get highest probability
    max_prob = max(probabilities) * 100
    
    # Assign Risk Level based on both the disease itself and the probability
    risk_level = DISEASE_RISK_LEVELS.get(prediction, "Unknown")
    
    # If the probability is very high, risk could be elevated
    if max_prob > 85.0 and risk_level == "Medium":
        pass # In a real scenario, this could increase the perceived urgency
    
    response = {
        "disease": prediction,
        "probability_percentage": round(max_prob, 2),
        "risk_level": risk_level,
        "precautions": DISEASE_PRECAUTIONS.get(prediction, ["Consult a doctor"]),
        "recommended_specialist": DISEASE_SPECIALISTS.get(prediction, "General Physician")
    }
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
