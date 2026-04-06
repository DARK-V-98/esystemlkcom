
import { Metadata } from 'next';
import MetaTagGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Advanced SEO Meta Tag Generator",
  "Generate professional meta tags to boost your SEO and social media presence. Real-time previews for Google Search, Facebook, Twitter, and LinkedIn."
);

export default function MetaTagGeneratorPage() {
  return <MetaTagGeneratorClient />;
}
