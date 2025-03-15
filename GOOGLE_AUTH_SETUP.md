# Google OAuth Setup Guide

To ensure your Google Sign-In works correctly, follow these steps to verify your Google OAuth configuration:

## 1. Check Your Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID and verify the following:

## 2. Verify Authorized JavaScript Origins

Make sure these URLs are added:
- `http://localhost:3002` (for local development)
- Your production URL (if deployed)

## 3. Verify Authorized Redirect URIs

Make sure these redirect URIs are added:
- `http://localhost:3002/api/auth/callback/google` (for local development)
- `https://your-production-domain.com/api/auth/callback/google` (if deployed)

## 4. Verify OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Make sure your app information is correct
3. Ensure the necessary scopes are added:
   - `userinfo.email`
   - `userinfo.profile`

## 5. Testing Your Authentication

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3002/auth-test`
3. Click the "Sign in with Google" button
4. You should be redirected to Google's authentication page
5. After signing in, you should be redirected back to your application

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify that your .env.local file contains the correct credentials:
   ```
   GOOGLE_CLIENT_ID='your-client-id'
   GOOGLE_CLIENT_SECRET='your-client-secret'
   NEXTAUTH_SECRET='your-secret'
   NEXTAUTH_URL='http://localhost:3002'
   ```
3. Make sure your Google Cloud project has the "Google+ API" enabled
4. Check that your OAuth consent screen is properly configured
5. Verify that your application is using the credentials correctly

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2) 