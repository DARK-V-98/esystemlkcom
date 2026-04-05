
import { NextResponse } from 'next/server';
import * as tls from 'tls';
import * as dns from 'dns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  // Sanitize domain to prevent injection attacks
  const sanitizedDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '');

  try {
    // Step 1: DNS lookup to get the IP address
    const addresses = await new Promise<string[]>((resolve, reject) => {
      dns.resolve(sanitizedDomain, (err, addresses) => {
        if (err) {
          return reject(new Error(`DNS lookup failed for ${sanitizedDomain}: ${err.message}`));
        }
        if (!addresses || addresses.length === 0) {
            return reject(new Error(`No IP address found for ${sanitizedDomain}`));
        }
        resolve(addresses);
      });
    });

    // Step 2: Connect to the server via TLS to get the certificate
    const cert = await new Promise<tls.PeerCertificate>((resolve, reject) => {
      const options = {
        host: addresses[0], // Use the first resolved IP address
        port: 443,
        servername: sanitizedDomain, // Important for SNI
        rejectUnauthorized: false, // We accept self-signed certs, but we'll inspect them
      };

      const socket = tls.connect(options, () => {
        if (!socket.authorized) {
            // This is not a fatal error for our purposes, we still want to inspect the cert
        }
        const peerCertificate = socket.getPeerCertificate();
        socket.end();
        if (Object.keys(peerCertificate).length === 0) {
            return reject(new Error(`No SSL certificate found for ${sanitizedDomain}. The site might not be using HTTPS.`));
        }
        resolve(peerCertificate);
      });

      socket.on('error', (err) => {
        reject(new Error(`TLS connection error: ${err.message}`));
      });

      socket.setTimeout(5000, () => {
          socket.destroy(new Error('Connection timed out after 5 seconds.'));
      });
    });

    const now = new Date();
    const validToDate = new Date(cert.valid_to);
    const expiresInDays = Math.floor((validToDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Step 3: Format and return the certificate details
    const certInfo = {
      subject: cert.subject,
      issuer: cert.issuer,
      valid_from: cert.valid_from,
      valid_to: cert.valid_to,
      expires_in_days: expiresInDays
    };

    return NextResponse.json(certInfo);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`SSL Check Error for ${sanitizedDomain}:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
