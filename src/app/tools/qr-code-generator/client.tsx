
"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, QrCode, Palette, Settings, Image as ImageIcon, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('https://esystemlk.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrCodeUrl('');
      return;
    }

    setIsLoading(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(generateQRCode, 300);
    return () => clearTimeout(timeout);
  }, [text, fgColor, bgColor, size, margin]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `esystemlk-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded!');
    }
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('QR Image copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy image.');
    }
  };

  return (
    <ToolLayout 
      title="Advanced QR Code Generator" 
      description="Create beautiful, customized QR codes for your URL, text, or business. Customize colors, sizes, and error correction levels for maximum reliability."
      category="Utility"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden hover:border-[hsl(200,100%,50%,0.5)] hover:shadow-[0_0_20px_hsl(200,100%,50%,0.1)] transition-all">
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
              <CardDescription>Customize your QR code appearance and data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Content (URL or Text)</Label>
                <Input
                  id="content"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-gray-50 border-gray-200 h-12 focus:ring-primary/50"
                  placeholder="https://example.com"
                />
              </div>

              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-gray-200 p-1 rounded-xl">
                  <TabsTrigger value="style" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Palette className="w-4 h-4 mr-2" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="size" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    <Settings className="w-4 h-4 mr-2" />
                    Dimensions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="style" className="mt-4 space-y-4 p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Foreground Color</Label>
                      <div className="flex gap-3">
                        <Input 
                          type="color" 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-12 h-10 p-1 bg-gray-50 border-gray-200 rounded-md cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)}
                          className="flex-grow h-10 bg-gray-50 border-gray-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-3">
                        <Input 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 p-1 bg-gray-50 border-gray-200 rounded-md cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="flex-grow h-10 bg-gray-50 border-gray-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="size" className="mt-4 space-y-6 p-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Size ({size}x{size}px)</Label>
                    </div>
                    <Slider 
                      value={[size]} 
                      onValueChange={(val) => setSize(val[0])} 
                      min={128} 
                      max={1024} 
                      step={64} 
                      className="py-4"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Quiet Zone (Margin: {margin})</Label>
                    </div>
                    <Slider 
                      value={[margin]} 
                      onValueChange={(val) => setMargin(val[0])} 
                      min={0} 
                      max={10} 
                      step={1}
                      className="py-4"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={copyToClipboard} disabled={!qrCodeUrl} className="h-12 border-gray-200 hover:bg-white/5 gap-2">
                  {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  Copy Image
                </Button>
                <Button onClick={handleDownload} disabled={!qrCodeUrl} className="h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7">
          <Card className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden min-h-[500px] flex flex-col items-center justify-center relative p-8">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
            </div>
            
            <div className="max-w-xs w-full bg-white p-6 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-2xl">
                    <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                  </div>
                )}
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Customized QR Code" 
                    className="w-full h-full" 
                  />
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center text-slate-400">
                    <QrCode className="w-20 h-20 mb-4 opacity-20" />
                    <p className="text-sm">Scan preview will appear here</p>
                  </div>
                )}
            </div>
            <div className="mt-8 text-center bg-black/20 px-6 py-3 rounded-full border border-gray-200">
                <p className="text-xs text-gray-400 font-mono truncate max-w-[200px] md:max-w-md">
                   {text || 'Enter data to preview...'}
                </p>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}


