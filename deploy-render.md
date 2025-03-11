# Deploying to Render.com

This guide will help you deploy the Interior Design application to Render.com.

## Prerequisites

1. A Render.com account
2. Your Stability API key

## Deployment Steps

### Frontend Deployment (Already completed)

The frontend has been deployed to Vercel at:
https://interior-work-15banssoa-ricky2054s-projects.vercel.app

### Backend Deployment

1. Log in to your Render.com account
2. Create a new "Blueprint" deployment
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create the services
5. Set the `STABILITY_API_KEY` environment variable in the Render dashboard for both services
6. Deploy the services

## Verifying the Deployment

1. Once deployed, Render will provide URLs for both backend services
2. Update the frontend environment variables in the Vercel dashboard:
   - Go to your project settings in Vercel
   - Add the following environment variables:
     - `NEXT_PUBLIC_INTERIOR_API_URL`: Your interior-api service URL from Render
     - `NEXT_PUBLIC_TEXT2IMAGE_API_URL`: Your text2image-api service URL from Render

## Troubleshooting

- If you encounter CORS issues, make sure the frontend URL is correctly added to the allowed origins in both backend services
- Check the logs in Render.com dashboard for any errors
- Verify that the Stability API key is correctly set in the environment variables 