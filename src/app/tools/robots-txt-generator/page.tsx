
import { Metadata } from 'next';
import RobotsTxtGeneratorClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Robots.txt Generator",
  "Generate a robots.txt file to guide search engine crawlers and improve your site's SEO. Easily manage allow/disallow rules for Googlebot, Bingbot, and more."
);

export default function RobotsTxtGeneratorPage() {
  return <RobotsTxtGeneratorClient />;
}
