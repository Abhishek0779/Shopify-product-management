from flask import Flask, request, jsonify
import requests
import json
from settings import *
from validators import *
from utils import *
from flask_cors import CORS, cross_origin

app = Flask(__name__)   
CORS(app, support_credentials=True)

app.config['SECRET_KEY'] = SECRET_KEY

# Endpoint to register new user in database
@app.route('/api/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    request_data = request.get_json()
    print("request_data",request_data)
    email = request_data.get('email')
    password = request_data.get('password')

    if abhi_auth.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 400

    user_doc = {
        'email': email,
        'password': password
    }
    abhi_auth.insert_one(user_doc)
    return jsonify({'message': 'User created successfully'}), 201

# Endpoint to login in to system
@app.route('/api/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    email = request.form['email']
    password = request.form['password']
    # Validate user credentials 
    if validate_credentials(email, password):
        auth_token = encode_auth_token(email,password)
        return jsonify({'auth_token': auth_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

# Endpoint to validate auth token
@app.route('/api/is-login', methods=['GET'])
@cross_origin(supports_credentials=True)
def is_login():
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403
    else:
        return jsonify({'message': 'token verified'}), 200

# Globally defined header variable for shopify API
headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
}

# Endpoint to create a product
@app.route('/api/create_product', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_product():
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403
    request_data = request.get_json()
    title = request_data.get("title")
    price = request_data.get("price")
    sku = request_data.get("sku")
    # image = request.form['image']

    #payload for create product shopify API
    product_data = {
        "product": {
            "title": title,
            "variants": [
                {
                    "price": price,
                    "sku":sku
                }
            ],
            # "image": image,
            "status": "active"
        }
    }

    # Make a post request to the Shopify API to create Product
    response = requests.post(
        f'{SHOPIFY_ACCESS_URL}/products.json',
        headers=headers,
        data=json.dumps(product_data)
    )

    if response.status_code == 201:
        # If reqeust is success full log data in database
        email = get_user_email_using_token(request.headers.get('Authorization'))
        add_to_logs(email, "create_product", "POST", product_data )
        return jsonify({'message': 'Product created successfully'}), 201
    else:
        # If reqeust is not success Return with fail message
        return jsonify({'message': 'Failed to create product'}), 400

# Endpoint to get a product by ID
@app.route('/api/get_product/<int:product_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_product(product_id):
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403
    # Make a GET request to the Shopify API to get the product details
    response = requests.get(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers
    )
    # If the GET request was successful add logs in database
    if response.status_code == 200:
        email = get_user_email_using_token(request.headers.get('Authorization'))
        add_to_logs(email, "get_product", "GET", {"message":'get details of product ic {}'.format(product_id)} )
        # Return the product details as JSON
        return jsonify(response.json()), 200
    
    # If the GET request was not successful Return a failure message
    else:
        return jsonify({'message': 'Failed to get product'}), 400

# Endpoint to update a product by ID
@app.route('/api/update_product/<int:product_id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_product(product_id):
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403
    product_data = request.get_json()

    # Make a put request to the Shopify for update/edit product details
    response = requests.put(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers,
        data=json.dumps(product_data)
    )
    # If the put request was successful add logs in database
    if response.status_code == 200:
        email = get_user_email_using_token(request.headers.get('Authorization'))
        add_to_logs(email, "update_product", "PUT", {"message":'update details of product id {}'.format(product_id),"product_data":product_data} )
        return jsonify({'message': 'Product updated successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update product'}), 400

# Endpoint to get list of all products
@app.route('/api/list_products', methods=['GET'])
@cross_origin(supports_credentials=True)
def list_products():
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403

    # Make a get request for get list of products in from shopify
    response = requests.get(
        f'{SHOPIFY_ACCESS_URL}/products.json',
        headers=headers
    )

    if response.status_code == 200:
        #return JSON data in response
        return jsonify(response.json()), 200
    else:
        return jsonify({'message': 'Failed to get products'}), 400

# Endpoint to delete a product by ID
@app.route('/api/delete_product/<int:product_id>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def delete_product(product_id):
    # Validate user authentication
    if not validate_authentication(request):
        return jsonify({'message': 'Access denied'}), 403
    
    # Make delete request to shopify using product id
    response = requests.delete(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers
    )

    if response.status_code == 200:
        #if get success response create log in database
        email = get_user_email_using_token(request.headers.get('Authorization'))
        add_to_logs(email, "delete_product", "DELETE", {"message":'deleted product {}'.format(product_id)} )
        return jsonify({'message': 'Product deleted successfully'}), 200
    else:
        return jsonify({'message': 'Failed to delete product'}), 400

if __name__ == '__main__':
    app.run(debug=True)