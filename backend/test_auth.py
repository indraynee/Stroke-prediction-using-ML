"""
Unit tests for authentication endpoints
"""
import pytest
import json
from app import create_app
from pymongo import MongoClient
from config import Config

@pytest.fixture
def client():
    """Create test client"""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def cleanup_test_user():
    """Clean up test user after tests"""
    yield
    # Cleanup
    mongo_client = MongoClient(Config.MONGO_URI)
    db = mongo_client[Config.DB_NAME]
    db['users'].delete_many({"username": {"$regex": "^test_"}})

def test_register_success(client, cleanup_test_user):
    """Test successful user registration"""
    response = client.post('/api/register', 
        json={
            'username': 'test_user_001',
            'password': 'Test123!',
            'email': 'test@example.com'
        },
        content_type='application/json'
    )
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'access_token' in data
    assert data['username'] == 'test_user_001'

def test_register_duplicate_user(client, cleanup_test_user):
    """Test registration with duplicate username"""
    # Register first time
    client.post('/api/register', 
        json={
            'username': 'test_user_002',
            'password': 'Test123!',
            'email': 'test@example.com'
        },
        content_type='application/json'
    )
    
    # Try to register again
    response = client.post('/api/register', 
        json={
            'username': 'test_user_002',
            'password': 'Test123!',
            'email': 'test2@example.com'
        },
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'already exists' in data['msg'].lower()

def test_login_success(client, cleanup_test_user):
    """Test successful login"""
    # First register
    client.post('/api/register', 
        json={
            'username': 'test_user_003',
            'password': 'Test123!',
            'email': 'test@example.com'
        },
        content_type='application/json'
    )
    
    # Then login
    response = client.post('/api/login', 
        json={
            'username': 'test_user_003',
            'password': 'Test123!'
        },
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post('/api/login', 
        json={
            'username': 'nonexistent_user',
            'password': 'wrongpassword'
        },
        content_type='application/json'
    )
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'invalid' in data['msg'].lower()

def test_get_profile_authorized(client, cleanup_test_user):
    """Test getting profile with valid token"""
    # Register and get token
    register_response = client.post('/api/register', 
        json={
            'username': 'test_user_004',
            'password': 'Test123!',
            'email': 'test@example.com'
        },
        content_type='application/json'
    )
    token = json.loads(register_response.data)['access_token']
    
    # Get profile
    response = client.get('/api/profile',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['username'] == 'test_user_004'

def test_get_profile_unauthorized(client):
    """Test getting profile without token"""
    response = client.get('/api/profile')
    
    assert response.status_code == 401
