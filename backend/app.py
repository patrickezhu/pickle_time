import base64
from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('database.db')
    return conn


# one park maps to many reports. Can SELECT all reports where park_id = the id of the park we want, then can filter the records to return the correct response in GET park details
def init_db():
    with get_db() as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS parks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
        ''')

        conn.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            report_id INTEGER PRIMARY KEY AUTOINCREMENT,
            park_id INTEGER,
            wait_time INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            image_data BLOB,
            FOREIGN KEY (park_id) REFERENCES parks (id)
        )
        ''')

        cursor = conn.cursor()
        cursor.execute('SELECT * FROM parks')
        parks = cursor.fetchall()
        if(len(parks) == 0):
            conn.execute('INSERT INTO parks (name) VALUES (?)', ('Leslie Park',))
            conn.execute('INSERT INTO parks (name) VALUES (?)', ('Burns Park',))

@app.route('/', methods=['GET'])
def home():
    return 'Pickle Time'

@app.route('/api', methods=['GET'])
def api():
    return jsonify(message='Welcome to the Pickle Time API')


# GET get list of parks
#{
# "parks": [ 
#           {
#               "id": integer
#               "name": string
#           },
#           {
#               "id": integer
#               "name": string
#           }
#          ]
#}

@app.route('/api/parks', methods=['GET'])
def parks():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM parks')
        parks = cursor.fetchall()

    result = []
    for park in parks:
        result.append(
            {
                "id": park[0],
                "name": park[1]
            })
    return jsonify({"parks": result})

# POST submit report for a park, id given to represent the park
# {
#     "park_id": integer
#     "wait_time": string
#     "image": base64
# }
@app.route('/api/report', methods=['POST'])
def post_report():
    data = request.get_json()
    park_id, wait_time, image_base64 = data['park_id'], data['wait_time'], data['image']

    image_data = base64.b64decode(image_base64)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reports (park_id, wait_time, image_data)
            VALUES (?, ?, ?)
        ''', (park_id, wait_time, image_data))
        conn.commit()
        report_id = cursor.lastrowid
        conn.close()
    
    return jsonify({"report_id": report_id, "status": "success"}), 201


# GET data of specific park, park id passed as query parameter
# {
#     "parkName": string
#     "waitTime": string (minutes)
#     "images": [encoded images]
#     "lastReported": string (hours/minutes ago) 
# }


if __name__ == '__main__':
    init_db()
    app.run(debug=True)