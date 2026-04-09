
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
}

export default function MyIpPage() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const fetchIpInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Using a reliable third-party service to get IP info
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) {
        throw new Error('Failed to fetch IP information.');
      }
      const data = await response.json();
      setIpInfo(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">My IP Information</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          View your public IP address and related network details.
        </p>
      </div>

      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Your Public Network Details</CardTitle>
          <CardDescription>This is the information your browser presents to the internet.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">
              <p>Could not load IP information.</p>
              <p className="text-xs">{error}</p>
              <Button onClick={fetchIpInfo} variant="destructive" size="sm" className="mt-4">Retry</Button>
            </div>
          ) : ipInfo ? (
            <ul className="space-y-3">
              <li className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                <span className="font-medium text-muted-foreground">IP Address</span>
                <span className="font-mono font-bold text-primary">{ipInfo.ip}</span>
              </li>
              <li className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                <span className="font-medium text-muted-foreground">Location</span>
                <span className="font-mono">{`${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`}</span>
              </li>
              <li className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                <span className="font-medium text-muted-foreground">ISP</span>
                <span className="font-mono">{ipInfo.org}</span>
              </li>
               <li className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                <span className="font-medium text-muted-foreground">Timezone</span>
                <span className="font-mono">{ipInfo.timezone}</span>
              </li>
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


