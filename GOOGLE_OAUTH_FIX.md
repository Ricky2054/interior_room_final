# Fix for Google OAuth Redirect URI Mismatch Error

Follow these steps to fix the "Error 400: redirect_uri_mismatch" issue:

## 1. Update Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find and click on your OAuth 2.0 Client ID

## 2. Add the Correct Redirect URIs

In the "Authorized redirect URIs" section, add the following URLs:
- `http://localhost:3002/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (keep this if it exists)
- `http://localhost:3001/api/auth/callback/google` (keep this if it exists)

## 3. Update Authorized JavaScript Origins

In the "Authorized JavaScript origins" section, add:
- `http://localhost:3002`
- `http://localhost:3000` (keep this if it exists)
- `http://localhost:3001` (keep this if it exists)

## 4. Save Your Changes

Click the "Save" button at the bottom of the page.

## 5. Important Note About Redirect URIs

Google OAuth requires an exact match between:
- The redirect URI configured in Google Cloud Console
- The redirect URI your application sends during authentication

The port number (3002) must match exactly, and the path must be exactly `/api/auth/callback/google`.

## 6. Testing After Changes

1. Wait a few minutes for Google's systems to update
2. Restart your Next.js application: `npm run dev`
3. Try signing in again at: http://localhost:3002/auth-test

## 7. If You're Still Having Issues

If you're still encountering the error after following these steps:

1. Check the browser console for any additional error details
2. Verify that your application is actually running on port 3002
3. Make sure there are no typos in the redirect URIs
4. Try clearing your browser cookies and cache
5. Try using an incognito/private browser window 