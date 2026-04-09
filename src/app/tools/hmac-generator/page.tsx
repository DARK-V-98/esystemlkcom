
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CryptoJS from 'crypto-js';

type HmacAlgorithm = 'HmacMD5' | 'HmacSHA1' | 'HmacSHA256' | 'HmacSHA512';

export default function HmacGeneratorPage() {
  const [input, setInput] = useState('hello world');
  const [secret, setSecret] = useState('my-secret-key');
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('HmacSHA256');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHmac = () => {
    if (!input || !secret) return;
    setIsProcessing(true);
    
    const hmac = CryptoJS[algorithm](input, secret);
    const hash = hmac.toString(CryptoJS.enc.Hex);
    
    setOutput(hash);
    setIsProcessing(false);
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
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">HMAC Generator</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Generate a Hash-based Message Authentication Code (HMAC) from a string and a secret key.
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
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Provide the message, secret, and algorithm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea
                id="message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono h-[150px] text-sm mt-1"
                placeholder="Enter message..."
              />
            </div>
            <div>
              <label htmlFor="secret" className="text-sm font-medium">Secret Key</label>
              <Input
                id="secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="font-mono mt-1"
                placeholder="Enter secret key..."
              />
            </div>
            <div>
              <label htmlFor="algorithm" className="text-sm font-medium">Algorithm</label>
              <Select onValueChange={(v) => setAlgorithm(v as HmacAlgorithm)} defaultValue={algorithm}>
                <SelectTrigger id="algorithm" className="mt-1">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HmacMD5">HMAC-MD5</SelectItem>
                  <SelectItem value="HmacSHA1">HMAC-SHA1</SelectItem>
                  <SelectItem value="HmacSHA256">HMAC-SHA256</SelectItem>
                  <SelectItem value="HmacSHA512">HMAC-SHA512</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateHmac} disabled={isProcessing} className="w-full">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              {isProcessing ? 'Generating...' : 'Generate HMAC'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>HMAC Output</CardTitle>
                <CardDescription>The generated HMAC in hex format.</CardDescription>
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
              className="font-mono h-[150px] text-sm bg-black/20"
              placeholder="HMAC result will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


