
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Clock, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanDate, setHumanDate] = useState(new Date().toLocaleString());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const num = parseInt(timestamp, 10);
      if (!isNaN(num)) {
        // Auto-detect if it's seconds (10 digits) or milliseconds (13 digits)
        const date = new Date(timestamp.length === 13 ? num : num * 1000);
        setHumanDate(date.toLocaleString());
      }
    } catch {
      // ignore
    }
  }, [timestamp]);

  const handleHumanDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    setHumanDate(newDateStr);
    const date = new Date(newDateStr);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    }
  };
  
  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Unix Timestamp Converter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert between Unix timestamps and human-readable dates.
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

      <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Converter</CardTitle>
          <CardDescription>Edit either field to convert.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="timestamp" className="text-sm font-medium">Unix Timestamp (seconds)</label>
            <div className="relative">
              <Input id="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} className="pr-10"/>
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopyToClipboard(timestamp, 'ts')}>
                 {copied === 'ts' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>

          <div className="space-y-2">
            <label htmlFor="humandate" className="text-sm font-medium">Human-Readable Date</label>
            <div className="relative">
              <Input id="humandate" value={humanDate} onChange={handleHumanDateChange} className="pr-10" />
               <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopyToClipboard(humanDate, 'date')}>
                 {copied === 'date' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
           <div className="pt-4 text-center">
            <Button onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}>
              Set to Current Time
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
