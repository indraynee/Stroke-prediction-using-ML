"""
PredictionHistory model for storing stroke risk predictions.
"""
import datetime
from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]
_collection = db['prediction_history']


class PredictionHistory:
    """Model for prediction history records."""

    @staticmethod
    def save(user_id: str, input_data: dict, prediction: int, probability: float, shap_values: dict):
        """Save a prediction to history."""
        record = {
            "user": user_id,
            "gender": input_data.get('gender', 'Male'),
            "age": float(input_data.get('age', 0)),
            "hypertension": int(input_data.get('hypertension', 0)),
            "heart_disease": int(input_data.get('heart_disease', 0)),
            "ever_married": input_data.get('ever_married', 'No'),
            "work_type": input_data.get('work_type', 'Private'),
            "Residence_type": input_data.get('Residence_type', 'Urban'),
            "avg_glucose_level": float(input_data.get('avg_glucose_level', 0)),
            "bmi": float(input_data.get('bmi', 0)),
            "smoking_status": input_data.get('smoking_status', 'never smoked'),
            "prediction": prediction,
            "probability": probability,
            "shap_values": shap_values,
            "created_at": datetime.datetime.utcnow()
        }
        _collection.insert_one(record)
        return record

    @staticmethod
    def get_by_user(user_id: str, limit: int = 100):
        """Get prediction history for a user, most recent first."""
        cursor = _collection.find({"user": user_id}).sort("created_at", -1).limit(limit)
        items = []
        for item in cursor:
            item['_id'] = str(item['_id'])
            if isinstance(item.get('created_at'), datetime.datetime):
                item['created_at'] = item['created_at'].isoformat()
            items.append(item)
        return items

