
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Fingerprint, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import CryptoJS from 'crypto-js';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('hello world');
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({ MD5: '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState<HashAlgorithm | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setInput('');
    }
  };

  const generateHashes = async () => {
    setIsProcessing(true);

    const wordArray = file
      ? CryptoJS.lib.WordArray.create(await file.arrayBuffer())
      : CryptoJS.enc.Utf8.parse(input);

    const generatedHashes = {
      MD5: CryptoJS.MD5(wordArray).toString(),
      'SHA-1': CryptoJS.SHA1(wordArray).toString(),
      'SHA-256': CryptoJS.SHA256(wordArray).toString(),
      'SHA-512': CryptoJS.SHA512(wordArray).toString(),
    };
    
    setHashes(generatedHashes);
    setIsProcessing(false);
  };
  
  const handleCopy = (text: string, algorithm: HashAlgorithm) => {
    navigator.clipboard.writeText(text);
    setCopied(algorithm);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Hash Generator</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files.
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
            <CardDescription>Enter text or upload a file to hash.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="file">File Input</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
                <Textarea
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setFile(null); }}
                  className="font-mono h-[200px] text-sm"
                  placeholder="Enter text..."
                />
              </TabsContent>
              <TabsContent value="file" className="mt-4">
                <Input type="file" onChange={handleFileChange} />
                {file && <p className="text-xs text-muted-foreground mt-2">Selected: {file.name}</p>}
              </TabsContent>
            </Tabs>
            <Button onClick={generateHashes} disabled={isProcessing} className="w-full mt-4">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
              {isProcessing ? 'Generating...' : 'Generate Hashes'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Generated Hashes</CardTitle>
            <CardDescription>The resulting hashes for your input.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo}>
                <label className="text-sm font-medium">{algo}</label>
                <div className="relative">
                  <Input readOnly value={hash} className="font-mono bg-black/20 pr-10" />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(hash, algo as HashAlgorithm)}>
                    {copied === algo ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


