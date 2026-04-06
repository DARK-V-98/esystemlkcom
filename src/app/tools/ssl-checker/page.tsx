
import { Metadata } from 'next';
import SslCheckerClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Advanced SSL Certificate Checker",
  "Check any website's SSL certificate instantly. Verify expiry dates, domain ownership, and issuing authority for any HTTPS domain worldwide. Completely free secure scan."
);

export default function SslCheckerPage() {
  return <SslCheckerClient />;
}
