
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Plus, Trash2, Globe, FileCode, History, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

interface FormData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body: string;
  headers: { key: string; value: string }[];
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
}

export default function ApiTesterClient() {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      body: '',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers"
  });

  const method = watch('method');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    const startTime = Date.now();

    try {
      const requestHeaders = new Headers();
      data.headers.forEach(header => {
        if (header.key && header.value) {
          requestHeaders.append(header.key, header.value);
        }
      });

      const options: RequestInit = {
        method: data.method,
        headers: requestHeaders,
      };

      if (data.method !== 'GET' && data.body) {
        options.body = data.body;
      }

      const res = await fetch(data.url, options);
      const endTime = Date.now();

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseBody = await res.json();
      } else {
        responseBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      });
      toast.success(`Request completed in ${endTime - startTime}ms`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(msg);
      if (msg.includes('CORS') || msg.includes('Failed to fetch')) {
        toast.error('Network Error: Likely a CORS restriction on the requested domain.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="Advanced API Tester" 
      description="Test your REST APIs instantly from your browser. Send GET, POST, and other HTTP requests with custom headers and bodies. A lightweight alternative to Postman."
      category="Web Development"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Request Side */}
        <div className="lg:col-span-6 space-y-6">
           <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-[hsl(200,100%,50%,0.5)] hover:shadow-[0_0_20px_hsl(200,100%,50%,0.1)] transition-all flex flex-col h-full">
            <CardHeader className="pb-4">
               <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle>HTTP Request</CardTitle>
               </div>
               <CardDescription>Select method, enter URL, and configure headers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex gap-2">
                     <Select name="method" onValueChange={(value) => setValue('method', value as any)} defaultValue="GET">
                        <SelectTrigger className="w-[120px] h-12 bg-gray-50 border-gray-200 font-bold">
                           <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-gray-200">
                           {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                             <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <Input 
                        {...register('url')} 
                        placeholder="https://api.example.com/endpoint" 
                        required 
                        className="h-12 bg-gray-50 border-gray-200"
                     />
                  </div>

                  <Tabs defaultValue="headers" className="w-full">
                     <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-gray-200 p-1 rounded-xl">
                        <TabsTrigger value="headers" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                           Headers ({fields.length})
                        </TabsTrigger>
                        <TabsTrigger value="body" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary" disabled={method === 'GET'}>
                           Body
                        </TabsTrigger>
                     </TabsList>

                     <TabsContent value="headers" className="mt-4 space-y-3 p-1">
                        {fields.map((field, index) => (
                           <div key={field.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                              <Input {...register(`headers.${index}.key`)} placeholder="Header Key" className="h-9 bg-gray-50 border-gray-200 text-xs" />
                              <Input {...register(`headers.${index}.value`)} placeholder="Value" className="h-9 bg-gray-50 border-gray-200 text-xs" />
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-black/40">
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                        <Button type="button" variant="ghost" size="sm" onClick={() => append({ key: '', value: '' })} className="text-xs h-8 hover:bg-white/5">
                           <Plus className="mr-2 h-3 w-3" /> Add Header
                        </Button>
                     </TabsContent>

                     <TabsContent value="body" className="mt-4 p-1">
                        <Textarea 
                           {...register('body')} 
                           placeholder='{ "key": "value" }' 
                           className="font-mono text-sm bg-gray-50 border-gray-200 min-h-[200px]"
                        />
                     </TabsContent>
                  </Tabs>

                  <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold">
                     {isLoading ? (
                       <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                     ) : (
                       <Send className="mr-2 w-5 h-5" />
                     )}
                     {isLoading ? 'Processing Request...' : 'Send Request'}
                  </Button>
               </form>

               <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/70 leading-relaxed">
                     <p className="font-bold text-amber-500 mb-1 leading-tight uppercase tracking-tighter">CORS RESTRICTION NOTICE</p>
                     Most public APIs restrict requests from unknown domains for security. If your request fails with "Failed to fetch", it's likely a CORS policy.
                  </div>
               </div>
            </CardContent>
           </Card>
        </div>

        {/* Response Side */}
        <div className="lg:col-span-6 space-y-6">
           <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                 <div>
                    <CardTitle className="flex items-center gap-2">
                       <FileCode className="w-5 h-5 text-purple-400" />
                       Response
                    </CardTitle>
                    <CardDescription>Live output from your API endpoint.</CardDescription>
                 </div>
                 {response && (
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-gray-200">
                        <span className={`w-2 h-2 rounded-full ${response.status >= 200 && response.status < 300 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{response.status} {response.statusText}</span>
                    </div>
                 )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-0">
                 <div className="flex-grow bg-gray-50 font-mono text-sm p-8 overflow-auto max-h-[660px] border-t border-gray-200">
                    {isLoading ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4">
                         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-gray-600 animate-pulse">Awaiting Server Response...</p>
                      </div>
                    ) : error ? (
                      <div className="h-full flex flex-col items-center justify-center p-8 bg-red-500/5">
                         <ShieldAlert className="w-12 h-12 text-red-500 mb-4 opacity-50" />
                         <h3 className="text-red-400 font-bold mb-2">Network Error</h3>
                         <pre className="text-xs text-red-300 bg-red-950/20 p-4 rounded-lg border border-red-500/10 max-w-full overflow-auto text-center italic">{error}</pre>
                      </div>
                    ) : response ? (
                      <div className="space-y-6">
                         <div className="flex gap-4">
                           <div className="bg-green-500/10 px-3 py-1 rounded border border-green-500/20">
                             <p className="text-[9px] uppercase font-black text-green-500/80">Time</p>
                             <p className="text-xs font-bold">{response.time}ms</p>
                           </div>
                         </div>
                         <Tabs defaultValue="body">
                           <TabsList className="bg-black/60 border border-gray-200 p-1 rounded-lg">
                              <TabsTrigger value="body" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">Body</TabsTrigger>
                              <TabsTrigger value="headers" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">Headers</TabsTrigger>
                           </TabsList>
                           <TabsContent value="body" className="mt-4 animate-in fade-in duration-500">
                             <pre className="text-purple-200/80 leading-relaxed">
                                {typeof response.body === 'object' ? JSON.stringify(response.body, null, 2) : response.body}
                             </pre>
                           </TabsContent>
                           <TabsContent value="headers" className="mt-4 animate-in fade-in duration-500">
                             <pre className="text-purple-200/80 leading-relaxed">
                                {JSON.stringify(response.headers, null, 2)}
                             </pre>
                           </TabsContent>
                         </Tabs>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 italic p-12 text-center">
                         <Send className="w-20 h-20 mb-6 opacity-10" />
                         <p className="text-lg font-medium">Ready for Testing</p>
                         <p className="text-xs">Configure your request and hit 'Send' to see details here.</p>
                      </div>
                    )}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </ToolLayout>
  );
}


