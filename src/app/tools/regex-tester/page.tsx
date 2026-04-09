
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Regex as RegexIcon, TestTube } from 'lucide-react';
import Link from 'next/link';

export default function RegexTesterPage() {
  const [regex, setRegex] = useState('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('Contact us at support@example.com or for sales, use sales.team@example.co.uk. Invalid: user@.com.');
  const [highlighted, setHighlighted] = useState<React.ReactNode>('');

  const matches = useMemo(() => {
    try {
      const re = new RegExp(regex, flags);
      const matches = Array.from(testString.matchAll(re));
      return matches;
    } catch (e) {
      return [];
    }
  }, [regex, flags, testString]);

  useEffect(() => {
    try {
      const re = new RegExp(regex, flags.includes('g') ? flags : flags + 'g');
      let lastIndex = 0;
      const parts: React.ReactNode[] = [];
      
      testString.replace(re, (match, ...args) => {
        const offset = args[args.length - 2];
        // Text before match
        if (offset > lastIndex) {
          parts.push(testString.substring(lastIndex, offset));
        }
        // The match itself
        parts.push(<mark key={offset} className="bg-primary/30 text-foreground rounded">{match}</mark>);
        lastIndex = offset + match.length;
        return match; // Required for .replace
      });

      // Text after the last match
      if (lastIndex < testString.length) {
        parts.push(testString.substring(lastIndex));
      }
      
      setHighlighted(parts);
    } catch (e) {
      setHighlighted(<span className="text-destructive">{e instanceof Error ? e.message : 'Invalid Regex'}</span>);
    }
  }, [regex, flags, testString]);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Regex Tester</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Test and debug your regular expressions with live matching.
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

      <div className="space-y-8">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Regular Expression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <span className="flex items-center justify-center text-muted-foreground bg-black/20 px-4 rounded-l-md border border-r-0 border-border">/</span>
              <Input
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Enter your regex"
                className="font-mono text-base flex-1 rounded-none"
              />
              <span className="flex items-center justify-center text-muted-foreground bg-black/20 px-2 rounded-r-md border border-l-0 border-border">/</span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
                placeholder="flags"
                className="w-20 font-mono text-base"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Test String</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative">
                <Textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter the string to test against"
                    className="font-mono text-lg leading-relaxed h-60 resize-none bg-transparent"
                />
                <div className="absolute inset-0 p-3 font-mono text-lg leading-relaxed text-transparent pointer-events-none whitespace-pre-wrap">
                    {highlighted}
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Match Information</CardTitle>
            <CardDescription>{matches.length} match(es) found.</CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {matches.map((match, i) => (
                        <div key={i} className="p-4 bg-black/20 rounded-md">
                            <h4 className="font-bold text-primary">Match {i + 1}</h4>
                            <p className="font-mono text-sm break-all"><strong>Full match:</strong> "{match[0]}"</p>
                            {match.length > 1 && (
                                <div className="mt-2">
                                    <p className="font-semibold text-xs">Groups:</p>
                                    <ul className="list-disc list-inside text-xs">
                                        {match.slice(1).map((group, j) => (
                                            <li key={j} className="font-mono break-all">Group {j + 1}: "{group}"</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    No matches found.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


