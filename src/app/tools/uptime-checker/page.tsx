
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Server, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface UptimeResult {
  status: 'online' | 'offline';
  statusCode?: number;
  responseTime?: number;
}

export default function UptimeCheckerPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<UptimeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/uptime-check?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check URL.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Website Uptime Checker</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Check if a website is online and responding from our server.
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

      <Card className="max-w-2xl mx-auto bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Check Website Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-12 text-lg"
              required
            />
            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
              Check Status
            </Button>
          </form>

          {error && <p className="text-destructive text-center p-4 bg-destructive/10 rounded-md">{error}</p>}
          
          {result && (
            <div className={`p-6 rounded-lg ${result.status === 'online' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {result.status === 'online' ? (
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-400">Website is Online</h3>
                    <p className="text-sm">Status: {result.statusCode}</p>
                    <p className="text-sm">Response Time: {result.responseTime} ms</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Website is Offline</h3>
                    {result.statusCode && <p className="text-sm">Status Code: {result.statusCode}</p>}
                    <p className="text-sm">The server could not be reached or returned an error.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

