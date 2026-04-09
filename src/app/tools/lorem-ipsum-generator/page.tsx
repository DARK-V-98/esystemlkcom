
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Type } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const words = loremIpsumText.split(' ');

export default function LoremIpsumGeneratorPage() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = '';
    switch (type) {
      case 'words':
        result = Array.from({ length: count }, (_, i) => words[i % words.length]).join(' ');
        break;
      case 'sentences':
        const sentences = loremIpsumText.split('. ');
        result = Array.from({ length: count }, (_, i) => sentences[i % sentences.length]).join('. ') + '.';
        break;
      case 'paragraphs':
        result = Array.from({ length: count }).map(() => loremIpsumText).join('\n\n');
        break;
    }
    setGeneratedText(result);
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Generate placeholder text for your designs and layouts.
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
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Set your generation options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="count">Amount</Label>
                <Input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10)))}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(v) => setType(v as any)} defaultValue={type}>
                  <SelectTrigger id="type" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={generateText} className="w-full">
              <Type className="mr-2 h-4 w-4" /> Generate Text
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Generated Text</CardTitle>
                <CardDescription>Your Lorem Ipsum placeholder text.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedText}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={generatedText}
              className="font-serif h-[300px] text-base bg-black/20 leading-relaxed"
              placeholder="Generated text will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


