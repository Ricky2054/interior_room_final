import { AuthButton } from "@/components/auth-button";

export default function AuthTestPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Test</h1>
        
        <div className="flex justify-center mb-8">
          <AuthButton />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>This page tests Google authentication.</p>
          <p>Click the button above to sign in with Google.</p>
        </div>
      </div>
    </div>
  );
} 