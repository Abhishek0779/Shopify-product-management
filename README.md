# Shopify-product-management

Shopify-product-management is a simple web application for manage shopify products with multiple users.
its develped using below technologies 

Backend :- Flask
Frontend :- ReactJs
Database :- MongoDB
UI library :- Chakra UI

# INTRODUCTION

Shopify-product-management integrates essential functionalities like login, signup, and the execution of CURD operations within the Shopify shop.

The dashboard data table boasts advanced capabilities, allowing users to seamlessly sort data in ascending or descending order. Furthermore, it incorporates a real-time single search bar for efficiently searching values across multiple fields.

Users also have the flexibility to choose between dark and light themes for an enhanced user experience.

# INSTALLATION
### BACKEND configuration

recommended python version :- PYTHON 3.12.0 
create a virtual environment using venv :

```bash
python -m venv myenv 
```

Activate virtual environment :

```bash
# for linux terminal
source <venv>/bin/activate
# for windows cmd
<venv>\Scripts\activate.bat
```

install requirements for the backend using the below command
```bash
pip install -r requirements. txt
```

In the backend directory, establish a 'settings.py' file and populate it by referencing the data outlined in 'local_settings_file.md.' Set variable values according to their respective names.

```bash
from pymongo import MongoClient

# Connecting to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Creating a database 
db = client[DB_NAME]

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

```
for run the Flask app use the below command 
```bash
flask run
```

### FRONTEND configuration

recommended NODE version:- Node 19.4.0

In the Frontend directory, use the below command to download the required packages
```bash
npm i
```
In the Frontend directory, create a .env file. Add the following variables and adjust them according to the port of your respective backend.

```bash
REACT_APP_API_ENDPOINT="http://localhost:5000/"
REACT_APP_LOGIN_REDIRECT_URL="http://localhost:5000/Login"
```
To run react app use the below command
```bash
npm start
```

# Note
### Limitation 
- here I am using basic authentication. For live app recommended to use (JWT, OAuth, sessionAuth) with encryption of password
- To enhance the product creation/edit feature, consider implementing image upload functionality using the Shopify CDN.


# SCREENSHOTS
![Screenshot from 2024-01-12 21-27-51](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/7e29be9a-0bbc-4798-8dec-58bbee75620c)
![Screenshot from 2024-01-12 21-27-46](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/8a6ca0cb-a9fa-4073-b3f4-557b78d6d412)
![Screenshot from 2024-01-12 21-27-29](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/bf208a2a-c8b8-4dd1-8002-49ca61046353)
![Screenshot from 2024-01-12 21-26-53](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/d6c36964-6523-4113-9f4b-ee4ff8521d35)
![Screenshot from 2024-01-12 21-26-48](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/badc642c-6e8f-495c-8ed0-fd16e906a94f)
![Screenshot from 2024-01-12 21-26-39](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/2861d454-c74c-4948-8d8a-f809da030423)

