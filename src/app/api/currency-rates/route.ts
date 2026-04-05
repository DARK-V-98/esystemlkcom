
import { NextResponse } from 'next/server';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

export async function GET() {
  const apiKey = process.env.CURRENCY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  const freecurrencyapi = new Freecurrencyapi(apiKey);

  try {
    // Fetch both latest rates and currencies list in parallel
    const [ratesResponse, currenciesResponse] = await Promise.all([
      freecurrencyapi.latest(),
      freecurrencyapi.currencies()
    ]);
    
    return NextResponse.json({
        rates: ratesResponse.data,
        currencies: currenciesResponse.data
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
