"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Download, Bot } from 'lucide-react';
import Link from 'next/link';

const defaultRobotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.your-website.com/sitemap.xml
`;

export default function RobotsTxtGeneratorPage() {
  const [content, setContent] = useState(defaultRobotsTxt);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">robots.txt Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Create a `robots.txt` file to guide search engine crawlers.
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
          <CardTitle>Editor</CardTitle>
          <CardDescription>Modify the content and download your file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono h-[300px] text-sm"
            placeholder="User-agent: *"
          />
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download robots.txt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}