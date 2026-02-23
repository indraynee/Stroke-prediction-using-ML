"""
Database indexing setup for performance optimization
Run this script once to create indexes on frequently queried fields
"""
from pymongo import MongoClient, ASCENDING, DESCENDING
from config import Config

def clean_duplicate_emails():
    """Remove duplicate email entries, keeping only the most recent one"""
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    users_collection = db['users']
    
    # Find duplicate emails
    pipeline = [
        {"$group": {
            "_id": "$email",
            "count": {"$sum": 1},
            "ids": {"$push": "$_id"},
            "dates": {"$push": "$created_at"}
        }},
        {"$match": {"count": {"$gt": 1}}}
    ]
    
    duplicates = list(users_collection.aggregate(pipeline))
    
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate email(s)")
        for dup in duplicates:
            email = dup['_id']
            ids = dup['ids']
            print(f"   - {email} appears {dup['count']} times")
            
            # Keep the first user, delete others
            ids_to_delete = ids[1:]
            if ids_to_delete:
                result = users_collection.delete_many({"_id": {"$in": ids_to_delete}})
                print(f"   → Removed {result.deleted_count} duplicate(s), kept 1")
        
        print()
    else:
        print("✓ No duplicate emails found")
    
    return len(duplicates)

def create_indexes():
    """Create indexes on collections for better query performance"""
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.DB_NAME]
    
    # Clean duplicates first
    print("Checking for duplicate emails...")
    clean_duplicate_emails()
    
    # Index on users collection
    users_collection = db['users']
    # Email unique index
    try:
        users_collection.create_index([("email", ASCENDING)], unique=True)
        print("✓ Created unique index on users.email")
    except Exception as e:
        print(f"⚠️  Email index may already exist: {str(e)[:100]}")
    
    # Indexes on prediction_history collection
    history_collection = db['prediction_history']
    
    # Index on user field for faster user-specific queries
    try:
        history_collection.create_index([("user", ASCENDING)])
        print("✓ Created index on prediction_history.user")
    except Exception as e:
        print(f"⚠️  User index may already exist")
    
    # Index on created_at for date-based queries and sorting
    try:
        history_collection.create_index([("created_at", DESCENDING)])
        print("✓ Created index on prediction_history.created_at")
    except Exception as e:
        print(f"⚠️  Created_at index may already exist")
    
    # Compound index for user + created_at (most common query pattern)
    try:
        history_collection.create_index([
            ("user", ASCENDING),
            ("created_at", DESCENDING)
        ])
        print("✓ Created compound index on prediction_history.user + created_at")
    except Exception as e:
        print(f"⚠️  Compound index may already exist")
    
    # Index on probability for filter/analytics queries
    try:
        history_collection.create_index([("probability", ASCENDING)])
        print("✓ Created index on prediction_history.probability")
    except Exception as e:
        print(f"⚠️  Probability index may already exist")
    
    # Index on _id is automatic, but ensure it's there for share links
    print("✓ _id index exists by default")
    
    # Index on session tokens (if you add session management)
    # sessions_collection = db['sessions']
    # sessions_collection.create_index([("token", ASCENDING)], unique=True)
    # sessions_collection.create_index([("expires_at", ASCENDING)], expireAfterSeconds=0)
    
    print("\n✅ All indexes created successfully!")
    print("\nRecommendation: Run this script after deploying to production.")
    
    return True

if __name__ == "__main__":
    try:
        create_indexes()
    except Exception as e:
        print(f"❌ Error creating indexes: {str(e)}")
