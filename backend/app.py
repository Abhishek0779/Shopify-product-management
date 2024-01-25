from flask import Flask, request, jsonify ,render_template ,send_from_directory
import requests
import json
from settings import *
from validators import *
from utils import *
from flask_cors import CORS, cross_origin
from models import *
from authentication import *
from decorators import *
import datetime
from PIL import Image
import base64
import os

app = Flask(__name__)
CORS(app,support_credentials=True)

app.config['SECRET_KEY'] = SECRET_KEY

@app.route("/")
def index():
    root_dir = os.path.abspath(os.path.dirname(__file__))
    parent_dir = os.path.abspath(os.path.join(root_dir, os.pardir))

    build_folder = os.path.join(parent_dir, 'frontend', 'build')
    index_file = os.path.join(build_folder, 'index.html')

    # Check if the index.html file exists
    if os.path.exists(index_file):
        return send_from_directory(build_folder, 'index.html')
    else:
        # Handle 404 error if the file is not found
        return "index.html not found", 404

# Route to serve static files (CSS, JavaScript, etc.) using Flask's built-in static route
@app.route('/static/<path:intityname>/<path:filename>')
def serve_static(intityname,filename):
    root_dir = os.path.abspath(os.path.dirname(__file__))
    parent_dir = os.path.abspath(os.path.join(root_dir, os.pardir))

    static_folder = os.path.join(parent_dir, 'frontend', 'build', 'static',intityname)
    # Use Flask's send_from_directory to serve static files
    return send_from_directory(static_folder, filename)

# Route to serve other React files using Flask's built-in static route
@app.route('/<path:filename>')
def serve_react_app(filename):
    root_dir = os.path.abspath(os.path.dirname(__file__))
    parent_dir = os.path.abspath(os.path.join(root_dir, os.pardir))

    build_folder = os.path.join(parent_dir, 'frontend', 'build')
    # Use Flask's send_from_directory to serve other React files
    return send_from_directory(build_folder, filename)


