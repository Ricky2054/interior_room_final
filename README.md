# Interior Design AI Application

This application uses AI to transform interior design images based on user prompts. It consists of a Next.js frontend and two FastAPI backends.

## Deployment Instructions

### Frontend Deployment (Vercel)

1. Create a Vercel account if you don't have one: https://vercel.com/signup
2. Install the Vercel CLI: `npm install -g vercel`
3. Login to Vercel: `vercel login`
4. Deploy the application: `vercel`
5. Set the following environment variables in the Vercel dashboard:
   - `STABILITY_API_KEY`: Your Stability AI API key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
   - `BACKEND_URL`: URL of your deployed server_interior.py API
   - `TEXT2IMAGE_URL`: URL of your deployed text2image.py API

### Backend Deployment (Heroku)

1. Create a Heroku account if you don't have one: https://signup.heroku.com
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login to Heroku: `heroku login`

#### Deploy server_interior.py

1. Create a new Heroku app: `heroku create interior-api`
2. Set environment variables:
   ```
   heroku config:set STABILITY_API_KEY=your_stability_api_key --app interior-api
   heroku config:set FRONTEND_URL=https://your-app.vercel.app --app interior-api
   ```
3. Deploy the application:
   ```
   git push heroku main
   ```

#### Deploy text2image.py

1. Create a new Heroku app: `heroku create text2image-api`
2. Set environment variables:
   ```
   heroku config:set STABILITY_API_KEY=your_stability_api_key --app text2image-api
   heroku config:set FRONTEND_URL=https://your-app.vercel.app --app text2image-api
   ```
3. Deploy the application:
   ```
   heroku git:remote -a text2image-api
   git push heroku main
   ```

### Alternative Backend Deployment (Render)

1. Create a Render account: https://render.com/signup
2. Create a new Web Service for each backend
3. Connect your GitHub repository
4. Set the following:
   - Build Command: `pip install -r requirements.txt`
   - Start Command for server_interior.py: `gunicorn -k uvicorn.workers.UvicornWorker server_interior:app`
   - Start Command for text2image.py: `gunicorn -k uvicorn.workers.UvicornWorker text2image:app`
5. Set the environment variables as described in the Heroku section

## Local Development

1. Install dependencies:
   ```
   npm install
   pip install -r requirements.txt
   ```

2. Run the development servers:
   ```
   npm run dev
   python server_interior.py
   python text2image.py
   ```

3. Open http://localhost:3000 in your browser