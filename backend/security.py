# Security utilities for the application

import time
from functools import wraps
from flask import request, jsonify
from collections import defaultdict

# Simple in-memory rate limiter (for production, use Redis)
rate_limit_store = defaultdict(list)

def rate_limit(max_requests=5, window_seconds=60):
    """
    Rate limiting decorator
    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client identifier (IP address)
            client_id = request.remote_addr
            current_time = time.time()
            
            # Clean old requests outside the window
            rate_limit_store[client_id] = [
                req_time for req_time in rate_limit_store[client_id]
                if current_time - req_time < window_seconds
            ]
            
            # Check if limit exceeded
            if len(rate_limit_store[client_id]) >= max_requests:
                return jsonify({
                    "msg": "Rate limit exceeded. Please try again later."
                }), 429
            
            # Add current request
            rate_limit_store[client_id].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