# Endpoint to register new user in database
@app.route('/api/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    request_data = request.get_json()
    email = request_data.get('email')
    password = request_data.get('password')
    name = request_data.get('name')
    user_id = generate_auto_id()
    try :
        user = UserModel(user_id=user_id,name=name, email=email, password=password)
        user.create_user()
    except Exception as e :
        return jsonify({'message':str(e)}), 400
    return jsonify({'message': 'User created successfully'}), 201


# Endpoint to login in to system
@app.route('/api/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    email = request.form['email']
    password = request.form['password']
    
    # Validate user credentials 
    if email and password:
        # auth_token = encode_auth_token(email,password)
        auth = Authentication(email=email, password=password)
        token = auth.authenticate()
        if token :
            return jsonify({'auth_token': token}), 200
        else :
            return jsonify({'message': 'Invalid credentials'}), 401
    return jsonify({'message': 'Invalid credentials'}), 401

# Endpoint to validate auth token
# @app.route('/api/is-login', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def is_login():
#     # Validate user authentication
#     if not validate_authentication(request):
#         return jsonify({'message': 'Access denied'}), 403
#     else:
#         return jsonify({'message': 'token verified'}), 200

# Globally defined header variable for shopify API
headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
}

# Endpoint to create a product
@app.route('/api/create_product', methods=['POST'])
@cross_origin(supports_credentials=True)
@authenticate_token
def create_product(request=None):
    # get user from identity class(memory)
    user = identity_map.get_object('users', request.headers.get('Authorization'))
    # get data from frontend and assign it as varible
    image = request.files['image']
    title= request.form['title']
    price= request.form['price']
    sku= request.form['sku']
    image_name= request.form['image_name']
    image_ext= request.form['image_ext']
    image_data = image.read()

    # validate image is currupt or not
    try:
        img = Image.open(image)
        img.filename = f"{title}.{image_ext}"
        img.verify()
    except Exception as e:
        return f'Error: {e}. The uploaded image is corrupt.'

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
        product_id = response.json().get("product").get("id")
        # Upload the image to the product
        upload_image_url = f'{SHOPIFY_ACCESS_URL}/products/{product_id}/images.json'
        payload = json.dumps({
            "image": {
                "position": 1,
                "metafields": [
                {
                    "key": "new",
                    "value": "newvalue",
                    "type": "single_line_text_field",
                    "namespace": "global"
                }
                ],
                "attachment": base64.b64encode(image_data).decode('utf-8'),
                "filename": f'{image_name}',
                "width": 500,
                "height": 500,
            }
        })
        image_response = requests.post(upload_image_url,headers=headers, data=payload)
        #If reqeust is success then add logs in database
        if image_response.status_code == 200:
            add_to_logs(user.get("email"), "create_product", "POST", {"message":'create product id :- {}, title :- {}'.format(product_id,title)} )
            return jsonify({"success": True, "message": "Product and image created successfully"}),201
        else:
            return jsonify({"success": False, "message": "Failed to upload image", "error": image_response.text}),400

    else:
        # If reqeust is not success Return with fail message
        return jsonify({'message': 'Failed to create product'}), 400

# Endpoint to get a product by ID
@app.route('/api/get_product/<int:product_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
@authenticate_token
def get_product(product_id,request=None):
    # get user from identity class(memory)
    user = identity_map.get_object('users', request.headers.get('Authorization'))
    
    # Make a GET request to the Shopify API to get the product details
    response = requests.get(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers
    )
    # If the GET request was successful add logs in database
    if response.status_code == 200:
        response_data = response.json()["product"]
        product = {
            "id":response_data.get("id"),
            "title": response_data.get("title"),
            "price":float(response_data.get("variants")[0].get("price")) if response_data.get("variants") else "",
            "sku": response_data.get("variants")[0].get("sku") if response_data.get("variants") else "",
            "image":response_data.get("image").get("src") if response_data.get("image") else "",
            "body_html": response_data.get("body_html"),
        }
        response = {
            "product":product
        }
        # add request logs in database 
        add_to_logs(user.get("email"), "get_product", "GET", {"message":'get details of product id {}'.format(product_id)} )
        # Return the product details as JSON
        return jsonify(response), 200
    
    # If the GET request was not successful Return a failure message
    else:
        return jsonify({'message': 'Failed to get product'}), 400

# Endpoint to update a product by ID
@app.route('/api/update_product/<int:product_id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
@authenticate_token
def update_product(product_id,request=None):
    # get user from identity class(memory)
    user = identity_map.get_object('users', request.headers.get('Authorization'))

    product_data = request.get_json()

    # Make a put request to the Shopify for update/edit product details
    response = requests.put(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers,
        data=json.dumps(product_data)
    )
    # If the put request was successful add logs in database
    if response.status_code == 200:
        add_to_logs(user.get("email"), "update_product", "PUT", {"message":'update details of product id {}'.format(product_id),"product_data":product_data} )
        
        return jsonify({'message': 'Product updated successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update product'}), 400

# Endpoint to get list of all products
@app.route('/api/list_products', methods=['GET'])
@cross_origin(supports_credentials=True)
@authenticate_token
def list_products(request=None):
    # Make a get request for get list of products in from shopify
    response = requests.get(
        f'{SHOPIFY_ACCESS_URL}/products.json',
        headers=headers
    )
    
    if response.status_code == 200:
        products = []
        product_list = response.json().get("products")
        #filter only required data
        for i in product_list:
            data = {
                "id":i.get("id"),
                "title":i.get("title"),
                "price":float(i.get("variants")[0].get("price")) if i.get("variants") else "",
                "sku": i.get("variants")[0].get("sku") if i.get("variants") else "",
                "image":i.get("image").get("src") if i.get("image") else "",
            }
            products.append(data)
        response_data = {
            "products": products
        }
        #return JSON data in response
        return jsonify(response_data), 200
    else:
        return jsonify({'message': 'Failed to get products'}), 400


# Endpoint to delete a product by ID
@app.route('/api/delete_product/<int:product_id>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
@authenticate_token
def delete_product(product_id,request=None):
    # get user from identity class(memory)
    user = identity_map.get_object('users', request.headers.get('Authorization'))

    # Make delete request to shopify using product id
    response = requests.delete(
        f'{SHOPIFY_ACCESS_URL}/products/{product_id}.json',
        headers=headers
    )

    if response.status_code == 200:
        #if get success response create log in database
        add_to_logs(user.get("email"), "delete_product", "DELETE", {"message":'deleted product {}'.format(product_id)} )
        return jsonify({'message': 'Product deleted successfully'}), 200
    else:
        return jsonify({'message': 'Failed to delete product'}), 400


# Endpoint to get users activity-log
@app.route('/api/get-activity-log', methods=['GET'])
@cross_origin(supports_credentials=True)
@authenticate_token
def get_activity_log(request=None):
    # Make request to get user activity log 
    activity_log = []
    # get user from identity class(memory)
    user = identity_map.get_object('users', request.headers.get('Authorization'))
    email = user.get("email")
    response_data = {
                "logs": activity_log
            }
    
    if not email:
        return jsonify({'message': 'no data found'}), 400
    #get sorted data from database
    sort_query = [('timestamp', -1)]
    logs = abhi_logs.find({"user": email}).sort(sort_query)

    if logs:
        # logic for find activiy log of active user 
        for i in logs:
            dt_obj = datetime.datetime.fromisoformat(str(i.get("timestamp"))[:-1])
            formatted_dt = dt_obj.strftime("%d-%m-%Y %I:%M:%S %p")

            data = {
                "id":str(i.get("_id")),
                "timestamp":formatted_dt,
                "action":i.get("endpoint").replace("_"," ") if "_" in i.get("endpoint") else i.get("endpoint"),
                "description":i.get("data").get("message"),
            }
            activity_log.append(data)
        response_data = {
            "logs": activity_log
        }
        return jsonify(response_data), 200
    else :
        return jsonify({'message': 'no data found'}), 400
    
        

if __name__ == '__main__':
    # app.run(debug=True,use_reloader=True, port=5000, threaded=True)
    app.run(debug=True)