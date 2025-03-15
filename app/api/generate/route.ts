import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkApiKey, handleApiError, createFormData, getFileExtension } from "@/lib/stability-api";

// Define features that require only a text prompt.
const features = {
  "artistic": {
    "data": {
      "output_format": "jpeg"
    },
    "media_type": "image/jpeg"
  },
  "photorealistic": {
    "data": {
      "output_format": "webp"
    },
    "media_type": "image/webp"
  }
};

export async function POST(req: Request) {
  console.log("Generate API route called");
  
  // Optional: Check authentication
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  // Check if API key is set
  if (!checkApiKey()) {
    console.error("API key not set");
    return NextResponse.json(
      { error: 'STABILITY_API_KEY not set in environment variables' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const feature = formData.get('feature') as string || "artistic";

    console.log(`Received prompt: "${prompt}", feature: "${feature}"`);

    if (!prompt) {
      console.error("No prompt provided");
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!features[feature as keyof typeof features]) {
      console.error(`Invalid feature: ${feature}`);
      return NextResponse.json(
        { error: 'Invalid feature selected' },
        { status: 400 }
      );
    }

    const featureInfo = features[feature as keyof typeof features];
    const outputFormat = featureInfo.data.output_format;

    console.log(`Using output format: ${outputFormat}`);

    // Create form data for the API request
    const apiFormData = createFormData({
      prompt,
      output_format: outputFormat
    });

    console.log("Making request to Stability API...");
    
    // Make the request to Stability API
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Accept': 'image/*',
        },
        body: apiFormData,
      }
    );

    console.log(`Stability API response status: ${response.status}`);

    if (!response.ok) {
      const { error, status } = await handleApiError(response);
      console.error("Stability API error:", error);
      return NextResponse.json({ error }, { status });
    }

    // Get the image data
    const imageData = await response.arrayBuffer();
    console.log(`Received image data of size: ${imageData.byteLength} bytes`);
    
    // Return the image with appropriate headers
    const extension = getFileExtension(featureInfo.media_type);
    
    return new NextResponse(Buffer.from(imageData), {
      headers: {
        'Content-Type': featureInfo.media_type,
        'Content-Disposition': `inline; filename=generated_${feature}.${extension}`
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}