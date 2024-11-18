from flask import Flask, jsonify, request
import subprocess
from flask_cors import CORS
from os import listdir
import platform

app = Flask(__name__)

# Fix CORS error, only allow requests from the raspberry
CORS(app, resources={r"/*": {
    "origins": ["http://192.168.0.241:3000"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# Also CORS error fix
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        headers = response.headers

        # Set CORS headers for preflight requests
        headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
        headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        headers["Access-Control-Allow-Credentials"] = "true"
        return response, 204

@app.route('/take-picture', methods=['GET'])
def take_picture():
    try:
        subprocess.run(['python3', 'take-picture.py'], check=True)
        return jsonify({'status': 'success', 'message': 'Took picture successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/pictures', methods=['GET'])
def get_pictures():
    return jsonify({'status': 'success', 'message': 'Got pictures successfully', 'results': listdir('pictures')}), 200

@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        system = platform.system()

        # Get IP address
        if system == "Linux":
            IP = subprocess.check_output("ip -4 addr show wlan0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'", shell=True).decode("utf-8").strip()
        elif system == "Darwin":  # macOS
            IP = subprocess.check_output("ipconfig getifaddr en0", shell=True).decode("utf-8").strip()
        else:
            IP = "Unknown"

        # Get CPU usage (load average)
        if system == "Linux":
            CPU = subprocess.check_output(["awk", "{printf \"%.2f\", $(NF-2)}", "/proc/loadavg"]).decode("utf-8").strip()
        elif system == "Darwin":
            CPU = subprocess.check_output("ps -A -o %cpu | awk '{s+=$1} END {print s}'", shell=True).decode("utf-8").strip()

        # Get memory usage
        if system == "Linux":
            MemUsage = subprocess.check_output(["free", "-m"]).decode("utf-8").splitlines()[1]
            MemValues = MemUsage.split()
            MemUsage = f"{MemValues[2]}/{MemValues[1]}MB {float(MemValues[2])/float(MemValues[1])*100:.2f}%"
        elif system == "Darwin":
            MemUsage = subprocess.check_output("vm_stat | awk 'NR==1{total=$3} NR==3{used=$3} END {print used/(total+used)*100}'", shell=True).decode("utf-8").strip()

        # Get disk usage
        Disk = subprocess.check_output("df -h / | tail -1", shell=True).decode("utf-8").split()
        Disk = f"{Disk[2]}/{Disk[1]} ({Disk[4]})"

        # Get temperature (only on Raspberry Pi)
        if system == "Linux":
            try:
                Temp = subprocess.check_output(["vcgencmd", "measure_temp"]).decode("utf-8").strip().split("=")[1]
            except FileNotFoundError:
                Temp = "N/A"
        else:
            Temp = "N/A"


        return jsonify({'status': 'success', 'message': 'Got stats successfully', 'results': {
            "ip": IP,
            "cpu": CPU,
            "memUsage": MemUsage,
            "diskSpace": Disk,
            "temp": Temp
        }}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)