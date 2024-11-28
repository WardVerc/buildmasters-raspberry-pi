#!/bin/sh
# shutdown.sh

# Kill processes using ports 3000 and 4000
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

sudo reboot