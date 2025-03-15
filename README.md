# Room Redesign AI

A Next.js application for interior room design using Stability AI's image generation and transformation APIs.

## Features

- Generate room designs from text prompts
- Transform existing room images with various features:
  - Color change
  - Refresh design elements
  - Maximize space
  - Redesign layout
  - Functional change
  - Style stealer
  - Image quality enhancer
- Google authentication for user management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Stability AI API key
- Google OAuth credentials
- Cloudinary account (optional, for image uploads)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/room-redesign-ai.git
   cd room-redesign-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3002](http://localhost:3002) in your browser

## Deployment to Vercel

### 1. Prepare Your Project

First, check if your application is ready for deployment:
```bash
npm run check-deployment
```

This will verify that all required files and environment variables are present and that the application builds successfully.

Then run the preparation script:
```bash
npm run prepare-vercel
```

This script will:
- Generate a secure NEXTAUTH_SECRET
- Create a .vercelignore file
- Check for required environment variables

For a detailed step-by-step guide, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

### Deployment Scripts

The following scripts are available to help with deployment:

| Script | Description |
|--------|-------------|
| `npm run check-deployment` | Checks if the application is ready for deployment |
| `npm run prepare-vercel` | Prepares the application for Vercel deployment |
| `npm run generate-vercel-env` | Generates Vercel CLI commands for environment variables |
| `npm run verify-deployment` | Verifies that a deployment is working correctly |
| `npm run update-vercel-env` | Helps update environment variables on Vercel |

### 2. Push your code to GitHub

Make sure your code is in a GitHub repository.

### 3. Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign up or log in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### 4. Set Environment Variables

In the Vercel project settings, add the following environment variables:

- `STABILITY_API_KEY`: Your Stability AI API key
- `NEXTAUTH_SECRET`: A secure random string (use `openssl rand -base64 32` to generate)
- `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://your-project.vercel.app)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

### 5. Update Google OAuth Settings

In the Google Cloud Console:
1. Go to "APIs & Services" > "Credentials"
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel deployment URL to:
   - Authorized JavaScript origins: `https://your-project.vercel.app`
   - Authorized redirect URIs: `https://your-project.vercel.app/api/auth/callback/google`

### 6. Deploy

Click "Deploy" in the Vercel dashboard. Your application will be built and deployed automatically.

## API Endpoints

This application uses Next.js App Router for API routes. All API routes are located in the `app/api` directory.

### Generate Image from Text

```
POST /api/generate
```

Form data parameters:
- `prompt`: Text description of the room to generate
- `feature`: (optional) "artistic" or "photorealistic" (default: "artistic")

### Transform Existing Image

```
POST /api/transform
```

Form data parameters:
- `image`: Image file to transform
- `feature`: One of the following:
  - "color change"
  - "refresh"
  - "maximize"
  - "redesign"
  - "functional change"
  - "style stealer"
  - "image quality enhancer"
- `extra_prompt`: (optional) Additional text to guide the transformation

## License

[MIT](LICENSE)