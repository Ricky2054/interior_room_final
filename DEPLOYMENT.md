# Interior Design App Deployment Guide

This guide provides instructions for deploying the Interior Design application, which consists of a Next.js frontend and two FastAPI backend services.

## Application Structure

- **Frontend**: Next.js application
- **Backend Services**:
  - `server_interior.py`: Handles interior design image transformations
  - `text2image.py`: Handles text-to-image generation

## Deployment Options

### Option 1: Vercel + Render.com (Recommended)

#### Frontend Deployment (Vercel)

1. **Build the Next.js application**:
   ```
   npm run build
   ```

2. **Deploy to Vercel**:
   ```
   vercel --prod
   ```

3. **Note the deployed URL** (e.g., `https://interior-work-15banssoa-ricky2054s-projects.vercel.app`)

#### Backend Deployment (Render.com)

1. **Create a Render.com account** at https://render.com

2. **Create a new Blueprint** and connect your GitHub repository

3. **Render will detect the `render.yaml` file** and create the services:
   - interior-api
   - text2image-api

4. **Set environment variables** in the Render dashboard:
   - `STABILITY_API_KEY`: Your Stability API key
   - `FRONTEND_URL`: Your Vercel frontend URL

5. **Deploy the services** and note the URLs provided by Render

#### Connecting Frontend and Backend

1. **Update environment variables in Vercel**:
   - Go to your project settings in Vercel
   - Add the following environment variables:
     - `NEXT_PUBLIC_INTERIOR_API_URL`: Your interior-api service URL from Render
     - `NEXT_PUBLIC_TEXT2IMAGE_API_URL`: Your text2image-api service URL from Render

2. **Redeploy the frontend** to apply the changes

### Option 2: Heroku Deployment (Alternative)

If you prefer Heroku, you can use the included `deploy.sh` script:

1. **Install the required CLIs**:
   ```
   npm install -g vercel heroku
   ```

2. **Log in to both services**:
   ```
   vercel login
   heroku login
   ```

3. **Run the deployment script**:
   ```
   bash deploy.sh
   ```

4. **Follow the prompts** to complete the deployment

## Environment Variables

### Frontend (.env.production)

```
STABILITY_API_KEY=your_stability_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_production_url
NEXT_PUBLIC_INTERIOR_API_URL=your_interior_api_url
NEXT_PUBLIC_TEXT2IMAGE_API_URL=your_text2image_api_url
```

### Backend (Render.com or Heroku environment variables)

```
STABILITY_API_KEY=your_stability_api_key
FRONTEND_URL=your_frontend_url
```

## Troubleshooting

- **CORS Issues**: Ensure the frontend URL is correctly added to the allowed origins in both backend services
- **API Key Issues**: Verify that the Stability API key is correctly set in all environment variables
- **Connection Issues**: Check that the frontend is correctly configured to connect to the backend services

## Maintenance

- **Updating the Application**: Push changes to your repository and redeploy
- **Monitoring**: Use the Vercel and Render dashboards to monitor your application
- **Scaling**: Both Vercel and Render offer paid plans for increased resources if needed 