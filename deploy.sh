#!/bin/bash

# Deployment script for PulseSync on Azure App Service
echo "Starting PulseSync deployment..."

# Set Node.js version
echo "Setting Node.js version to 18..."
export NODE_VERSION=18

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Build the application
echo "Building application..."
npm run build

# Set environment variables for production
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "Deployment completed successfully!"
echo "Application will start on port $PORT"
