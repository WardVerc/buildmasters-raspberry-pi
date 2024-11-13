#!/bin/sh
# launcher.sh
# navigate to home directory, then to this directory, then execute python script, then back home

cd /home/pi/buildmasters-raspberry-pi
git pull
npm install
npm run dev