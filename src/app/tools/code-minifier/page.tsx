
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, FileCode, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { minify } from 'terser';

export default function CodeMinifierPage() {
  const [inputCode, setInputCode] = useState('// Paste your code here...\nfunction hello() {\n  console.log("Hello, World!");\n}');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMinify = async () => {
    setIsLoading(true);
    setError(null);
    setOutputCode('');

    try {
      if (language === 'javascript') {
        const result = await minify(inputCode, {
          mangle: true,
          compress: true,
        });
        if (result.code) {
          setOutputCode(result.code);
        } else {
          throw new Error('Minification failed.');
        }
      } else { // CSS and HTML minification (simple whitespace removal)
        let minified = inputCode
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // remove comments
          .replace(/\s+/g, ' ') // collapse whitespace
          .replace(/ *([{}|:;,]) */g, '$1') // remove space around delimiters
          .replace(/;}/g, '}'); // remove last semicolon
        setOutputCode(minified);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (outputCode) {
      navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const originalSize = new Blob([inputCode]).size;
  const minifiedSize = new Blob([outputCode]).size;
  const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Code Minifier</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Minify your JavaScript, CSS, and HTML code to reduce file size and improve load times.
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

      <div className="flex justify-center mb-6">
        <Tabs value={language} onValueChange={setLanguage} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Input Code</CardTitle>
            <CardDescription>Paste your code below and click Minify.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <Textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here..."
              className="font-mono h-[400px] text-sm flex-grow"
            />
            <Button onClick={handleMinify} disabled={isLoading} className="w-full mt-4">
              {isLoading ? 'Minifying...' : <><Wand2 className="mr-2 h-4 w-4" /> Minify Code</>}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Minified Output</CardTitle>
                <CardDescription>The compressed code appears here.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!outputCode}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="h-[400px] flex items-center justify-center text-center text-destructive bg-black/20 rounded-md p-4">
                <div>
                  <h4 className="font-bold">Minification Error</h4>
                  <pre className="text-xs whitespace-pre-wrap mt-2">{error}</pre>
                </div>
              </div>
            )}
            {!error && (
              <Textarea
                readOnly
                value={outputCode}
                className="font-mono h-[400px] text-sm bg-black/20"
                placeholder="Minified code will appear here..."
              />
            )}
            {outputCode && !error && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Original: <strong>{(originalSize / 1024).toFixed(2)} KB</strong> | 
                Minified: <strong>{(minifiedSize / 1024).toFixed(2)} KB</strong> | 
                Reduction: <strong className="text-primary">{reduction.toFixed(2)}%</strong>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


