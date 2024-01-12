from pymongo import MongoClient

# Connecting to MongoDB
# client = MongoClient('mongodb://localhost:27017/')

# Creating a database 
db = client['dookan']

# Creating two collections named 'abhi_auth' and 'abhi_logs' in the database
abhi_auth = db['abhi_auth']
abhi_logs = db['abhi_logs']

# Defining the SECRET_KEY
SECRET_KEY = ''

# Defining the SHOPIFY_CRED
SHOPIFY_ACCESS_TOKEN = ''
SHOPIFY_API_VERSION = ''
SHOPIFY_API_URL = ''
SHOPIFY_ACCESS_URL = ''
