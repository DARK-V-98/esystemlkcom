
import { Metadata } from 'next';
import ImageCompressorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Image Compressor",
  "Reduce image file size by up to 90% without quality loss. Supports JPEG and WebP. 100% private browser-side compression—no uploads required."
);

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}
