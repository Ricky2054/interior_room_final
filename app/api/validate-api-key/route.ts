import { NextResponse } from 'next/server';
import { checkApiKey } from '@/lib/stability-api';

export async function GET() {
  try {
    const isValid = checkApiKey();
    
    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json(
        { valid: false, error: 'API key is not set or invalid' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // For POST requests, just redirect to GET
  return GET();
} 