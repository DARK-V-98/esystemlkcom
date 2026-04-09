
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('https://example.com/?q=hello world&a=1');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setOutput(encodeURIComponent(input));
  };
  
  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch(e) {
      setOutput("Error: Invalid URI component");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">URL Encoder / Decoder</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Encode or decode text to be URL-safe.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Paste the text you want to process.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-[300px] text-sm"
              placeholder="Enter text or URL component..."
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button onClick={handleEncode}>Encode</Button>
              <Button onClick={handleDecode} variant="secondary">Decode</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Output</CardTitle>
                <CardDescription>The result of the operation.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={output}
              className="font-mono h-[300px] text-sm bg-black/20"
              placeholder="Result will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


