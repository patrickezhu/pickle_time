from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/api')
def api():
    return jsonify(message='Welcome to the API!')



# GET get list of parks
#{
# "parks": [ of park names ]
#}


# GET data of specific park, park Name passed as query parameter
# {
#     "parkName": string
#     "waitTime": string (minutes)
#     "images": [ of binary encoded images]
#     "lastReported": string (hours/minutes ago) 
# }

# POST submit report for a park
#{
# "parkName": string
# "waitTime": string (minutes)
# "photo": binary encoded image
#}


if __name__ == '__main__':
    app.run(debug=True)