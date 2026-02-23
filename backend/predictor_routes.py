from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from predictor.ml_model import predict_stroke_risk
from predictor.heart_model import predict_heart_disease_risk
from models import PredictionHistory
from analytics import get_user_analytics

predictor_bp = Blueprint('predictor', __name__)


@predictor_bp.route('/predict/', methods=['POST'])
@jwt_required()
def predict():
    """Load ML model, accept user input, return prediction, probability, SHAP values, suggestions."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    current_user = get_jwt_identity()
    result = predict_stroke_risk(data)

    if 'error' in result:
        return jsonify({"error": result['error']}), 400

    # Save every prediction to history
    saved_record = PredictionHistory.save(
        user_id=current_user,
        input_data=data,
        prediction=result['prediction'],
        probability=result['probability'],
        shap_values=result['shap_values']
    )

    # Response format: prediction, probability, shap_values, suggestions, prediction_id
    response = {
        "prediction": result['prediction'],
        "probability": result['probability'],
        "shap_values": result['shap_values'],
        "suggestions": result['suggestions'],
        "prediction_id": str(saved_record['_id'])
    }
    return jsonify(response), 200


@predictor_bp.route('/history/', methods=['GET'])
@jwt_required()
def history_list():
    """Return previous predictions for the current user."""
    current_user = get_jwt_identity()
    history = PredictionHistory.get_by_user(current_user)
    return jsonify(history), 200

@predictor_bp.route('/history/<prediction_id>', methods=['DELETE'])
@jwt_required()
def delete_prediction(prediction_id):
    """Delete a specific prediction."""
    current_user = get_jwt_identity()
    result = PredictionHistory.delete_by_id(prediction_id, current_user)
    if result:
        return jsonify({"msg": "Prediction deleted successfully"}), 200
    return jsonify({"msg": "Prediction not found or unauthorized"}), 404

@predictor_bp.route('/analytics/', methods=['GET'])
@jwt_required()
def get_analytics():
    """Get analytics and insights for the current user."""
    current_user = get_jwt_identity()
    analytics = get_user_analytics(current_user)
    return jsonify(analytics), 200

@predictor_bp.route('/predict/combined/', methods=['POST'])
@jwt_required()
def predict_combined():
    """
    Combined prediction for both stroke and heart disease risk
    Requires full data including cardiovascular parameters
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    current_user = get_jwt_identity()
    
    # Get both predictions
    stroke_result = predict_stroke_risk(data)
    heart_result = predict_heart_disease_risk(data)
    
    if 'error' in stroke_result or 'error' in heart_result:
        return jsonify({
            "error": stroke_result.get('error') or heart_result.get('error')
        }), 400
    
    # Calculate combined risk score
    combined_risk = (stroke_result['probability'] + heart_result['probability']) / 2
    
    response = {
        "stroke": {
            "prediction": stroke_result['prediction'],
            "probability": stroke_result['probability'],
            "shap_values": stroke_result['shap_values'],
            "suggestions": stroke_result['suggestions']
        },
        "heart": {
            "prediction": heart_result['prediction'],
            "probability": heart_result['probability'],
            "shap_values": heart_result['shap_values'],
            "suggestions": heart_result['suggestions']
        },
        "combined_risk": combined_risk
    }
    
    return jsonify(response), 200

@predictor_bp.route('/share/<prediction_id>', methods=['GET'])
def get_shared_prediction(prediction_id):
    """Get a prediction for sharing (public endpoint, no auth required)."""
    prediction = PredictionHistory.get_by_id(prediction_id)
    
    if not prediction:
        return jsonify({"error": "Prediction not found"}), 404
    
    # Return limited information (no personal details)
    shared_data = {
        "age": prediction.get('age'),
        "gender": prediction.get('gender'),
        "prediction": prediction.get('prediction'),
        "probability": prediction.get('probability'),
        "created_at": prediction.get('created_at'),
        "hypertension": prediction.get('hypertension'),
        "heart_disease": prediction.get('heart_disease'),
        "bmi": prediction.get('bmi'),
        "avg_glucose_level": prediction.get('avg_glucose_level'),
        "smoking_status": prediction.get('smoking_status'),
    }
    
    return jsonify(shared_data), 200
