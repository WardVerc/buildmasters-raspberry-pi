#!/bin/sh
# launcher.sh
# navigate to home directory, then to this directory, then execute python script, then back home
echo cding now
cd /home/pi/buildmasters-raspberry-pi
echo pulling from github now
git pull
echo npm installing now
npm install
echo npm run dev now
npm run dev
