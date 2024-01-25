# Shopify-product-management PHASE 2

Shopify-product-management is a simple web application for manage shopify products with multiple users.
its develped using below technologies 

Backend :- Flask
Frontend :- ReactJs
Database :- MongoDB


# INTRODUCTION PHASE 2

Shopify-product-management integrates essential functionalities like login, signup, and the execution of CURD operations within the Shopify shop.

The dashboard data table boasts advanced capabilities, allowing users to seamlessly sort data in ascending or descending order. Furthermore, it incorporates a real-time single search bar for efficiently searching values across multiple fields.
Users have the ability to:

Review their activity logs
Create products, including image uploads
Our application used [Purity UI Dashboard from Creative Tim: Purity UI Dashboard(https://www.creative-tim.com/product/purity-ui-dashboard)


Furthermore, our system adopts the Identity Map pattern to efficiently retrieve user information, minimizing the need for multiple queries on the backend. Authentication is handled through JWT tokens, stored as cookies for enhanced security. Passwords are securely hashed for added protection.

# INSTALLATION of PHASE 2

### GIT clone

```bash
git clone https://github.com/Abhishek0779/Shopify-product-management.git

# then switch to phase 2 branch
git swith phase_2

```

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
abhi_users = db['abhi_users']

# Defining the SECRET_KEY
SECRET_KEY = ''

# Defining the SHOPIFY_CRED
SHOPIFY_ACCESS_TOKEN = ''
SHOPIFY_API_VERSION = ''
SHOPIFY_API_URL = ''
SHOPIFY_ACCESS_URL = ''

# define exipry time
EXPIRY_TIME = 30


### FRONTEND configuration

recommended NODE version:- Node 19.4.0

In the Frontend directory, use the below command to download the required packages
```bash
npm i
```
In the Frontend directory, create a .env file. Add the following variables and adjust them according to the port of your respective backend.

```bash
REACT_APP_API_ENDPOINT="http://localhost:5000/"
REACT_APP_LOGIN_REDIRECT_URL="http://localhost:5000/"
```
We utilize Flask as the backend to serve our React application. To create the build, use the following command:

```bash
npm run build
```

now you can run app 
```
for run the application use the below command 
```bash
flask run
```

THANKS

# SCREENSHOTS

### LOGIN PAGE
![Screenshot from 2024-01-25 15-27-43](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/4e02a26c-4d09-4893-af3a-580a2eee43b2)
### SIGNUP PAGE
![Screenshot from 2024-01-25 15-29-59](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/62947e72-34e5-4609-9d68-e4c7c751d032)
### DASHBOARD PAGE
![Screenshot from 2024-01-25 15-28-35](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/f0117bd1-d48f-45fc-a432-f7e35a791fbc)
### VIEW PRODUCT
![Screenshot from 2024-01-25 15-29-19](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/645def8f-aa18-49c9-b767-4c0a062cb7bc)
### EDIT PRODUCT
![Screenshot from 2024-01-25 15-29-31](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/376e792e-ddee-401b-b841-ece961276319)
### CREATE PRODUCT
![Screenshot from 2024-01-25 15-29-47](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/b2ae58a1-4f5b-41dd-9d7d-4e745f5f64b4)
### ACTIVITY LOG
![Screenshot from 2024-01-25 15-28-54](https://github.com/Abhishek0779/Shopify-product-management/assets/79359745/6d50895c-92ba-4112-a8cf-d2bd07d63a64)

