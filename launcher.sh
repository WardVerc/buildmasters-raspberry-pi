#!/bin/sh
# launcher.sh

# Source NVM to load the Node.js environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Kill processes using ports 3000 and 4000
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

echo "Changing directory"
cd /home/pi/buildmasters-raspberry-pi || exit 1

echo "Activating environment"
. .venv/bin/activate

echo "Pulling from GitHub"
git pull

echo "Installing npm dependencies"
npm install

echo "Starting project with npm"
npm run dev