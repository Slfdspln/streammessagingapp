#!/bin/bash

# Get the local IP address (for informational purposes only)
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

echo "Starting Metro bundler with Expo Go in LAN host mode"
echo "Your local IP address is: $LOCAL_IP"
echo "Make sure your iOS device is on the same network as this computer"

# Force Expo Go mode by setting EXPO_USE_DEV_SERVER=false
EXPO_USE_DEV_SERVER=false npx expo start --host lan --scheme datingapp20
