
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Download, Network as SitemapIcon } from 'lucide-react';
import Link from 'next/link';

export default function SitemapGeneratorPage() {
  const [urls, setUrls] = useState('https://www.example.com/\nhttps://www.example.com/about\nhttps://www.example.com/contact');
  const [xml, setXml] = useState('');

  const generateSitemap = () => {
    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    const today = new Date().toISOString();

    const urlset = urlList.map(url => `
  <url>
    <loc>${url.trim()}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.80</priority>
  </url>`).join('');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
    
    setXml(sitemapXml.trim());
  };
  
  const handleDownload = () => {
    if (!xml) {
      generateSitemap();
    }
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Sitemap.xml Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Create an XML sitemap from a list of URLs to improve SEO.
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Enter URLs</CardTitle>
            <CardDescription>Paste one URL per line.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="font-mono h-[400px] text-sm"
              placeholder="https://www.example.com/..."
            />
            <Button onClick={generateSitemap} className="w-full mt-4">Generate Preview</Button>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Generated Sitemap</CardTitle>
            <CardDescription>Review your sitemap.xml file.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/40 p-4 rounded-md h-[400px] overflow-auto font-mono">
              <code>{xml || 'Click "Generate Preview" to see your sitemap.'}</code>
            </pre>
            <Button onClick={handleDownload} disabled={!urls.trim()} className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" /> Download sitemap.xml
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
