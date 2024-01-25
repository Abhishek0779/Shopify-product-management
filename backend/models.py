import hashlib
from settings import *
import re

class UserModel:
    def __init__(self, user_id, name, email, password, ):
        self.id = user_id 
        self.name = name
        self.email = email
        self.password = password

    @staticmethod
    def generate_hash(password):
        sha_signature = hashlib.sha512(password.encode()).hexdigest()
        return sha_signature

    

    def get_user_data(self):
        user_data = {
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "id": self.id
        }
        return user_data

    def validate_email(self, email):
        # Using a simple regular expression for email validation
        email_regex = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            raise ValueError("Invalid email format.")

    def create_user(self):
        hashed_password = self.generate_hash(self.password)
        # Validate email format
        self.validate_email(self.email)
        # Validate email for duplicates
        existing_user = abhi_users.find_one({"email": self.email})
        if existing_user:
            raise ValueError("User with the same email already exists.")
        
        # If no duplicate, insert the user data
        user = UserModel(name=self.name, email=self.email, password=hashed_password, user_id=self.id)
        user_data = user.get_user_data()
        
        try:
            abhi_users.insert_one(user_data)
            print("User created successfully.")
        except DuplicateKeyError:
            print("Error: Duplicate key detected. User with the same id or email already exists.")
