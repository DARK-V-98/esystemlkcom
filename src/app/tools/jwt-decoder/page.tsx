
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface JwtPayload {
  header: object;
  payload: object;
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPart, setCopiedPart] = useState<'header' | 'payload' | null>(null);

  useEffect(() => {
    if (token.trim() === '') {
      setDecoded(null);
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT structure. A valid token must have three parts separated by dots.');
      }
      
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setDecoded({ header, payload });
      setError(null);
    } catch (e) {
      setDecoded(null);
      if (e instanceof Error) {
        setError(`Invalid token: ${e.message}. Please check the format.`);
      } else {
        setError('An unknown error occurred while decoding the token.');
      }
    }
  }, [token]);
  
  const handleCopy = (part: 'header' | 'payload') => {
    if (!decoded) return;
    
    const content = part === 'header' ? decoded.header : decoded.payload;
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    
    setCopiedPart(part);
    setTimeout(() => setCopiedPart(null), 2000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">JWT Decoder</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Paste a JSON Web Token to decode and inspect its header and payload.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Encoded Token</CardTitle>
            <CardDescription>Paste your JWT here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              className="font-mono h-80 text-xs"
            />
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Decoded Output</CardTitle>
            <CardDescription>The decoded header and payload.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-md flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
                 <p>{error}</p>
              </div>
            )}
            {decoded && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg text-primary">Header</h3>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy('header')}>
                      {copiedPart === 'header' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="text-sm bg-black/40 p-4 rounded-md max-h-60 overflow-auto font-mono">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg text-primary">Payload</h3>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy('payload')}>
                            {copiedPart === 'payload' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                  <pre className="text-sm bg-black/40 p-4 rounded-md max-h-60 overflow-auto font-mono">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
             {!error && !decoded && (
              <div className="text-center text-muted-foreground py-20">
                Decoded token will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


