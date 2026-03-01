import pandas as pd
import numpy as np
import pickle
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def train_model():
    print("Loading dataset...")
    df = pd.read_csv('disease_dataset.csv')
    
    X = df.drop('disease', axis=1)
    y = df['disease']
    
    # Save the feature names (symptoms list)
    features = list(X.columns)
    with open('symptoms_list.json', 'w') as f:
        json.dump(features, f)
        
    print(f"Features mapped: {len(features)} symptoms.")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Save the model
    with open('disease_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("\nModel saved successfully as disease_model.pkl")

if __name__ == "__main__":
    train_model()
