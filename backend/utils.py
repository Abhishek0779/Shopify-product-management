import base64
import datetime
from settings import *

# Function to add log entries to the database
def add_to_logs(email, endpoint, method, data ):
    log_doc = {
        'timestamp': datetime.datetime.utcnow(),
        'user': email,
        'endpoint': endpoint,
        'method': method,
        'data': data
    }
    abhi_logs.insert_one(log_doc)

# Function to encode Authorization token
def encode_auth_token(email,password):
    auth_token = email + ':'+ password + ':' + SECRET_KEY
    return base64.b64encode(auth_token.encode()).decode()

# Function to get user email from Authorization token
def get_user_email_using_token(authtoken):
    auth_token = authtoken.split(" ")[1]
    decoded_list = base64.b64decode(auth_token).decode().split(":")
    email = decoded_list[0]
    return email