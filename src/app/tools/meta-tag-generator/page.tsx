"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Tv, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState('My Awesome Website');
  const [description, setDescription] = useState('This is a great description of my website that will rank well on Google.');
  const [imageUrl, setImageUrl] = useState('https://example.com/image.png');
  const [url, setUrl] = useState('https://example.com');
  const [copied, setCopied] = useState(false);

  const metaTags = `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">SEO Meta Tag Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Generate essential meta tags for SEO and social media sharing.
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
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Fill in the details to generate your tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label htmlFor="title" className="text-sm font-medium">Title (Max 60 chars recommended)</label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                 <div>
                    <label htmlFor="description" className="text-sm font-medium">Description (Max 160 chars recommended)</label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3}/>
                </div>
                 <div>
                    <label htmlFor="url" className="text-sm font-medium">Website URL</label>
                    <Input id="url" value={url} onChange={e => setUrl(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (1200x630px recommended)</label>
                    <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                </div>
            </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Generated Tags</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <pre className="text-xs bg-black/40 p-4 rounded-md max-h-60 overflow-auto font-mono">
                        <code>{metaTags}</code>
                    </pre>
                </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Tv className="w-5 h-5"/> Previews</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                    {/* Google Preview */}
                    <div>
                        <h3 className="font-semibold mb-2">Google Search</h3>
                        <div className="p-4 bg-background rounded-lg border">
                            <p className="text-blue-500 text-xl truncate">{title}</p>
                            <p className="text-green-600 text-sm truncate">{url}</p>
                            <p className="text-gray-500 text-sm">{description}</p>
                        </div>
                    </div>
                    {/* Social Media Preview */}
                     <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook / <Twitter className="w-4 h-4" /> Twitter</h3>
                        <div className="border bg-background rounded-lg overflow-hidden">
                            {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-48 object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />}
                            <div className="p-4">
                                <p className="text-xs uppercase text-muted-foreground truncate">{new URL(url).hostname}</p>
                                <h4 className="font-bold truncate">{title}</h4>
                                <p className="text-sm text-muted-foreground truncate">{description}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}