
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Network as SitemapIcon, RefreshCw, Copy, Check, FileCode } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function SitemapGeneratorClient() {
  const [urls, setUrls] = useState('https://esystemlk.com/\nhttps://esystemlk.com/about\nhttps://esystemlk.com/services');
  const [xml, setXml] = useState('');
  const [priority, setPriority] = useState('0.80');
  const [changefreq, setChangefreq] = useState('monthly');
  const [isCopied, setIsCopied] = useState(false);

  const generateSitemap = () => {
    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    if (urlList.length === 0) {
      toast.error('Please enter at least one valid URL.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const urlEntries = urlList.map(url => {
        let cleanUrl = url.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) {
            cleanUrl = 'https://' + cleanUrl;
        }
        return `  <url>
    <loc>${cleanUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
    
    setXml(sitemapXml.trim());
    toast.success('Sitemap generated successfully!');
  };
  
  const handleDownload = () => {
    if (!xml) generateSitemap();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('sitemap.xml downloaded!');
  };

  const copyToClipboard = () => {
    if (!xml) return;
    navigator.clipboard.writeText(xml);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <ToolLayout 
      title="XML Sitemap Generator" 
      description="Create a search-engine ready sitemap for your website in seconds. Boost your SEO indexing for Google, Bing, and other search engines."
      category="Web SEO"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-[hsl(200,100%,50%,0.5)] hover:shadow-[0_0_20px_hsl(200,100%,50%,0.1)] transition-all">
            <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SitemapIcon className="w-5 h-5 text-primary" />
                URL Source
              </CardTitle>
              <CardDescription>Paste the list of URLs you want to include.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                className="min-h-[300px] font-mono text-sm bg-gray-50 border-gray-200 focus:border-primary/50 transition-all resize-none"
                placeholder="https://example.com/&#10;https://example.com/about"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Default Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1.0 (High)</SelectItem>
                      <SelectItem value="0.80">0.8 (Normal)</SelectItem>
                      <SelectItem value="0.50">0.5 (Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Change Freq</label>
                  <Select value={changefreq} onValueChange={setChangefreq}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateSitemap} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <RefreshCw className="mr-2 w-4 h-4" />
                Generate XML Sitemap
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group hover:border-purple-500/30 transition-all min-h-[500px] flex flex-col">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-500/50 to-primary" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  XML Output
                </CardTitle>
                <CardDescription>Your production-ready XML code.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-9 gap-2">
                  {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-9 gap-2">
                  <Download className="w-3 h-3" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-0">
               <div className="flex-grow bg-gray-50 font-mono text-[11px] p-6 overflow-auto max-h-[540px] border-t border-gray-200 whitespace-pre">
                  {xml ? (
                    <code className="text-purple-300">
                      {xml}
                    </code>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic">
                      Click generate to view sitemap code...
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}


