
import { Metadata } from 'next';
import QrCodeGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Advanced QR Code Generator",
  "Generate custom QR codes for URLs, text, or business cards. Change colors, sizes, and quiet zones. Totally free and private—created in your browser."
);

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorClient />;
}
