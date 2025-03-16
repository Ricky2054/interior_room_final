'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam);

    // Provide more detailed error descriptions
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setErrorDescription('There is a problem with the server configuration. This could be due to missing environment variables or incorrect OAuth settings.');
          break;
        case 'AccessDenied':
          setErrorDescription('You do not have permission to sign in.');
          break;
        case 'Verification':
          setErrorDescription('The verification link is invalid or has expired.');
          break;
        case 'OAuthSignin':
          setErrorDescription('Error in the OAuth sign-in process. This could be due to incorrect redirect URIs in your Google OAuth configuration.');
          break;
        case 'OAuthCallback':
          setErrorDescription('Error in the OAuth callback process. This could be due to incorrect redirect URIs in your Google OAuth configuration.');
          break;
        case 'OAuthCreateAccount':
          setErrorDescription('Could not create OAuth account.');
          break;
        case 'EmailCreateAccount':
          setErrorDescription('Could not create email account.');
          break;
        case 'Callback':
          setErrorDescription('Error in the callback process.');
          break;
        case 'OAuthAccountNotLinked':
          setErrorDescription('The email on the account is already linked, but not with this OAuth account.');
          break;
        case 'EmailSignin':
          setErrorDescription('Error sending the email for sign in.');
          break;
        case 'CredentialsSignin':
          setErrorDescription('The sign in attempt failed. The username or password provided may be incorrect.');
          break;
        case 'SessionRequired':
          setErrorDescription('You must be signed in to access this page.');
          break;
        default:
          setErrorDescription('An unknown error occurred during authentication.');
      }
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-md">
            <p className="font-semibold">Error Type: {error}</p>
            {errorDescription && <p className="mt-2">{errorDescription}</p>}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Troubleshooting Steps:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check that your Google OAuth credentials are correctly configured</li>
            <li>Verify that the redirect URI in Google Cloud Console matches your Vercel deployment URL</li>
            <li>Make sure all required environment variables are set in Vercel</li>
            <li>Clear your browser cookies and try again</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 