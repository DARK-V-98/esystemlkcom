
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, RefreshCw, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function CsrfTokenGeneratorPage() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const hexToken = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    setToken(hexToken);
  };

  useEffect(() => {
    generateToken();
  }, []);

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">CSRF Token Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Generate a secure, random token to protect against Cross-Site Request Forgery attacks.
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
          <CardTitle>Generated Token</CardTitle>
          <CardDescription>A cryptographically strong random token.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="relative">
                <Input
                readOnly
                value={token}
                className="h-12 text-base font-mono pr-12"
                placeholder="Generating token..."
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10" onClick={handleCopy}>
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
            </div>
          
            <Button onClick={generateToken} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Generate New Token
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
