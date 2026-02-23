import os
import joblib
import pandas as pd
import numpy as np
import shap

# Resolve paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'stroke_pipeline.pkl')

# Global model variable
_model = None

def load_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return _model

def get_suggestions(data, prediction, probability):
    suggestions = []
    if probability > 50:
        if data.get('smoking_status', '').lower() in ['smokes', 'formerly smoked']:
            suggestions.append("Consider smoking cessation programs.")
        if float(data.get('avg_glucose_level', 0)) > 150:
            suggestions.append("Monitor blood sugar levels and consult a nutritionist.")
        if int(data.get('hypertension', 0)) == 1:
            suggestions.append("Regularly check blood pressure and follow prescribed treatments.")
        if float(data.get('bmi', 0)) > 30:
            suggestions.append("Adopt a balanced diet and regular exercise routine.")
    else:
        suggestions.append("Maintain a healthy lifestyle to keep risk low.")
    return suggestions

def predict_stroke_risk(data):
    """
    Load pipeline, run prediction, and calculate SHAP values.
    """
    try:
        pipeline = load_model()
        
        # Prepare input DataFrame (matching training columns)
        input_data = {
            'gender': data.get('gender', 'Male'),
            'age': float(data.get('age', 0)),
            'hypertension': int(data.get('hypertension', 0)),
            'heart_disease': int(data.get('heart_disease', 0)),
            'ever_married': data.get('ever_married', 'No'),
            'work_type': data.get('work_type', 'Private'),
            'Residence_type': data.get('Residence_type', 'Urban'),
            'avg_glucose_level': float(data.get('avg_glucose_level', 0)),
            'bmi': float(data.get('bmi', 0)),
            'smoking_status': data.get('smoking_status', 'never smoked')
        }
        df = pd.DataFrame([input_data])
        
        # Prediction
        prob = pipeline.predict_proba(df)[0][1]
        prediction = 1 if prob > 0.5 else 0
        
        # SHAP calculation
        # The pipeline has a 'classifier' step at the end. 
        preprocessed_df = pipeline[:-1].transform(df)
        model = pipeline.named_steps['classifier']
        
        # Determine explainer type based on model
        # For simplicity and speed in a web app, we'll try KernalExplainer or TreeExplainer
        # Often these models are XGBoost/RandomForest
        try:
            explainer = shap.Explainer(model)
            shap_values_raw = explainer.shap_values(preprocessed_df)
            
            # If it's a binary classification list, take class 1
            if isinstance(shap_values_raw, list):
                shap_val = shap_values_raw[1].tolist() if len(shap_values_raw) > 1 else shap_values_raw[0].tolist()
            else:
                shap_val = shap_values_raw.tolist()
            
            # Map back to feature names if possible
            if hasattr(preprocessed_df, 'columns'):
                feature_names = preprocessed_df.columns.tolist()
            elif hasattr(pipeline.named_steps['preprocessor'], 'get_feature_names_out'):
                feature_names = pipeline.named_steps['preprocessor'].get_feature_names_out().tolist()
            else:
                feature_names = [f"Feature {i}" for i in range(preprocessed_df.shape[1])]
            
            shap_output = dict(zip(feature_names, shap_val[0]))
        except Exception as e:
            shap_output = {"error": f"SHAP calculation failed: {str(e)}"}

        suggestions = get_suggestions(data, prediction, prob * 100)

        return {
            'prediction': prediction,
            'probability': prob, # prob is 0-1
            'shap_values': shap_output,
            'suggestions': suggestions
        }
        
    except Exception as e:
        return {'error': str(e)}
