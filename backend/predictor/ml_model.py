import os
import joblib
import pandas as pd
import numpy as np
import shap

# Resolve paths — models are in the project root (2 levels up from backend/predictor/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
MODEL_PATH = os.path.join(PROJECT_ROOT, 'stroke_model')

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
    Load model, run prediction, and calculate SHAP values.
    """
    try:
        model = load_model()
        
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
        
        # Check if it's a pipeline (has transform steps) or a plain model
        if hasattr(model, 'predict_proba') and hasattr(model, 'named_steps'):
            # It's a scikit-learn Pipeline
            prob = model.predict_proba(df)[0][1]
            prediction = 1 if prob > 0.5 else 0
            
            # SHAP calculation
            try:
                preprocessed_df = model[:-1].transform(df)
                classifier = model.named_steps.get('classifier') or list(model.named_steps.values())[-1]
                
                explainer = shap.Explainer(classifier)
                shap_values_raw = explainer.shap_values(preprocessed_df)
                
                if isinstance(shap_values_raw, list):
                    shap_val = shap_values_raw[1].tolist() if len(shap_values_raw) > 1 else shap_values_raw[0].tolist()
                else:
                    shap_val = shap_values_raw.tolist()
                
                if hasattr(preprocessed_df, 'columns'):
                    feature_names = preprocessed_df.columns.tolist()
                elif hasattr(model[0], 'get_feature_names_out'):
                    feature_names = model[0].get_feature_names_out().tolist()
                else:
                    feature_names = [f"Feature {i}" for i in range(preprocessed_df.shape[1])]
                
                flat_shap = shap_val[0] if isinstance(shap_val[0], list) else shap_val
                shap_output = dict(zip(feature_names, flat_shap))
            except Exception as e:
                shap_output = {"note": f"SHAP visualization unavailable: {str(e)}"}
        
        elif hasattr(model, 'predict_proba'):
            # Plain model (not a pipeline) — needs manual feature encoding
            # Try to load feature list for one-hot encoding
            feature_list_path = os.path.join(PROJECT_ROOT, 'stroke_feature_list')
            if os.path.exists(feature_list_path):
                feature_names = joblib.load(feature_list_path)
                # Remove target column if present
                feature_names = [f for f in feature_names if f != 'stroke']
            else:
                feature_names = None
            
            # One-hot encode categorical features manually
            encoded = {}
            encoded['age'] = float(data.get('age', 0))
            encoded['hypertension'] = int(data.get('hypertension', 0))
            encoded['heart_disease'] = int(data.get('heart_disease', 0))
            encoded['avg_glucose_level'] = float(data.get('avg_glucose_level', 0))
            encoded['bmi'] = float(data.get('bmi', 0))
            
            # Binary encodings (matching feature list)
            encoded['gender_Male'] = 1 if data.get('gender', 'Male') == 'Male' else 0
            encoded['ever_married_Yes'] = 1 if data.get('ever_married', 'No') == 'Yes' else 0
            
            # Work type one-hot
            work = data.get('work_type', 'Private')
            encoded['work_type_Never_worked'] = 1 if work == 'Never Worked' else 0
            encoded['work_type_Private'] = 1 if work == 'Private' else 0
            encoded['work_type_Self-employed'] = 1 if work == 'Self-employed' else 0
            encoded['work_type_children'] = 1 if work == 'Children' else 0
            
            # Residence type
            encoded['Residence_type_Urban'] = 1 if data.get('Residence_type', 'Urban') == 'Urban' else 0
            
            # Smoking status one-hot
            smoking = data.get('smoking_status', 'never smoked')
            encoded['smoking_status_formerly smoked'] = 1 if smoking == 'formerly smoked' else 0
            encoded['smoking_status_never smoked'] = 1 if smoking == 'never smoked' else 0
            encoded['smoking_status_smokes'] = 1 if smoking == 'smokes' else 0
            
            if feature_names:
                # Ensure correct column order
                model_df = pd.DataFrame([{f: encoded.get(f, 0) for f in feature_names}])
            else:
                model_df = pd.DataFrame([encoded])
            
            prob = model.predict_proba(model_df)[0][1]
            prediction = 1 if prob > 0.5 else 0
            
            # SHAP values
            try:
                explainer = shap.Explainer(model)
                shap_values_raw = explainer.shap_values(model_df)
                
                if isinstance(shap_values_raw, list):
                    shap_val = shap_values_raw[1][0].tolist() if len(shap_values_raw) > 1 else shap_values_raw[0][0].tolist()
                elif shap_values_raw.ndim > 1:
                    shap_val = shap_values_raw[0].tolist()
                else:
                    shap_val = shap_values_raw.tolist()
                
                cols = model_df.columns.tolist()
                shap_output = dict(zip(cols, shap_val))
            except Exception as e:
                shap_output = {"note": f"SHAP visualization unavailable: {str(e)}"}
        else:
            return {'error': 'Model does not support predict_proba'}

        suggestions = get_suggestions(data, prediction, prob * 100)

        return {
            'prediction': prediction,
            'probability': float(prob),
            'shap_values': shap_output,
            'suggestions': suggestions
        }
        
    except Exception as e:
        return {'error': str(e)}
