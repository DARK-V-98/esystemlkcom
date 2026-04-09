
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Hash } from 'lucide-react';
import Link from 'next/link';

type Base = 'Binary' | 'Octal' | 'Decimal' | 'Hexadecimal';
const bases: Record<Base, number> = {
  Binary: 2,
  Octal: 8,
  Decimal: 10,
  Hexadecimal: 16,
};

export default function NumberBaseConverterPage() {
  const [values, setValues] = useState<Record<Base, string>>({
    Binary: '11010100',
    Octal: '324',
    Decimal: '212',
    Hexadecimal: 'd4',
  });
  const [lastChanged, setLastChanged] = useState<Base>('Decimal');
  const [copied, setCopied] = useState<Base | null>(null);

  useEffect(() => {
    const convert = () => {
      const fromValue = values[lastChanged];
      const fromBase = bases[lastChanged];
      
      if (fromValue.trim() === '') {
        const emptyValues = Object.keys(bases).reduce((acc, b) => ({...acc, [b as Base]: ''}), {} as Record<Base, string>);
        setValues(emptyValues);
        return;
      }

      try {
        const decimalValue = parseInt(fromValue, fromBase);
        if (isNaN(decimalValue)) {
          // Keep other fields as they are, just mark this one as invalid (visual only)
          return;
        }

        setValues({
          Binary: decimalValue.toString(2),
          Octal: decimalValue.toString(8),
          Decimal: decimalValue.toString(10),
          Hexadecimal: decimalValue.toString(16),
        });
      } catch (e) {
        // Handle potential errors with large numbers, etc.
      }
    };
    convert();
  }, [values[lastChanged], lastChanged]);

  const handleValueChange = (base: Base, value: string) => {
    setLastChanged(base);
    setValues(prev => ({...prev, [base]: value}));
  };
  
  const handleCopy = (base: Base) => {
    navigator.clipboard.writeText(values[base]);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Number Base Converter</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert numbers between Binary, Octal, Decimal, and Hexadecimal.
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

      <Card className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Converter</CardTitle>
          <CardDescription>Edit any field to see the live conversion in others.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(bases).map(base => (
            <div key={base}>
              <label htmlFor={base.toLowerCase()} className="text-sm font-medium">{base} (Base {bases[base as Base]})</label>
              <div className="relative">
                <Input
                  id={base.toLowerCase()}
                  value={values[base as Base]}
                  onChange={(e) => handleValueChange(base as Base, e.target.value)}
                  className="font-mono mt-1 pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(base as Base)}>
                  {copied === base ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


