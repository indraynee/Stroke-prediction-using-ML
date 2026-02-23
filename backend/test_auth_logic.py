from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI')
DB_NAME = os.environ.get('DB_NAME', 'strokenova_db')

print(f"Connecting to {MONGO_URI}...")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db['users']

test_user = "testuser_antigravity"
test_pass = "password123"
test_email = "test@example.com"

# Clean up
users_collection.delete_one({"username": test_user})

# Test Register logic
hashed = generate_password_hash(test_pass)
users_collection.insert_one({
    "username": test_user,
    "password": hashed,
    "email": test_email
})
print("User inserted.")

# Test Login logic
user = users_collection.find_one({"username": test_user})
if user:
    print(f"User found: {user['username']}")
    if check_password_hash(user['password'], test_pass):
        print("Login SUCCESS")
    else:
        print("Login FAILED: Password mismatch")
else:
    print("Login FAILED: User not found")

# Clean up
users_collection.delete_one({"username": test_user})
