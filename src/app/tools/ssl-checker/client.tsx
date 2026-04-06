
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ShieldAlert, Loader2, Globe, Clock, CheckCircle2, Lock, ExternalLink, Calendar, Server } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

interface SslResult {
  subject: { CN: string; O?: string; OU?: string };
  issuer: { CN: string; O?: string; OU?: string };
  valid_from: string;
  valid_to: string;
  expires_in_days: number;
}

export default function SslCheckerClient() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<SslResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      toast.error('Please enter a domain name.');
      return;
    }
    
    // Simple sanitization
    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/ssl-check?domain=${encodeURIComponent(cleanDomain)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check SSL certificate.');
      }
      const data = await response.json();
      setResult(data);
      toast.success('SSL Certificate retrieved!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Advanced SSL Certificate Checker" 
      description="Inspect any website's SSL certificate details. Check expiry dates, issuing authority, and cryptographic strength to ensure your site is secure and trusted."
      category="Security Tools"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:border-primary/20 transition-all p-4 md:p-10">
           <CardContent className="space-y-10">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                 <div className="relative flex-grow">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                   </div>
                   <Input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="esystemlk.com"
                      className="h-16 pl-14 text-xl font-black bg-black/20 border-white/5 rounded-2xl focus:ring-primary/50"
                      required
                   />
                 </div>
                 <Button type="submit" disabled={isLoading} className="h-16 px-10 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl gap-3">
                   {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                   CHECK SSL
                 </Button>
              </form>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-500">
                   <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-30" />
                   <h3 className="text-2xl font-black text-red-400 uppercase tracking-tighter mb-2">Verification Failed</h3>
                   <p className="text-sm text-red-300/70 italic max-w-sm">{error}</p>
                </div>
              )}
              
              {result && (
                <div className="space-y-8 animate-in zoom-in-95 duration-700">
                   {/* Status Badge */}
                   <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden transition-all ${
                      result.expires_in_days > 15 ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/20'
                   }`}>
                      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                         <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center text-center ${
                            result.expires_in_days > 15 ? 'border-emerald-500 bg-emerald-500/20' : 'border-red-500 bg-red-500/20'
                         }`}>
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Expires in</span>
                            <span className="text-4xl font-black tracking-tighter">{result.expires_in_days}</span>
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Days</span>
                         </div>
                         
                         <div className="text-center md:text-left space-y-4">
                            <h3 className={`text-4xl font-black uppercase tracking-tighter ${
                               result.expires_in_days > 15 ? 'text-emerald-400' : 'text-red-400 font-bold'
                            }`}>
                               {result.expires_in_days > 15 ? 'SSL IS HEALTHY' : 'SSL EXPIRES SOON'}
                            </h3>
                            <div className="flex flex-col gap-2">
                               <p className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm">
                                  <Globe className="w-4 h-4" /> Domain: <span className="font-bold text-white">{result.subject.CN}</span>
                               </p>
                               <p className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm">
                                  <ShieldCheck className="w-4 h-4" /> Issuer: <span className="font-bold text-white">{result.issuer.CN}</span>
                               </p>
                            </div>
                         </div>
                      </div>
                      <div className="absolute right-0 top-0 p-8 transform rotate-12 opacity-5 pointer-events-none">
                         <ShieldCheck className="w-64 h-64" />
                      </div>
                   </div>

                   {/* Grid Details */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-black/20 border border-white/5 rounded-3xl p-8 space-y-4">
                         <div className="flex items-center gap-3 mb-2 underline underline-offset-8 decoration-primary/30">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h4 className="font-black uppercase tracking-widest text-xs">Validity Period</h4>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] text-white/30 uppercase font-bold">Valid From</p>
                               <p className="text-sm font-bold">{new Date(result.valid_from).toLocaleDateString()}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-white/30 uppercase font-bold">Valid Until</p>
                               <p className="text-sm font-bold text-red-400/80">{new Date(result.valid_to).toLocaleDateString()}</p>
                            </div>
                         </div>
                      </Card>

                      <Card className="bg-black/20 border border-white/5 rounded-3xl p-8 space-y-4">
                         <div className="flex items-center gap-3 mb-2 underline underline-offset-8 decoration-purple-500/30">
                            <Server className="w-5 h-5 text-purple-400" />
                            <h4 className="font-black uppercase tracking-widest text-xs">Subject Info</h4>
                         </div>
                         <div>
                            <p className="text-[10px] text-white/30 uppercase font-bold">Organization</p>
                            <p className="text-sm font-bold truncate">{result.subject.O || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-white/30 uppercase font-bold">Common Name</p>
                            <p className="text-sm font-bold truncate">{result.subject.CN}</p>
                         </div>
                      </Card>
                   </div>
                </div>
              )}
           </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="text-center space-y-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 group transition-all hover:bg-primary/5">
                <div className="inline-block p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform"><Lock className="w-8 h-8 text-primary" /></div>
                <h4 className="text-xl font-bold">Bank-Grade</h4>
                <p className="text-sm text-white/50">Details including cryptographical strength and issuer chain validation.</p>
            </div>
            <div className="text-center space-y-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 group transition-all hover:bg-primary/5">
                <div className="inline-block p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform"><Clock className="w-8 h-8 text-primary" /></div>
                <h4 className="text-xl font-bold">Instant</h4>
                <p className="text-sm text-white/50">Quick scanning of any public domain over port 443 with SNI support.</p>
            </div>
            <div className="text-center space-y-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 group transition-all hover:bg-primary/5">
                <div className="inline-block p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 className="w-8 h-8 text-primary" /></div>
                <h4 className="text-xl font-bold">Verified</h4>
                <p className="text-sm text-white/50">Comprehensive sanity checks to protect your visitors and SEO ranking.</p>
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
