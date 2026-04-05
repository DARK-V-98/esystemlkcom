
"use client";

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState('https://www.esystemlk.xyz');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (text.trim() === '') {
      setQrCodeUrl('');
      return;
    }
    QRCode.toDataURL(text, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error(err);
      });
  }, [text]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Create a QR code from any URL or text instantly.
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Enter Data</CardTitle>
            <CardDescription>Enter the text or URL to encode.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div>
                    <label htmlFor="content" className="text-sm font-medium">Text or URL</label>
                    <Input
                        id="content"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1"
                        placeholder="https://example.com"
                    />
                </div>
                <Button onClick={handleDownload} className="w-full" variant="hero" disabled={!qrCodeUrl}>
                    <Download className="mr-2 h-4 w-4" /> Download QR Code
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg h-full">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Your generated QR Code will appear below.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center aspect-square max-w-md mx-auto">
                  {qrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrCodeUrl} alt="Generated QR Code" className="w-full h-full" />
                  ) : (
                    <div className="text-center text-black">
                        <QrCode className="w-16 h-16 mx-auto mb-4" />
                        <p>QR Code will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
