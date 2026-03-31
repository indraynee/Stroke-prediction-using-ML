from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from security import rate_limit
from db import db

auth_bp = Blueprint('auth', __name__)
users_collection = db['users']

@auth_bp.route('/register', methods=['POST'])
@rate_limit(max_requests=5, window_seconds=3600)  # 5 registrations per hour
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_id = users_collection.insert_one({
        "username": username,
        "password": hashed_password,
        "email": email
    }).inserted_id

    access_token = create_access_token(identity=username)
    return jsonify({
        "msg": "User created successfully",
        "access_token": access_token,
        "user_id": str(user_id),
        "username": username
    }), 201

@auth_bp.route('/login', methods=['POST'])
@rate_limit(max_requests=10, window_seconds=300)  # 10 login attempts per 5 minutes
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    # Check by username OR email
    found_user = users_collection.find_one({
        "$or": [
            {"username": username},
            {"email": username}  # Allow login with email
        ]
    })
    
    if found_user and check_password_hash(found_user['password'], password):
        identity = found_user.get('email') or found_user.get('username')
        access_token = create_access_token(identity=identity)
        print(f"User {identity} logged in successfully")
        return jsonify({
            "access_token": access_token,
            "user_id": str(found_user['_id']),
            "username": found_user.get('username') or found_user.get('email'),
            "role": found_user.get('role', 'user')  # Return user role
        }), 200

    print(f"Failed login attempt for user: {username}")
    return jsonify({"msg": "Invalid username or password"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user = get_jwt_identity()
    user = users_collection.find_one({"username": current_user}, {"password": 0})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's profile"""
    current_user = get_jwt_identity()
    user = users_collection.find_one({"username": current_user}, {"password": 0})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user's profile"""
    current_user = get_jwt_identity()
    data = request.get_json()
    
    # Fields that can be updated
    allowed_fields = ['email', 'full_name', 'age', 'phone', 'address', 'bio']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        return jsonify({"msg": "No valid fields to update"}), 400
    
    result = users_collection.update_one(
        {"username": current_user},
        {"$set": update_data}
    )
    
    if result.modified_count > 0 or result.matched_count > 0:
        user = users_collection.find_one({"username": current_user}, {"password": 0})
        user['_id'] = str(user['_id'])
        return jsonify({"msg": "Profile updated successfully", "user": user}), 200
    
    return jsonify({"msg": "User not found"}), 404

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    current_user = get_jwt_identity()
    data = request.get_json()
    
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not old_password or not new_password:
        return jsonify({"msg": "Old and new password required"}), 400
    
    user = users_collection.find_one({"username": current_user})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    if not check_password_hash(user['password'], old_password):
        return jsonify({"msg": "Incorrect old password"}), 401
    
    hashed_password = generate_password_hash(new_password)
    users_collection.update_one(
        {"username": current_user},
        {"$set": {"password": hashed_password}}
    )
    
    return jsonify({"msg": "Password changed successfully"}), 200
