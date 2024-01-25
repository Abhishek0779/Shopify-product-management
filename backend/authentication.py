from pymongo import MongoClient
import hashlib
import jwt
import datetime
from settings import *
from models import *
from utils import *

identity_map = IdentityMap()

# Function to generate access token 
def generate_access_token(email):
    try:
        
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=EXPIRY_TIME),
            'iat': datetime.datetime.utcnow(),
            'sub': email
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return token
    except Exception as e:
        print(f"Error generating access token: {e}")
        return None 

# Function to update access token 
def update_token(email, new_token):
    abhi_users.update_one({"email": email}, {"$set": {"token": new_token}})
    return True

# Function to validate access token 
def check_authtoken(token):
    try:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return payload['sub']
        except:
            return None
    except jwt.ExpiredSignatureError:
        return None

# Function to get user data using token
def retrieve_user_information(token):
    user_email = check_authtoken(token)
    if user_email:
        user = abhi_users.find_one({"email": user_email})
        return user
    return None

# Class for manage and validate Authentication
class Authentication:
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def generate_hash(self, password):
        sha_signature = hashlib.sha512(password.encode()).hexdigest()
        return sha_signature
        
    def authenticate(self):
        user = abhi_users.find_one({"email": self.email})
        if user and user['password'] == self.generate_hash(self.password):
            access_token = generate_access_token(user['email'])
            if update_token(user['email'], access_token):
                user = abhi_users.find_one({"email": self.email})
                identity_map.add_object('users', access_token, user)
            return access_token
        return None
