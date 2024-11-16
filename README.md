# Buildmasters Raspberry Pi Camera!
Hello, I got the idea to make a camera project with my raspberry pi, so here it is!  
  
Here are some notes:

## Install the Raspberry Pi OS lite on a SD card with the following settings:  
- Set a hostname  
- Configure wireless LAN and enter your wifi details  
- Under services enable SSH (see remote access documentation on the raspberry pi official website)

## Plug in your Raspberry and  
`sudo apt update`  
`sudo apt full-upgrade -y`

And install node.js for linux  
https://nodejs.org/en/download/package-manager

### Reboot  
`sudo reboot`

Check if and where node and npm are installed (should be under a .nvm directory which where we are pointing to in the launcher.sh file)  
`which node`  
`which npm`

Make sure the launcher.sh file can be edited  
`sudo chown pi:pi /home/pi/buildmasters-raspberry-pi/launcher.sh`  
`sudo chmod +w /home/pi/buildmasters-raspberry-pi/launcher.sh`  
`sudo chmod +x /home/pi/buildmasters-raspberry-pi/launcher.sh`

Also create a log file and give it the correct rights:  
`sudo touch /home/pi/logs.log`  
`sudo chown pi:pi /home/pi/logs.log`  
`sudo chmod 644 /home/pi/logs.log`

## To run a script on boot, do the following:  
`sudo nano /etc/rc.local`

and edit it to this:
```
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

sleep 10

sudo -u pi bash -c 'source /home/pi/.profile && sh /home/pi/buildmasters-raspberry-pi/launcher.sh > /home/pi/logs.log 2>&1' &

exit 0
```

This script will wait a bit so the wifi connection is established, execute our launcher script as the pi user, and log some messages to the log file.

## Running a Python script in a React project
- You need a server.py, run a python backend (ex. Flask) on it  
  - To install Flask on your Raspberry Pi,  
  `python3 -m venv .venv` create a python environment  
  `. .venv/bin/activate` activate the environment  
  `pip3 install flask` install Flask  
  `pip3 install flask-cors` to resolve the CORS error  
- Run the backend simultaneously with the frontend  
  - `npm install concurrently --save-dev`  
  - Update the package.json with:  
  ```
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
  "dev:frontend": "vite",
  "dev:backend": "python3 server.py",
  ```  
- Create an endpoint in your backend which will execute your python script
- Call your endpoint from the frontend