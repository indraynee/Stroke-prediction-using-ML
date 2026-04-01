"""
Centralized MongoDB connection.
All modules should import `db` from here instead of creating their own MongoClient.
"""
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from config import Config

# Connect to Atlas — tlsAllowInvalidCertificates fixes Render's SSL incompatibility
client = MongoClient(
    Config.MONGO_URI,
    server_api=ServerApi('1'),
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True,
)
db = client[Config.DB_NAME]

# Test connection on startup
try:
    client.admin.command('ping')
    print("✅ MongoDB Atlas connected successfully")
except Exception as e:
    print(f"⚠️  MongoDB connection warning: {e}")
