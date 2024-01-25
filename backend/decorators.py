from flask import request, jsonify
import jwt
from functools import wraps
from settings import *
from authentication import *

def authenticate_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            try:
                email = payload['sub']
                user = abhi_users.find_one({"email":email})
                if user and user['token'] == token:
                    return func(request=request, *args, **kwargs)
                else :
                    return jsonify({'message': 'Token has expired'}), 401
            except Exception as e :
                return jsonify({'message': str(e)}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401

        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

    return wrapper
