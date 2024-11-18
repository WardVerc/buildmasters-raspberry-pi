from picamera2 import Picamera2, Preview
import os
from datetime import datetime
import time

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
    time.sleep(1)
    camera_config = picam2.create_preview_configuration()
    picam2.configure(camera_config)
    picam2.start_preview(Preview.NULL)
    picam2.start()

    # Take picture with Picamera
    filename = get_next_filename()
    picam2.capture_file(filename)
    print(f"Image saved as: {filename}")
    time.sleep(1)
    picam2.close()