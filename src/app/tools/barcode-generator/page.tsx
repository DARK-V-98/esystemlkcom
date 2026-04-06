
import { Metadata } from 'next';
import BarcodeGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Barcode Generator",
  "Generate high-quality barcodes for retail and shipping. Supports CODE128, EAN, UPC, and more. Customize sizes and colors—100% free and easy to use."
);

export default function BarcodeGeneratorPage() {
  return <BarcodeGeneratorClient />;
}
