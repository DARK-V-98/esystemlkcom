"use client";

import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function JsonCsvConverterPage() {
  const [inputData, setInputData] = useState('[{"id": 1, "name": "John Doe"}, {"id": 2, "name": "Jane Smith"}]');
  const [outputData, setOutputData] = useState('');
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    setOutputData('');
    try {
      if (mode === 'json-to-csv') {
        const json = JSON.parse(inputData);
        if (!Array.isArray(json)) {
          throw new Error('Input must be a JSON array of objects.');
        }
        const csv = Papa.unparse(json);
        setOutputData(csv);
      } else { // csv-to-json
        Papa.parse(inputData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError(`CSV Parsing Error: ${results.errors[0].message}`);
            } else {
              setOutputData(JSON.stringify(results.data, null, 2));
            }
          },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? `Invalid ${mode === 'json-to-csv' ? 'JSON' : 'CSV'}: ${e.message}` : 'An unknown error occurred.');
    }
  };

  const handleCopy = () => {
    if (outputData) {
      navigator.clipboard.writeText(outputData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const switchModes = () => {
    const newMode = mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv';
    setInputData(outputData);
    setOutputData(inputData);
    setMode(newMode);
    setError(null);
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">JSON &lt;&gt; CSV Converter</h1>
        <p className="text-white/80 md-text-xl mt-4 max-w-3xl mx-auto">
          Easily convert data between JSON and CSV formats.
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Input {mode === 'json-to-csv' ? 'JSON' : 'CSV'}</CardTitle>
            <CardDescription>Paste your data below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="font-mono h-[400px] text-sm"
              placeholder={mode === 'json-to-csv' ? '[{...}]' : 'header1,header2\nvalue1,value2'}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center gap-4 pt-10">
            <Button onClick={handleConvert} size="lg">
                <RefreshCw className="mr-2 h-4 w-4" /> Convert
            </Button>
            <Button onClick={switchModes} variant="outline" size="icon" title="Switch Conversion Direction">
                <RefreshCw className="h-4 w-4" />
            </Button>
        </div>

        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Output {mode === 'json-to-csv' ? 'CSV' : 'JSON'}</CardTitle>
                    <CardDescription>Converted data appears here.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!outputData}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="h-[400px] flex items-center justify-center text-center text-destructive bg-black/20 rounded-md p-4">
                <p>{error}</p>
              </div>
            )}
            {!error && (
                <Textarea
                    readOnly
                    value={outputData}
                    className="font-mono h-[400px] text-sm bg-black/20"
                    placeholder="Result will be shown here..."
                />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}