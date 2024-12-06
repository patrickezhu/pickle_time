import base64
import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

CORS(app)

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
#     "image_base64": base64
# }
@app.route('/api/report', methods=['POST'])
def post_report():
    data = request.get_json()
    try:
        park_id = data['park_id']
        wait_time = data['wait_time']
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO reports (park_id, wait_time)
            VALUES (?, ?)
        ''', (park_id, wait_time))
        conn.commit()
        report_id = cursor.lastrowid

    return jsonify({"report_id": report_id, "status": "success"}), 201



# GET data of specific park, park id passed as query parameter
# {
#     "name": string
#     "wait_time": string
#     "images": [
#         {"image_base64": base64},
#         {"image_base64": base64}
#     ]
#     "last_reported": string (hours/minutes ago) 
# }
@app.route('/api/park/<int:park_id>', methods=['GET'])
def get_park_data(park_id):
    with get_db() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT name FROM parks WHERE id = ?", (park_id,))
        park = cursor.fetchone()
        if not park:
            return jsonify({"error": "Park not found"}), 404
        
        cursor.execute('''
            SELECT wait_time, created_at, image_data
            FROM reports
            WHERE park_id = ?
            ORDER BY created_at DESC
        ''', (park_id,))
        
        reports = cursor.fetchall()
        
        if not reports:
            return jsonify({
                "name": park["name"],
                "wait_time": "No reports available",
                "images": [],
                "last_reported": "No reports available"
            })

        # Extract latest wait time and images
        latest_report = reports[0]
        wait_time = latest_report['wait_time']
        created_at = datetime.strptime(latest_report['created_at'], "%Y-%m-%d %H:%M:%S")

        # Calculate how long ago the report was
        time_difference = datetime.now() - created_at
        last_reported = f"{time_difference.seconds // 3600} hours ago" if time_difference.seconds >= 3600 \
            else f"{time_difference.seconds // 60} minutes ago"

        # Convert images to base64
        images = [{"image_base64": base64.b64encode(report['image_data']).decode('utf-8')} for report in reports]

        return jsonify({
            "name": park["name"],
            "wait_time": f"{wait_time} minutes",
            "images": images,
            "last_reported": last_reported
        })



if __name__ == '__main__':
    init_db()
    app.run(debug=True)