
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';

type CaseType = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'UPPER_CASE' | 'lower case';

const toCamelCase = (str: string) => str.replace(/([-_ \s]\w)/g, g => g.toUpperCase().replace(/[-_ \s]/g, ''));
const toPascalCase = (str: string) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};
const toSnakeCase = (str: string) => str.replace(/([A-Z])/g, '_$1').replace(/[- \s]/g, '_').toLowerCase().replace(/^_/, '');
const toKebabCase = (str: string) => str.replace(/([A-Z])/g, '-$1').replace(/[_ \s]/g, '-').toLowerCase().replace(/^-/, '');

export default function CaseConverterPage() {
  const [input, setInput] = useState('hello world example');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCase = (type: CaseType) => {
    switch (type) {
      case 'camelCase': setOutput(toCamelCase(input)); break;
      case 'PascalCase': setOutput(toPascalCase(input)); break;
      case 'snake_case': setOutput(toSnakeCase(input)); break;
      case 'kebab-case': setOutput(toKebabCase(input)); break;
      case 'UPPER_CASE': setOutput(input.toUpperCase()); break;
      case 'lower case': setOutput(input.toLowerCase()); break;
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const caseButtons: { label: string, type: CaseType }[] = [
      { label: 'camelCase', type: 'camelCase' },
      { label: 'PascalCase', type: 'PascalCase' },
      { label: 'snake_case', type: 'snake_case' },
      { label: 'kebab-case', type: 'kebab-case' },
      { label: 'UPPER CASE', type: 'UPPER_CASE' },
      { label: 'lower case', type: 'lower case' },
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Case Converter</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert text between different common case formats.
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
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter the text you want to convert.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono h-[200px] text-sm"
              placeholder="Enter text..."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {caseButtons.map(({ label, type }) => (
                <Button key={type} onClick={() => convertCase(type)} variant="secondary">{label}</Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Output</CardTitle>
                <CardDescription>The converted text.</CardDescription>
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
              className="font-mono h-[200px] text-sm bg-black/20"
              placeholder="Result will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


