"""
Heart disease risk prediction model.
Loads the actual trained model from the project root.
"""
import os
import joblib
import pandas as pd
import numpy as np
import shap

# Resolve paths — models are in the project root (2 levels up from backend/predictor/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
MODEL_PATH = os.path.join(PROJECT_ROOT, 'heart_model')
FEATURE_LIST_PATH = os.path.join(PROJECT_ROOT, 'heart_feature_list')

# Global model variable
_model = None
_feature_names = None

def load_model():
    global _model, _feature_names
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError(f"Heart model file not found at {MODEL_PATH}")
    if _feature_names is None and os.path.exists(FEATURE_LIST_PATH):
        _feature_names = joblib.load(FEATURE_LIST_PATH)
        # Remove target column if present
        _feature_names = [f for f in _feature_names if f != 'target']
    return _model, _feature_names


def predict_heart_disease_risk(data):
    """
    Predict heart disease risk using the trained model.
    
    Expected input parameters:
    - age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
    """
    try:
        model, feature_names = load_model()
        
        # Map categorical inputs to numerical values
        sex_map = {'Male': 1, 'Female': 0}
        cp_map = {'Typical Angina': 0, 'Atypical Angina': 1, 'Non-anginal': 2, 'Asymptomatic': 3}
        fbs_map = {'True (>120 mg/dl)': 1, 'False': 0}
        restecg_map = {'Normal': 0, 'ST-T Wave Abnormality': 1, 'Left Ventricular Hypertrophy': 2}
        exang_map = {'Yes': 1, 'No': 0}
        slope_map = {'Upsloping': 0, 'Flat': 1, 'Downsloping': 2}
        thal_map = {'Normal': 1, 'Fixed Defect': 2, 'Reversible Defect': 3}
        
        # Build input dict
        input_data = {
            'age': float(data.get('age', 50)),
            'sex': sex_map.get(data.get('gender', 'Male'), 1),
            'cp': cp_map.get(data.get('cp', 'Asymptomatic'), 3),
            'trestbps': float(data.get('trestbps', 120)),
            'chol': float(data.get('chol', 200)),
            'fbs': fbs_map.get(data.get('fbs', 'False'), 0),
            'restecg': restecg_map.get(data.get('restecg', 'Normal'), 0),
            'thalach': float(data.get('thalach', 150)),
            'exang': exang_map.get(data.get('exang', 'No'), 0),
            'oldpeak': float(data.get('oldpeak', 0)),
            'slope': slope_map.get(data.get('slope', 'Flat'), 1),
            'ca': int(data.get('ca', 0)),
            'thal': thal_map.get(data.get('thal', 'Normal'), 1),
        }
        
        # If we have feature names from training, use that order
        if feature_names:
            df = pd.DataFrame([{f: input_data.get(f, 0) for f in feature_names}])
        else:
            df = pd.DataFrame([input_data])
        
        # Prediction
        if hasattr(model, 'predict_proba'):
            prob = model.predict_proba(df)[0][1]
        else:
            # Fallback for models without predict_proba
            pred = model.predict(df)[0]
            prob = float(pred)
        
        prediction = 1 if prob > 0.5 else 0
        
        # SHAP values
        try:
            explainer = shap.Explainer(model)
            shap_values_raw = explainer.shap_values(df)
            
            if isinstance(shap_values_raw, list):
                shap_val = shap_values_raw[1][0].tolist() if len(shap_values_raw) > 1 else shap_values_raw[0][0].tolist()
            elif shap_values_raw.ndim > 1:
                shap_val = shap_values_raw[0].tolist()
            else:
                shap_val = shap_values_raw.tolist()
            
            cols = df.columns.tolist()
            shap_output = dict(zip(cols, shap_val))
        except Exception as e:
            shap_output = {"note": f"SHAP visualization unavailable: {str(e)}"}
        
        # Generate suggestions
        suggestions = get_heart_health_suggestions(data, prob)
        
        return {
            'prediction': prediction,
            'probability': float(prob),
            'shap_values': shap_output,
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
