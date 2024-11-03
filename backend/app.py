from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('database.db')
    return conn

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

@app.route('/', methods=['GET'])
def home():
    return 'Pickle Time'

@app.route('/api', methods=['GET'])
def api():
    return jsonify(message='Welcome to the Pickle Time API')

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


# GET get list of parks
#{
# "parks": [ of park names ]
#}


# GET data of specific park, park Name passed as query parameter
# {
#     "parkName": string
#     "waitTime": string (minutes)
#     "images": [encoded images]
#     "lastReported": string (hours/minutes ago) 
# }

# POST submit report for a park
#{
# "parkName": string
# "waitTime": string (minutes)
# "photo": binary encoded image
#}


if __name__ == '__main__':
    init_db()
    app.run(debug=True)