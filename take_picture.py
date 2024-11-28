import logging
from picamera2 import Picamera2, Preview
import os
from datetime import datetime
import time

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='camera_logs.log',  # Log file name
    filemode='a'  # Append mode; use 'w' to overwrite the file each time
)

# Create a logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Create handlers
console_handler = logging.StreamHandler()  # Console output
file_handler = logging.FileHandler('camera_logs.log')  # File output

# Create formatter and add it to handlers
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)


def get_next_filename():
    # Get today's date in "YYYY-MM-DD" format
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Find the next available counter for today's date
    counter = 0
    while True:
        filename = f"pictures/{date_str}-{counter}.jpg"
        if not os.path.exists(filename):
            return filename
        counter += 1

def take_picture_now():
    # Picamera setup
    
    picam2 = Picamera2()
    try:
        logging.info("Setting up the camera.")
        time.sleep(1)
        camera_config = picam2.create_preview_configuration()
        picam2.configure(camera_config)
        picam2.start_preview(Preview.NULL)
        picam2.start()

        # Take picture with Picamera
        filename = get_next_filename()
        logging.info(f"Capturing image and saving to {filename}.")
        picam2.capture_file(filename)
        logging.info(f"Image saved as: {filename}.")
        time.sleep(1)
    except Exception as e:
        logging.error(f"An error occurred: {e}", exc_info=True)
    finally:
        logging.info("Closing the camera.")
        picam2.close()
