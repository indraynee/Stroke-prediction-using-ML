"""
Heart disease risk prediction model
This is a placeholder structure for heart disease prediction
"""
import numpy as np

def predict_heart_disease_risk(data):
    """
    Predict heart disease risk based on cardiovascular parameters
    
    Expected input parameters:
    - cp: chest pain type (0-3)
    - trestbps: resting blood pressure
    - chol: cholesterol
    - fbs: fasting blood sugar (boolean)
    - restecg: resting ECG results (0-2)
    - thalach: maximum heart rate
    - exang: exercise induced angina (boolean)
    - oldpeak: ST depression
    - slope: slope of peak exercise ST segment (0-2)
    - ca: number of major vessels (0-3)
    - thal: thalassemia (0-2)
    """
    try:
        # Placeholder logic - in production, load actual ML model
        # For now, use a simple risk calculation based on key factors
        
        risk_score = 0.0
        
        # Age factor (assuming age is provided)
        age = float(data.get('age', 50))
        if age > 60:
            risk_score += 0.2
        elif age > 50:
            risk_score += 0.1
        
        # Cholesterol
        chol = float(data.get('chol', 200))
        if chol > 240:
            risk_score += 0.15
        elif chol > 200:
            risk_score += 0.08
        
        # Blood pressure
        trestbps = float(data.get('trestbps', 120))
        if trestbps > 140:
            risk_score += 0.15
        elif trestbps > 130:
            risk_score += 0.08
        
        # Max heart rate (lower is more concerning)
        thalach = float(data.get('thalach', 150))
        if thalach < 120:
            risk_score += 0.15
        elif thalach < 140:
            risk_score += 0.08
        
        # Exercise induced angina
        if data.get('exang', 'No') == 'Yes':
            risk_score += 0.2
        
        # Chest pain type
        cp = data.get('cp', 'Asymptomatic')
        if cp == 'Typical Angina':
            risk_score += 0.25
        elif cp == 'Atypical Angina':
            risk_score += 0.15
        
        # ST depression
        oldpeak = float(data.get('oldpeak', 0))
        if oldpeak > 2:
            risk_score += 0.15
        elif oldpeak > 1:
            risk_score += 0.08
        
        # Cap at 1.0
        probability = min(risk_score, 0.95)
        
        # Determine prediction (1 = high risk, 0 = low risk)
        prediction = 1 if probability > 0.5 else 0
        
        # Generate suggestions
        suggestions = get_heart_health_suggestions(data, probability)
        
        # Placeholder SHAP values
        shap_values = {
            'age': age * 0.01 if age > 50 else -0.02,
            'cholesterol': (chol - 200) * 0.001,
            'blood_pressure': (trestbps - 120) * 0.002,
            'max_heart_rate': (150 - thalach) * 0.002,
        }
        
        return {
            'prediction': prediction,
            'probability': probability,
            'shap_values': shap_values,
            'suggestions': suggestions
        }
        
    except Exception as e:
        return {'error': f'Prediction error: {str(e)}'}


def get_heart_health_suggestions(data, probability):
    """Generate personalized health suggestions for heart disease"""
    suggestions = []
    
    if probability > 0.5:
        chol = float(data.get('chol', 200))
        if chol > 240:
            suggestions.append("Your cholesterol is high. Consult a cardiologist and consider statins if recommended.")
        
        trestbps = float(data.get('trestbps', 120))
        if trestbps > 140:
            suggestions.append("Monitor blood pressure regularly and follow your doctor's hypertension treatment plan.")
        
        thalach = float(data.get('thalach', 150))
        if thalach < 120:
            suggestions.append("Low maximum heart rate detected. Consider cardiac stress test evaluation.")
        
        if data.get('exang', 'No') == 'Yes':
            suggestions.append("Exercise-induced angina detected. Avoid strenuous activity until cleared by a cardiologist.")
        
        suggestions.append("Schedule a comprehensive cardiac evaluation including ECG and echocardiogram.")
    else:
        suggestions.append("Your current heart health indicators are good. Maintain a healthy lifestyle.")
        suggestions.append("Continue regular exercise and a heart-healthy diet.")
        suggestions.append("Schedule annual check-ups to monitor cardiovascular health.")
    
    return suggestions
