from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from config import Config

auth_bp = Blueprint('auth', __name__)
client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]
users_collection = db['users']

@auth_bp.route('/register', methods=['POST'])
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
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    found_user = users_collection.find_one({"username": username})
    if found_user and check_password_hash(found_user['password'], password):
        access_token = create_access_token(identity=username)
        print(f"User {username} logged in successfully")
        return jsonify({
            "access_token": access_token,
            "user_id": str(found_user['_id']),
            "username": found_user['username']
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
