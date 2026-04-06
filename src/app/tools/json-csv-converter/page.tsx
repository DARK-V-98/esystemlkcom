
import { Metadata } from 'next';
import JsonCsvConverterClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Advanced JSON to CSV Converter",
  "Convert JSON objects to CSV files and vice-versa instantly. Supports nested JSON, automatic header detection, and large file uploads—100% private in your browser."
);

export default function JsonCsvConverterPage() {
  return <JsonCsvConverterClient />;
}
