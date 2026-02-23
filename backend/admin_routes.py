"""
Admin panel routes for user management and system statistics
Requires admin role for access
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient, DESCENDING
from datetime import datetime, timedelta
from config import Config
from functools import wraps

admin_bp = Blueprint('admin', __name__)

# MongoDB connection
client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]
users_collection = db['users']
predictions_collection = db['prediction_history']

def admin_required(fn):
    """Decorator to check if user has admin role"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        user = users_collection.find_one({"email": current_user})
        
        if not user or user.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_system_stats():
    """Get overall system statistics"""
    try:
        # Total users
        total_users = users_collection.count_documents({})
        
        # Total predictions
        total_predictions = predictions_collection.count_documents({})
        
        # Active users (users who made predictions in last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_user_ids = predictions_collection.distinct(
            'user',
            {'created_at': {'$gte': thirty_days_ago}}
        )
        active_users = len(active_user_ids)
        
        # Predictions in last 30 days
        recent_predictions = predictions_collection.count_documents({
            'created_at': {'$gte': thirty_days_ago}
        })
        
        # Average predictions per user
        avg_predictions_per_user = total_predictions / total_users if total_users > 0 else 0
        
        # High risk predictions percentage
        high_risk_count = predictions_collection.count_documents({'probability': {'$gte': 0.6}})
        high_risk_percentage = (high_risk_count / total_predictions * 100) if total_predictions > 0 else 0
        
        # Recent activity (last 7 days)
        activity_data = []
        for i in range(7):
            day = datetime.utcnow() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            count = predictions_collection.count_documents({
                'created_at': {'$gte': day_start, '$lte': day_end}
            })
            
            activity_data.append({
                'date': day_start.strftime('%Y-%m-%d'),
                'predictions': count
            })
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'total_predictions': total_predictions,
            'recent_predictions': recent_predictions,
            'avg_predictions_per_user': round(avg_predictions_per_user, 2),
            'high_risk_percentage': round(high_risk_percentage, 2),
            'activity_data': list(reversed(activity_data))  # Oldest to newest
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get list of all users with pagination"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        if search:
            query = {'email': {'$regex': search, '$options': 'i'}}
        
        # Get users with pagination
        users = list(users_collection.find(query)
                    .skip((page - 1) * per_page)
                    .limit(per_page)
                    .sort('created_at', DESCENDING))
        
        # Get prediction counts for each user
        user_data = []
        for user in users:
            email = user['email']
            prediction_count = predictions_collection.count_documents({'user': email})
            last_prediction = predictions_collection.find_one(
                {'user': email},
                sort=[('created_at', DESCENDING)]
            )
            
            user_data.append({
                'email': email,
                'name': user.get('name', ''),
                'role': user.get('role', 'user'),
                'created_at': user.get('created_at', datetime.utcnow()).isoformat(),
                'prediction_count': prediction_count,
                'last_prediction': last_prediction['created_at'].isoformat() if last_prediction else None,
                'is_active': user.get('is_active', True)
            })
        
        total_users = users_collection.count_documents(query)
        
        return jsonify({
            'users': user_data,
            'page': page,
            'per_page': per_page,
            'total': total_users,
            'pages': (total_users + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/users/<email>', methods=['PUT'])
@admin_required
def update_user(email):
    """Update user role or active status"""
    try:
        data = request.get_json()
        
        update_fields = {}
        if 'role' in data:
            if data['role'] not in ['user', 'admin']:
                return jsonify({"error": "Invalid role"}), 400
            update_fields['role'] = data['role']
        
        if 'is_active' in data:
            update_fields['is_active'] = bool(data['is_active'])
        
        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
        
        result = users_collection.update_one(
            {'email': email},
            {'$set': update_fields}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": "User updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/users/<email>', methods=['DELETE'])
@admin_required
def delete_user(email):
    """Delete a user and all their predictions"""
    try:
        # Prevent self-deletion
        current_user = get_jwt_identity()
        if current_user == email:
            return jsonify({"error": "Cannot delete your own account"}), 400
        
        # Delete user's predictions
        predictions_collection.delete_many({'user': email})
        
        # Delete user
        result = users_collection.delete_one({'email': email})
        
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": "User and their data deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/predictions/recent', methods=['GET'])
@admin_required
def get_recent_predictions():
    """Get recent predictions across all users"""
    try:
        limit = int(request.args.get('limit', 50))
        
        predictions = list(predictions_collection.find()
                          .sort('created_at', DESCENDING)
                          .limit(limit))
        
        prediction_data = []
        for pred in predictions:
            prediction_data.append({
                'id': str(pred['_id']),
                'user': pred['user'],
                'age': pred.get('age'),
                'gender': pred.get('gender'),
                'probability': pred['probability'],
                'prediction': pred['prediction'],
                'created_at': pred['created_at'].isoformat()
            })
        
        return jsonify({'predictions': prediction_data}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
