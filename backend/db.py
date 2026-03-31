"""
Centralized MongoDB connection.
All modules should import `db` from here instead of creating their own MongoClient.
"""
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from config import Config

# Use Server API v1 and certifi CA bundle for Atlas compatibility
client = MongoClient(
    Config.MONGO_URI,
    server_api=ServerApi('1'),
    tls=True,
    tlsCAFile=certifi.where(),
)
db = client[Config.DB_NAME]

# Test connection on startup
try:
    client.admin.command('ping')
    print("✅ MongoDB Atlas connected successfully")
except Exception as e:
    print(f"⚠️  MongoDB connection warning: {e}")
