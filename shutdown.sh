#!/bin/sh
# shutdown.sh

# Stop React and Python processes gracefully
echo "Stopping processes on ports 3000 and 4000..."

# Use `pkill` to stop Vite React and Python processes by name
pkill -f "vite"    # Vite React app
pkill -f "python"  # Python backend

# Give processes some time to terminate
sleep 5

# Confirm the ports are freed
if lsof -ti:3000 || lsof -ti:4000; then
    echo "Forcing processes to terminate..."
    lsof -ti:3000 | xargs kill -9
    lsof -ti:4000 | xargs kill -9
else
    echo "Ports 3000 and 4000 are free."
fi

# Reboot the Raspberry Pi
echo "Rebooting the system..."
sudo reboot