
import { Metadata } from 'next';
import SitemapGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free XML Sitemap Generator",
  "Generate a production-ready XML sitemap for your website. Speed up Google indexing and improve your search engine optimization with our easy-to-use sitemap builder."
);

export default function SitemapGeneratorPage() {
  return <SitemapGeneratorClient />;
}
