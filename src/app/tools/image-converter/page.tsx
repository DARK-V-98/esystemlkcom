
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ImageConverterPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSourceFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const convertAndDownload = () => {
    if (!sourceFile) {
      setError('Please select an image first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const fileName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.'));
              a.download = `${fileName}.${targetFormat}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } else {
              setError('Failed to convert image.');
            }
            setIsProcessing(false);
          }, `image/${targetFormat}`, 0.95);
        }
      };
      img.onerror = () => {
        setError('Failed to load image.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
        setError('Failed to read file.');
        setIsProcessing(false);
    }
    reader.readAsDataURL(sourceFile);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Image Converter</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert images between JPG, PNG, and WEBP formats right in your browser.
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
          <CardTitle>Convert Image</CardTitle>
          <CardDescription>Your image is processed locally and never uploaded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">Source Image</label>
            <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {previewUrl && (
            <div className="p-4 bg-black/20 rounded-lg">
              <img src={previewUrl} alt="Preview" className="max-h-60 rounded-md mx-auto" />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="format" className="text-sm font-medium">Target Format</label>
            <Select onValueChange={(value) => setTargetFormat(value as any)} defaultValue={targetFormat}>
                <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <Button onClick={convertAndDownload} disabled={isProcessing || !sourceFile} className="w-full">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isProcessing ? 'Converting...' : `Convert & Download as ${targetFormat.toUpperCase()}`}
          </Button>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}


