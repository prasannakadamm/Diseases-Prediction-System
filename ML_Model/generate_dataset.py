import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_samples=2500):
    np.random.seed(42)
    random.seed(42)
    
    diseases = [
        "Diabetes", "Heart Disease", "Liver Disease", "Malaria", 
        "Dengue", "Pneumonia", "COVID-19", "Kidney Disease", 
        "Hypertension", "Migraine", "Thyroid"
    ]
    
    symptom_profiles = {
        "Diabetes": ["polyuria", "polydipsia", "weight_loss", "fatigue", "blurry_vision"],
        "Heart Disease": ["chest_pain", "shortness_of_breath", "dizziness", "fatigue"],
        "Liver Disease": ["yellow_skin", "dark_urine", "abdominal_pain", "nausea", "loss_of_appetite"],
        "Malaria": ["high_fever", "chills", "sweating", "headache", "muscle_pain", "nausea"],
        "Dengue": ["high_fever", "severe_headache", "joint_pain", "skin_rash", "bleeding"],
        "Pneumonia": ["cough_with_phlegm", "high_fever", "shortness_of_breath", "chest_pain", "fatigue"],
        "COVID-19": ["dry_cough", "high_fever", "loss_of_taste_smell", "fatigue", "sore_throat"],
        "Kidney Disease": ["reduced_urine", "swelling_legs", "fatigue", "nausea", "shortness_of_breath"],
        "Hypertension": ["headache", "dizziness", "nosebleeds", "shortness_of_breath"],
        "Migraine": ["severe_headache", "visual_disturbances", "sensitivity_to_light", "nausea"],
        "Thyroid": ["weight_gain", "fatigue", "mood_swings", "dry_skin", "constipation"]
    }
    
    all_symptoms = list(set([sym for profile in symptom_profiles.values() for sym in profile]))
    all_symptoms.sort()

    data = []
    
    for _ in range(num_samples):
        # Pick a disease
        disease = random.choice(diseases)
        core_symptoms = symptom_profiles[disease]
        
        row = {sym: 0 for sym in all_symptoms}
        
        # Add core symptoms with high probability
        for sym in core_symptoms:
            if random.random() > 0.15:  # 85% chance to have the core symptom
                row[sym] = 1
                
        # Add some random noise symptoms with low probability
        num_noise = random.randint(0, 2)
        for _ in range(num_noise):
            noise_sym = random.choice(all_symptoms)
            row[noise_sym] = 1
            
        row['disease'] = disease
        data.append(row)
        
    df = pd.DataFrame(data)
    df.to_csv('disease_dataset.csv', index=False)
    print(f"Generated synthetic dataset with {len(df)} records and {len(all_symptoms)} features.")
    print("Dataset saved to disease_dataset.csv")

if __name__ == "__main__":
    generate_synthetic_data()
