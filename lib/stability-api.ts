/**
 * Utility functions for interacting with the Stability AI API
 */

// Check if the Stability API key is set
export function checkApiKey(): boolean {
  if (!process.env.STABILITY_API_KEY) {
    console.error("STABILITY_API_KEY not set in environment variables");
    return false;
  }
  return true;
}

// Helper function to handle API errors
export async function handleApiError(response: Response): Promise<{ error: any, status: number }> {
  let errorInfo;
  try {
    errorInfo = await response.json();
  } catch (e) {
    try {
      errorInfo = await response.text();
    } catch (e2) {
      errorInfo = "Unknown error";
    }
  }
  return { error: errorInfo, status: response.status };
}

// Helper function to create form data for the API request
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
}

// Helper function to add an image to form data
export function addImageToFormData(
  formData: FormData, 
  image: File | Blob, 
  name: string = 'image'
): FormData {
  formData.append(name, image, 'image.jpg');
  return formData;
}

// Helper function to get the appropriate file extension
export function getFileExtension(mediaType: string): string {
  return mediaType === "image/jpeg" ? "jpeg" : "webp";
}

// Helper function to get the base URL for the API
export function getBaseUrl(): string {
  // First try NEXTAUTH_URL which should be set explicitly
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // In production, use the VERCEL_URL environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // In development, use the local URL
  return 'http://localhost:3002';
} 