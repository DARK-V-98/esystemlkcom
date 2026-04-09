
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Check, Settings, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const charset = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?',
};

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let availableChars = '';
    if (includeUppercase) availableChars += charset.uppercase;
    if (includeLowercase) availableChars += charset.lowercase;
    if (includeNumbers) availableChars += charset.numbers;
    if (includeSymbols) availableChars += charset.symbols;

    if (availableChars.length === 0) {
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      newPassword += availableChars[randomIndex];
    }
    setPassword(newPassword);
  };
  
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Password Generator</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Create strong, secure, and random passwords to protect your accounts.
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
          <CardTitle>Generated Password</CardTitle>
          <CardDescription>Use the options below to customize your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Input
              readOnly
              value={password}
              className="h-14 text-lg font-mono pr-24"
              placeholder="Your password appears here..."
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" onClick={generatePassword}>
                    <RefreshCw className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-medium">Password Length</label>
                <span className="text-primary font-bold text-lg">{length}</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={8}
                max={64}
                step={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-md">
                    <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(c) => setIncludeUppercase(c as boolean)} />
                    <label htmlFor="uppercase" className="text-sm font-medium leading-none">
                        Include Uppercase (A-Z)
                    </label>
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-md">
                    <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(c) => setIncludeLowercase(c as boolean)} />
                    <label htmlFor="lowercase" className="text-sm font-medium leading-none">
                        Include Lowercase (a-z)
                    </label>
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-md">
                    <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(c) => setIncludeNumbers(c as boolean)} />
                    <label htmlFor="numbers" className="text-sm font-medium leading-none">
                        Include Numbers (0-9)
                    </label>
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-md">
                    <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(c) => setIncludeSymbols(c as boolean)} />
                    <label htmlFor="symbols" className="text-sm font-medium leading-none">
                        Include Symbols (!@#$)
                    </label>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


