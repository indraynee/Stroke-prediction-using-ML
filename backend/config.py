import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'strokenova-secret-key-2024')

    # MongoDB Atlas connection string — prefer env var on Render, fallback to hardcoded
    MONGO_URI = os.environ.get(
        'MONGO_URI',
        'mongodb+srv://indrayaneesawant_db_user:ESfRX4t1mZLDAcCW@cluster0.5jzkid2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    DB_NAME = os.environ.get('DB_NAME', 'strokenova_db')

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'strokenova-jwt-secret-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
