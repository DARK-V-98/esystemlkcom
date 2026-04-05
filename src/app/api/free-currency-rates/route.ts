
import { NextResponse } from 'next/server';

// This API route uses exchangerate-api.com's free V6 endpoint.
// It does NOT require an API key and is suitable for low-volume, non-commercial use.
const API_URL = 'https://open.er-api.com/v6/latest/USD';

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from free currency API: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.result === 'error') {
        throw new Error(data['error-type'] || 'Unknown error from free currency API');
    }
    
    return NextResponse.json({
        rates: data.rates,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
