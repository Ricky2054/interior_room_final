#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI not found. Please install it manually from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Deploy to Vercel
echo "Deploying frontend to Vercel..."
vercel --prod

# Deploy backend to Heroku
echo "Deploying backend to Heroku..."

# Check if the Heroku apps exist
if ! heroku apps:info interior-api &> /dev/null; then
    echo "Creating Heroku app for server_interior.py..."
    heroku create interior-api
fi

if ! heroku apps:info text2image-api &> /dev/null; then
    echo "Creating Heroku app for text2image.py..."
    heroku create text2image-api
fi

# Set environment variables
echo "Setting environment variables..."
read -p "Enter your Stability API key: " stability_api_key
read -p "Enter your frontend URL (e.g., https://your-app.vercel.app): " frontend_url

heroku config:set STABILITY_API_KEY=$stability_api_key --app interior-api
heroku config:set FRONTEND_URL=$frontend_url --app interior-api

heroku config:set STABILITY_API_KEY=$stability_api_key --app text2image-api
heroku config:set FRONTEND_URL=$frontend_url --app text2image-api

# Deploy to Heroku
echo "Deploying server_interior.py to Heroku..."
git push https://git.heroku.com/interior-api.git main

echo "Deploying text2image.py to Heroku..."
git push https://git.heroku.com/text2image-api.git main

echo "Deployment completed successfully!"
echo "Frontend: $frontend_url"
echo "Server Interior API: https://interior-api.herokuapp.com"
echo "Text2Image API: https://text2image-api.herokuapp.com"

echo "Don't forget to update your frontend environment variables with the backend URLs!" 