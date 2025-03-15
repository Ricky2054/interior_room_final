import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { 
        valid: false, 
        error: "STABILITY_API_KEY not set in environment variables",
        key_length: 0
      },
      { status: 200 }
    );
  }
  
  try {
    // Make a simple request to the Stability API to check if the key is valid
    const response = await fetch("https://api.stability.ai/v1/user/account", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { 
          valid: true, 
          message: "API key is valid",
          key_length: apiKey.length,
          user_info: data
        },
        { status: 200 }
      );
    } else {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          valid: false, 
          error: `API key validation failed: ${response.status} ${response.statusText}`,
          details: errorText,
          key_length: apiKey.length,
          key_prefix: apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5)
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        valid: false, 
        error: `Error checking API key: ${error instanceof Error ? error.message : String(error)}`,
        key_length: apiKey.length,
        key_prefix: apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5)
      },
      { status: 200 }
    );
  }
} 