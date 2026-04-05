
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Lock, Server, Calendar, User, Building } from 'lucide-react';
import Link from 'next/link';

interface SslInfo {
  subject: {
    CN?: string;
    O?: string;
    L?: string;
    ST?: string;
    C?: string;
  };
  issuer: {
    CN?: string;
    O?: string;
    C?: string;
  };
  valid_from: string;
  valid_to: string;
  expires_in_days: number;
}

export default function SslCheckerPage() {
  const [domain, setDomain] = useState('');
  const [sslInfo, setSslInfo] = useState<SslInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSslInfo(null);

    try {
      const response = await fetch(`/api/ssl-check?domain=${domain}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch SSL certificate information.');
      }
      const data = await response.json();
      setSslInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'text-destructive';
    if (days < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">SSL Certificate Checker</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Enter a domain to check its SSL certificate details, including expiry date and issuer.
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

      <Card className="max-w-2xl mx-auto bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Check Domain SSL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="h-12 text-lg"
              required
            />
            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
              Check
            </Button>
          </form>

          {error && <p className="text-destructive text-center p-4 bg-destructive/10 rounded-md">{error}</p>}
          
          {sslInfo && (
            <div className="space-y-4 animate-fade-in">
              <Card className="bg-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary"><Lock className="w-5 h-5"/> Certificate Status</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className={`text-xl font-bold ${getStatusColor(sslInfo.expires_in_days)}`}>
                    {sslInfo.expires_in_days > 0 
                      ? `Expires in ${sslInfo.expires_in_days} days` 
                      : `Expired ${Math.abs(sslInfo.expires_in_days)} days ago`}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-black/20">
                   <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4"/> Subject</CardTitle></CardHeader>
                   <CardContent className="text-sm space-y-1 font-mono">
                     {sslInfo.subject.CN && <p><strong>CN:</strong> {sslInfo.subject.CN}</p>}
                     {sslInfo.subject.O && <p><strong>O:</strong> {sslInfo.subject.O}</p>}
                     {sslInfo.subject.L && <p><strong>L:</strong> {sslInfo.subject.L}</p>}
                   </CardContent>
                </Card>
                 <Card className="bg-black/20">
                   <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="w-4 h-4"/> Issuer</CardTitle></CardHeader>
                   <CardContent className="text-sm space-y-1 font-mono">
                     {sslInfo.issuer.CN && <p><strong>CN:</strong> {sslInfo.issuer.CN}</p>}
                     {sslInfo.issuer.O && <p><strong>O:</strong> {sslInfo.issuer.O}</p>}
                     {sslInfo.issuer.C && <p><strong>C:</strong> {sslInfo.issuer.C}</p>}
                   </CardContent>
                </Card>
              </div>

               <Card className="bg-black/20">
                   <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="w-4 h-4"/> Validity Period</CardTitle></CardHeader>
                   <CardContent className="text-sm space-y-2 font-mono">
                      <p><strong>Valid From:</strong> {new Date(sslInfo.valid_from).toLocaleString()}</p>
                      <p><strong>Valid To:</strong> {new Date(sslInfo.valid_to).toLocaleString()}</p>
                   </CardContent>
                </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
