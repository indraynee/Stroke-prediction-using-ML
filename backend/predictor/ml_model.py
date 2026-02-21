
def predict_stroke_risk(data):
    """
    Mock prediction logic for stroke risk.
    In a real scenario, this would load a trained ML model (e.g., pickle file)
    and run prediction logic.
    """
    risk_score = 0
    
    # Extract features with defaults
    try:
        age = float(data.get('age', 0))
        avg_glucose_level = float(data.get('avg_glucose_level', 0))
        bmi = float(data.get('bmi', 0))
        hypertension = int(data.get('hypertension', 0))
        heart_disease = int(data.get('heart_disease', 0))
        smoking_status = data.get('smoking_status', 'never smoked').lower()
    except (ValueError, TypeError):
        return {
            'error': 'Invalid input data types'
        }

    # Basic risk calculation logic (Mock)
    
    # Age factor
    if age > 40:
        risk_score += 10
    if age > 60:
        risk_score += 20
    if age > 75:
        risk_score += 20
        
    # Glucose factor
    if avg_glucose_level > 140:
        risk_score += 15
    elif avg_glucose_level > 200:
        risk_score += 30
        
    # BMI factor
    if bmi > 25:
        risk_score += 10
    if bmi > 30:
        risk_score += 15
    if bmi > 35:
        risk_score += 20
        
    # Medical history
    if hypertension == 1:
        risk_score += 25
    if heart_disease == 1:
        risk_score += 30
        
    # Smoking
    if smoking_status in ['smokes', 'formerly smoked']:
        risk_score += 15
        
    # Normalize score roughly to 0-100%
    probability = min(risk_score, 98)
    if probability < 0: probability = 0
    
    # Determine risk level
    if probability > 70:
        risk_level = 'High'
        prediction = 1
    elif probability > 40:
        risk_level = 'Moderate'
        prediction = 0
    else:
        risk_level = 'Low'
        prediction = 0
    
    return {
        'prediction': prediction,
        'probability_percent': probability,
        'risk_level': risk_level,
        'message': f'Calculated risk based on mock logic: {risk_level} Risk ({probability}%)'
    }
