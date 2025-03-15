import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkApiKey, handleApiError, createFormData, addImageToFormData, getFileExtension } from "@/lib/stability-api";

// Define our features mapping with descriptive prompts.
const features = {
  "color change": {
    "url": "https://api.stability.ai/v2beta/stable-image/edit/search-and-recolor",
    "data": {
      "prompt": "Change the dominant colors of the image to be more vibrant and appealing",
      "select_prompt": "main color",
      "output_format": "jpeg"
    },
    "media_type": "image/jpeg"
  },
  "refresh": {
    "url": "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace",
    "data": {
      "prompt": "Refresh the design elements while preserving the layout and integrity of the scene",
      "search_prompt": "furniture",
      "output_format": "webp"
    },
    "media_type": "image/webp"
  },
  "maximize": {
    "url": "https://api.stability.ai/v2beta/stable-image/edit/outpaint",
    "data": {
      "prompt": "Expand the image by intelligently outpainting contextually appropriate elements",
      "left": 200,
      "down": 200,
      "output_format": "webp"
    },
    "media_type": "image/webp"
  },
  "redesign": {
    "url": "https://api.stability.ai/v2beta/stable-image/control/sketch",
    "data": {
      "prompt": "Redesign the room with a creative layout and innovative perspective",
      "control_strength": 0.8,
      "output_format": "webp"
    },
    "media_type": "image/webp"
  },
  "functional change": {
    "url": "https://api.stability.ai/v2beta/stable-image/control/style",
    "data": {
      "prompt": "Transform the room's function into a new theme while keeping its structure intact",
      "output_format": "webp"
    },
    "media_type": "image/webp"
  },
  "style stealer": {
    "url": "https://api.stability.ai/v2beta/stable-image/control/style",
    "data": {
      "prompt": "Apply a distinctive artistic style to the room based on the original design",
      "output_format": "webp"
    },
    "media_type": "image/webp"
  },
  "image quality enhancer": {
    "url": "https://api.stability.ai/v2beta/stable-image/upscale/fast",
    "data": {
      "prompt": "Enhance the image's resolution and clarity, making details crisper",
      "output_format": "webp"
    },
    "media_type": "image/webp"
  }
};

export async function POST(request: Request) {
  console.log("Transform API route called");
  
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
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const feature = formData.get('feature') as string;
    const extraPrompt = formData.get('extra_prompt') as string | null;

    console.log(`Received feature: "${feature}", image: ${image?.name || 'none'}, extra prompt: ${extraPrompt || 'none'}`);

    if (!image || !feature) {
      console.error("Missing image or feature");
      return NextResponse.json(
        { error: 'Image and feature are required' },
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
    const url = featureInfo.url;

    console.log(`Using URL: ${url}`);

    // Copy the default payload so we don't modify the shared mapping
    const payload = { ...featureInfo.data };

    // Append extra prompt details if provided
    if (extraPrompt) {
      const basePrompt = payload.prompt || "";
      payload.prompt = `${basePrompt}. Additional details: ${extraPrompt}`;
      console.log(`Modified prompt: ${payload.prompt}`);
    }

    // Convert the file to ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageBlob = new Blob([buffer], { type: image.type });

    console.log(`Image size: ${buffer.length} bytes, type: ${image.type}`);

    // Create form data for the API request
    const apiFormData = createFormData(payload);
    addImageToFormData(apiFormData, imageBlob);

    console.log("Making request to Stability API...");
    
    // Make the request to Stability API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'image/*',
      },
      body: apiFormData,
    });

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
        'Content-Disposition': `inline; filename=generated_${feature.replace(' ', '_')}.${extension}`
      }
    });
  } catch (error) {
    console.error('Error processing image transformation:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
} 