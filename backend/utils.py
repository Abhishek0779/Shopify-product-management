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

def generate_auto_id():
    # For simplicity, here, I'm using a basic incremental ID
    last_user = abhi_users.find_one(sort=[("id", -1)])
    last_id = last_user["id"] if last_user else 0
    return last_id + 1

#Used identiy map design pattern to store data in memory for avoid multiple query to db
class IdentityMap:
    def __init__(self):
        self.objects = {}

    def get_object(self, collection, object_id):
        key = f"{collection}_{object_id}"
        val = self.objects.get(key)
        if not val:
            print("Object fetching from db")
            val = abhi_users.find_one({"token": object_id})
            return val
            # if val:
            #     self.add_object(collection, object_id, val)  # Update the cache with the fetched object
        else:
            # Check for expiry before returning the object
            if self.is_object_expired(key) == False:
                print("Object not expired yet,fetching from memory")
                return val["object"]
            else :
                print("Object expired, fetching from db",self.objects)

                val = abhi_users.find_one({"token": object_id}) 
                return val   
        

    def add_object(self, collection, object_id, obj, expiration_time=None):
        key = f"{collection}_{object_id}"
        # Set default expiration time into EXPIRY_TIME in setting.py
        expiration_time = expiration_time or datetime.datetime.now() + datetime.timedelta(minutes=EXPIRY_TIME)
        self.objects[key] = {"object": obj, "expiration_time": expiration_time}

    def is_object_expired(self, key):
        current_time = datetime.datetime.now()
        if key in self.objects:
            expiration_time = self.objects[key].get("expiration_time")
            print("self.objects",self.objects)
            if expiration_time < current_time :
                del self.objects[key]
            return expiration_time < current_time
        return False

