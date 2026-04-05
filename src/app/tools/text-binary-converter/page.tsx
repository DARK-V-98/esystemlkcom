
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TextBinaryConverterPage() {
  const [input, setInput] = useState('Hello');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textToBinary = (text: string) => {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  };
  
  const binaryToText = (binary: string) => {
    return binary.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');
  };

  const handleEncode = () => {
    setError(null);
    try {
      setOutput(textToBinary(input));
    } catch (e) {
      setError("Error encoding text.");
      setOutput("");
    }
  };
  
  const handleDecode = () => {
    setError(null);
    try {
      // Clean up input
      const cleanedInput = input.replace(/[^01\s]/g, '');
      if (/[^01\s]/.test(input)) {
        setError("Invalid characters found. Only 0, 1, and spaces are allowed for decoding.");
      }
      setOutput(binaryToText(cleanedInput));
    } catch (e) {
      setError("Error: Invalid Binary string. Ensure it's space-separated 8-bit binary.");
      setOutput("");
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
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Text to Binary Converter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert text to its binary representation and back.
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
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter text to encode or binary to decode.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-[300px] text-sm"
              placeholder="Enter text or binary code..."
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button onClick={handleEncode}>Text to Binary</Button>
              <Button onClick={handleDecode} variant="secondary">Binary to Text</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Output</CardTitle>
                <CardDescription>The result of the conversion.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
            {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
