#!/bin/bash

# Stop on any error
set -e

echo "Cleaning up project..."

# Remove platform-specific Expo directories (ios and android)
echo "Removing iOS and Android directories..."
rm -rf ios
rm -rf android

# Remove node_modules and package-lock.json (or yarn.lock)
echo "Removing node_modules and package-lock.json (or yarn.lock)..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -rf .expo

# Reinstall dependencies
echo "Installing dependencies..."
npm install  # or yarn install if using yarn

# Rebuild the Expo project (if needed for ios/android)
echo "Rebuilding project..."
npx expo prebuild  # Rebuild ios and android folders for EAS Build if necessary
# npx expo prebuild --clean

# Optional: Run the project (if you'd like to automatically start it after rebuilding)
echo "Starting Expo project..."
echo "If not working try to deinstall app from simulator and run npm run ios"
npx expo --reset-cache

echo "Project rebuild complete!"
