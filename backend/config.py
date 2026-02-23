import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    DB_NAME = os.environ.get('DB_NAME', 'strokenova_db')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
