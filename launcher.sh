#!/bin/sh
# launcher.sh

# Source NVM to load the Node.js environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Changing directory"
cd /home/pi/buildmasters-raspberry-pi || exit 1

echo "Activating environment"
source .venv/bin/activate

echo "Pulling from GitHub"
git pull

echo "Installing npm dependencies"
npm install

# echo "Starting project with npm"
# npm run dev