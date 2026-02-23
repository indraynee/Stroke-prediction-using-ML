"""
Script to create an admin user in the database
Run this once to create your first admin account
"""
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from config import Config
import datetime

def create_admin_user():
    """Create an admin user with specified credentials"""
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    users_collection = db['users']
    
    # Admin credentials
    admin_email = input("Enter admin email: ")
    admin_password = input("Enter admin password: ")
    admin_name = input("Enter admin name (optional): ") or "Administrator"
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": admin_email})
    if existing_user:
        print(f"\n⚠️  User with email {admin_email} already exists.")
        update = input("Update this user to admin role? (y/n): ")
        if update.lower() == 'y':
            users_collection.update_one(
                {"email": admin_email},
                {"$set": {"role": "admin"}}
            )
            print(f"✅ User {admin_email} updated to admin role!")
        return
    
    # Create admin user
    admin_user = {
        "email": admin_email,
        "username": admin_email.split('@')[0],  # Extract username from email
        "password": generate_password_hash(admin_password),
        "name": admin_name,
        "role": "admin",
        "is_active": True,
        "created_at": datetime.datetime.utcnow()
    }
    
    users_collection.insert_one(admin_user)
    print(f"\n✅ Admin user created successfully!")
    print(f"Email: {admin_email}")
    print(f"Role: admin")
    print("\n🔐 You can now log in to the admin panel with these credentials.")

if __name__ == "__main__":
    print("=" * 50)
    print("Admin User Creator")
    print("=" * 50)
    print()
    
    try:
        create_admin_user()
    except Exception as e:
        print(f"\n❌ Error creating admin user: {str(e)}")
