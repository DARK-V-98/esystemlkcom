
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Clock, Pilcrow, Type } from 'lucide-react';
import Link from 'next/link';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const characterCount = text.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed of 200 WPM

    return { wordCount, characterCount, readingTime };
  }, [text]);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Word & Character Counter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Analyze your text for word count, character count, and estimated reading time.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg h-full">
              <CardHeader>
                <CardTitle>Your Text</CardTitle>
                <CardDescription>Paste your text below to get instant analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="font-serif h-[400px] text-base leading-relaxed"
                  placeholder="Start writing or paste your text here..."
                />
              </CardContent>
            </Card>
        </div>
        
        <div className="space-y-6">
             <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analysis</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Pilcrow className="w-5 h-5 text-primary" />
                                <span>Word Count</span>
                            </div>
                            <span className="font-bold text-lg">{stats.wordCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Type className="w-5 h-5 text-primary" />
                                <span>Character Count</span>
                            </div>
                            <span className="font-bold text-lg">{stats.characterCount}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>Reading Time</span>
                            </div>
                            <span className="font-bold text-lg">~{stats.readingTime} min</span>
                        </div>
                    </div>
                 </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}
