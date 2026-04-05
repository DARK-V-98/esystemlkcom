
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
}

export default function ApiTesterPage() {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      method: 'GET',
      url: '',
      body: '',
      headers: [{ key: '', value: '' }],
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

    try {
      const requestHeaders = new Headers();
      data.headers.forEach(header => {
        if (header.key && header.value) {
          requestHeaders.append(header.key, header.value);
        }
      });
      // Ensure Content-Type is set for methods with a body, if not already provided
      if (data.method !== 'GET' && data.body && !requestHeaders.has('Content-Type')) {
        requestHeaders.append('Content-Type', 'application/json');
      }

      const options: RequestInit = {
        method: data.method,
        headers: requestHeaders,
      };

      if (data.method !== 'GET' && data.body) {
        options.body = data.body;
      }

      const res = await fetch(data.url, options);

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
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">API Tester</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          A lightweight, browser-based client to test your API endpoints.
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
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>Configure and send your HTTP request.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex gap-2">
                <Select name="method" onValueChange={(value) => setValue('method', value as any)} defaultValue="GET">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input {...register('url')} placeholder="https://api.example.com/data" required />
              </div>
              
              <Tabs defaultValue="body">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body" className="mt-4">
                     {method !== 'GET' && (
                        <Textarea
                          {...register('body')}
                          id="body"
                          placeholder='{ "key": "value" }'
                          className="font-mono"
                          rows={8}
                        />
                      )}
                      {method === 'GET' && (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm bg-black/20 rounded-md">
                          Request body is not used for GET requests.
                        </div>
                      )}
                  </TabsContent>
                  <TabsContent value="headers" className="mt-4 space-y-2">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center">
                          <Input {...register(`headers.${index}.key`)} placeholder="Header Name" />
                          <Input {...register(`headers.${index}.value`)} placeholder="Header Value" />
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ key: '', value: '' })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Header
                      </Button>
                  </TabsContent>
              </Tabs>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Request</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>View the response from the server.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="bg-destructive/20 border border-destructive text-destructive p-4 rounded-md">
                <h4 className="font-bold">Error</h4>
                <pre className="text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            )}
            {response && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    Status: {response.status} {response.statusText}
                  </span>
                </div>
                <Tabs defaultValue="body">
                  <TabsList>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body" className="mt-4">
                    <pre className="text-sm bg-black/40 p-4 rounded-md max-h-96 overflow-auto font-mono">
                      {typeof response.body === 'object' ? JSON.stringify(response.body, null, 2) : response.body}
                    </pre>
                  </TabsContent>
                  <TabsContent value="headers" className="mt-4">
                    <pre className="text-sm bg-black/40 p-4 rounded-md max-h-96 overflow-auto font-mono">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            {!isLoading && !error && !response && (
              <div className="text-center text-muted-foreground py-16">
                Send a request to see the response here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
