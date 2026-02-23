from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from predictor.ml_model import predict_stroke_risk
from models import PredictionHistory

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
    PredictionHistory.save(
        user_id=current_user,
        input_data=data,
        prediction=result['prediction'],
        probability=result['probability'],
        shap_values=result['shap_values']
    )

    # Response format: prediction, probability, shap_values, suggestions
    response = {
        "prediction": result['prediction'],
        "probability": result['probability'],
        "shap_values": result['shap_values'],
        "suggestions": result['suggestions']
    }
    return jsonify(response), 200


@predictor_bp.route('/history/', methods=['GET'])
@jwt_required()
def history_list():
    """Return previous predictions for the current user."""
    current_user = get_jwt_identity()
    history = PredictionHistory.get_by_user(current_user)
    return jsonify(history), 200
