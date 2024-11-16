from flask import Flask, jsonify
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/take-picture', methods=['GET'])
def take_picture():
    try:
        subprocess.run(['python3', 'take-picture.py'], check=True)
        return jsonify({'status': 'success', 'message': 'Took picture successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)