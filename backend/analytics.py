"""
Analytics utilities for generating user insights and statistics
"""
from models import PredictionHistory
from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]
_collection = db['prediction_history']


def get_user_analytics(user_id: str):
    """
    Get comprehensive analytics for a user
    """
    predictions = list(_collection.find({"user": user_id}).sort("created_at", 1))
    
    if not predictions:
        return {
            "total_predictions": 0,
            "average_risk": 0,
            "risk_trend": "N/A",
            "highest_risk": None,
            "lowest_risk": None,
            "predictions_by_month": [],
            "risk_over_time": [],
            "risk_factors": {}
        }
    
    # Basic stats
    total = len(predictions)
    risks = [p['probability'] for p in predictions]
    avg_risk = sum(risks) / len(risks)
    
    # Trend calculation (comparing first half vs second half)
    if len(risks) >= 2:
        mid = len(risks) // 2
        first_half_avg = sum(risks[:mid]) / len(risks[:mid])
        second_half_avg = sum(risks[mid:]) / len(risks[mid:])
        
        if second_half_avg < first_half_avg - 0.05:
            trend = "Decreasing"
        elif second_half_avg > first_half_avg + 0.05:
            trend = "Increasing"
        else:
            trend = "Stable"
    else:
        trend = "N/A"
    
    # Highest and lowest risk
    highest = max(predictions, key=lambda x: x['probability'])
    lowest = min(predictions, key=lambda x: x['probability'])
    
    # Risk over time (for charts)
    risk_over_time = [{
        "date": p['created_at'].isoformat() if hasattr(p['created_at'], 'isoformat') else p['created_at'],
        "risk": p['probability'] * 100
    } for p in predictions]
    
    # Risk factors analysis (average values)
    risk_factors = {
        "avg_age": sum(p['age'] for p in predictions) / total,
        "avg_bmi": sum(p['bmi'] for p in predictions) / total,
        "avg_glucose": sum(p['avg_glucose_level'] for p in predictions) / total,
        "hypertension_rate": sum(1 for p in predictions if p['hypertension']) / total * 100,
        "heart_disease_rate": sum(1 for p in predictions if p['heart_disease']) / total * 100,
        "smoking_rate": sum(1 for p in predictions if p['smoking_status'] in ['smokes', 'formerly smoked']) / total * 100
    }
    
    return {
        "total_predictions": total,
        "average_risk": round(avg_risk * 100, 1),
        "risk_trend": trend,
        "highest_risk": {
            "date": highest['created_at'].isoformat() if hasattr(highest['created_at'], 'isoformat') else highest['created_at'],
            "probability": round(highest['probability'] * 100, 1)
        },
        "lowest_risk": {
            "date": lowest['created_at'].isoformat() if hasattr(lowest['created_at'], 'isoformat') else lowest['created_at'],
            "probability": round(lowest['probability'] * 100, 1)
        },
        "risk_over_time": risk_over_time,
        "risk_factors": risk_factors
    }
