#!/bin/bash

# Get the local IP address (for informational purposes only)
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

echo "Starting Expo Go in LAN host mode"
echo "Your local IP address is: $LOCAL_IP"
echo "Make sure your iOS device is on the same network as this computer"

# Start Expo Go directly (bypassing dev client)
EXPO_NO_DEV_CLIENT=1 npx expo start --host lan --scheme datingapp20
