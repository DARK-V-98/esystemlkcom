
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Server, CheckCircle, XCircle, Globe, Zap, ShieldAlert, Monitor, Clock } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

interface UptimeResult {
  status: 'online' | 'offline';
  statusCode?: number;
  responseTime?: number;
}

export default function UptimeCheckerClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<UptimeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/uptime-check?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check URL.');
      }
      const data = await response.json();
      setResult(data);
      if (data.status === 'online') {
          toast.success('Website is reachable!');
      } else {
          toast.error('Website appears to be offline.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Advanced Website Uptime Checker" 
      description="Instantly verify if your website is online and responsive world-wide. Get real-time status codes and response metrics to ensure your 24/7 web presence."
      category="Web Monitoring"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all p-4 md:p-8">
           <CardContent className="space-y-10">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                 <div className="relative flex-grow">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 select-none">https://</div>
                   <Input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="example.com"
                      className="h-16 pl-20 text-xl font-black bg-gray-50 border-gray-200 rounded-2xl focus:ring-primary/50"
                      required
                   />
                 </div>
                 <Button type="submit" disabled={isLoading} className="h-16 px-10 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl">
                   {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Monitor className="w-6 h-6 mr-2" />}
                   CHECK STATUS
                 </Button>
              </form>

              {!isLoading && !error && !result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-gray-200">
                        <Zap className="w-10 h-10 text-primary" />
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Speed</p>
                            <p className="text-sm font-bold">Real-time Check</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-gray-200">
                        <Globe className="w-10 h-10 text-primary" />
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Global</p>
                            <p className="text-sm font-bold">Worldwide Node</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-gray-200">
                        <ShieldAlert className="w-10 h-10 text-primary" />
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Privacy</p>
                            <p className="text-sm font-bold">Encrypted</p>
                        </div>
                    </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-500">
                   <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                   <h3 className="text-2xl font-black text-red-400 uppercase tracking-tighter mb-2">Check Failed</h3>
                   <p className="text-sm text-red-300/70 italic max-w-md">{error}</p>
                </div>
              )}
              
              {result && (
                <div className={`p-10 rounded-[2rem] border transition-all animate-in zoom-in-95 duration-500 relative overflow-hidden ${
                   result.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/20'
                }`}>
                   <div className="absolute -right-20 -top-20 opacity-5">
                      {result.status === 'online' ? <CheckCircle className="w-64 h-64" /> : <XCircle className="w-64 h-64" />}
                   </div>
                   
                   <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center p-6 ${
                         result.status === 'online' ? 'border-emerald-500 bg-emerald-500/20' : 'border-red-500 bg-red-500/20'
                      }`}>
                         {result.status === 'online' ? <CheckCircle className="w-full h-full text-emerald-400" /> : <XCircle className="w-full h-full text-red-400" />}
                      </div>
                      
                      <div className="text-center md:text-left flex-grow">
                         <h3 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${
                            result.status === 'online' ? 'text-emerald-400' : 'text-red-400'
                         }`}>
                           WEBSITE IS {result.status}
                         </h3>
                         <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <div className="bg-black/40 px-4 py-2 rounded-xl border border-gray-200 flex flex-col">
                               <p className="text-[9px] uppercase font-black text-gray-400">Status Code</p>
                               <p className="text-xl font-bold">{result.statusCode || '???'}</p>
                            </div>
                            {result.responseTime && (
                               <div className="bg-black/40 px-4 py-2 rounded-xl border border-gray-200 flex flex-col">
                                  <p className="text-[9px] uppercase font-black text-gray-400">Response Time</p>
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-4 h-4 text-primary" />
                                     <p className="text-xl font-bold">{result.responseTime} ms</p>
                                  </div>
                               </div>
                            )}
                            <div className="bg-black/40 px-4 py-2 rounded-xl border border-gray-200 flex flex-col">
                               <p className="text-[9px] uppercase font-black text-gray-400">Last Checked</p>
                               <p className="text-sm font-bold mt-1">Just Now</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </CardContent>
        </Card>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200 rounded-2xl p-8 group hover:bg-primary/5 transition-all">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    How it works
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Our server sends a lightweight HEAD request to your website to check if it's reachable. We measure the time it takes for the server to reply and verify the HTTP status code (like 200 OK or 404 Not Found).
                </p>
            </Card>
            <Card className="bg-white border border-gray-200 rounded-2xl p-8 group hover:bg-primary/5 transition-all">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Common Issues
                </h4>
                <ul className="text-sm text-gray-500 list-disc pl-5 space-y-2">
                    <li><strong>Network Block:</strong> Some firewalls block automated pings.</li>
                    <li><strong>Protocol:</strong> Ensure you use the correct https:// prefix.</li>
                    <li><strong>Timeout:</strong> Slow servers may time out our 5-second check.</li>
                </ul>
            </Card>
        </div>
      </div>
    </ToolLayout>
  );
}


