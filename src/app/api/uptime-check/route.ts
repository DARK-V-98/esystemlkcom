
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Ensure URL has a protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const startTime = Date.now();
    // Using a HEAD request to be more efficient
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (response.ok || (response.status >= 300 && response.status < 400) ) {
      return NextResponse.json({
        status: 'online',
        statusCode: response.status,
        responseTime: responseTime,
      });
    } else {
      return NextResponse.json({
        status: 'offline',
        statusCode: response.status,
      });
    }
  } catch (error) {
    let message = 'An unknown error occurred.';
    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            message = 'The request timed out after 5 seconds.';
        } else {
            message = `Could not reach the server: ${error.message}`;
        }
    }
    return NextResponse.json({ status: 'offline', error: message }, { status: 500 });
  }
}
