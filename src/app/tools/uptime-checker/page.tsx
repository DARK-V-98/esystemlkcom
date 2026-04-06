
import { Metadata } from 'next';
import UptimeCheckerClient from './client';
import { getToolMetadata } from '@/lib/tool-metadata';

export const metadata: Metadata = getToolMetadata(
  "Free Website Uptime Checker",
  "Check if your website is online and responsive world-wide. Get real-time status codes, response times, and uptime metrics. 100% free with no account required."
);

export default function UptimeCheckerPage() {
  return <UptimeCheckerClient />;
}
