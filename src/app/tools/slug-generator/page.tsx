
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Link2 } from 'lucide-react';
import Link from 'next/link';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') //-
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

export default function SlugGeneratorPage() {
  const [input, setInput] = useState('My Awesome Blog Post!');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSlug(generateSlug(input));
  }, [input]);

  const handleCopy = () => {
    if (slug) {
      navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">URL Slug Generator</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Create clean, SEO-friendly URL slugs from your page or post titles.
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

      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Input Title</CardTitle>
            <CardDescription>Enter the text you want to convert into a slug.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-12 text-lg"
              placeholder="Enter title..."
            />
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Generated Slug</CardTitle>
                    <CardDescription>Your SEO-friendly URL slug.</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!slug}>
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
             </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 rounded-md bg-black/20">
                <span className="text-gray-600">/</span>
                <Input
                  readOnly
                  value={slug}
                  className="font-mono text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="slug-will-appear-here"
                />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


