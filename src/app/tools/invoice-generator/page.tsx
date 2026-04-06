
import { Metadata } from 'next';
import InvoiceGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Professional Invoice Generator",
  "Create and download professional PDF invoices in seconds. Add your company logo, calculate taxes, and manage line items—100% free with no signup required."
);

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClient />;
}
