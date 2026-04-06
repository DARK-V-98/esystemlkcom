
import { Metadata } from 'next';
import ApiTesterClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Online API Tester",
  "A lightweight, browser-based REST API client to test GET, POST, PUT, and DELETE requests. A free mini Postman alternative with full custom header support and performance metrics."
);

export default function ApiTesterPage() {
  return <ApiTesterClient />;
}
