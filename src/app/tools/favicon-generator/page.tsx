
import { Metadata } from 'next';
import FaviconGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Favicon Generator",
  "Generate a complete set of favicons for all devices and browsers from one image. Create apple-touch-icon, android-chrome icons, and the classic favicon.ico in seconds."
);

export default function FaviconGeneratorPage() {
  return <FaviconGeneratorClient />;
}
