import base64
from settings import *

# Function to validate passoword
def validate_credentials(email, password):
    user = abhi_auth.find_one({'email': email})
    if user:
        if user['password'] == password:
            return True
    return False

# Function to validate Authorization token
def validate_authentication(request):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
            decoded_list = base64.b64decode(auth_token).decode().split(":")
            email = decoded_list[0]
            password = decoded_list[1]
            if validate_credentials(email, password):
                return True
        except:
            return False
    else:
        return False