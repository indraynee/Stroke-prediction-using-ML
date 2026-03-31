"""
Centralized MongoDB connection.
All modules should import `db` from here instead of creating their own MongoClient.
"""
from pymongo import MongoClient
import certifi
from config import Config

# Single shared client — uses certifi CA bundle for Atlas TLS
client = MongoClient(Config.MONGO_URI, tlsCAFile=certifi.where())
db = client[Config.DB_NAME]
