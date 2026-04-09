
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Upload, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ImageResizerPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
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
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalDims({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
      setError(null);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    setWidth(newWidth);
    if (keepAspectRatio && originalDims.w > 0) {
      const newHeight = Math.round((newWidth / originalDims.w) * originalDims.h);
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    setHeight(newHeight);
    if (keepAspectRatio && originalDims.h > 0) {
      const newWidth = Math.round((newHeight / originalDims.h) * originalDims.w);
      setWidth(newWidth);
    }
  };

  const resizeAndDownload = () => {
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
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const fileName = sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.'));
              const extension = sourceFile.name.substring(sourceFile.name.lastIndexOf('.') + 1);
              a.download = `${fileName}_${width}x${height}.${extension}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } else {
              setError('Failed to resize image.');
            }
            setIsProcessing(false);
          }, sourceFile.type);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(sourceFile);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Image Resizer</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Resize images to custom dimensions quickly and easily.
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
          <CardTitle>Resize Image</CardTitle>
          <CardDescription>Your image stays on your device. No uploads needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">Source Image</label>
            <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {previewUrl && (
            <div className="p-4 bg-black/20 rounded-lg text-center">
              <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md mx-auto" />
              <p className="text-xs text-muted-foreground mt-2">Original: {originalDims.w} x {originalDims.h}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
                <label htmlFor="width" className="text-sm font-medium">Width (px)</label>
                <Input id="width" type="number" value={width} onChange={handleWidthChange} />
            </div>
             <div className="space-y-2">
                <label htmlFor="height" className="text-sm font-medium">Height (px)</label>
                <Input id="height" type="number" value={height} onChange={handleHeightChange} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="aspectRatio" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="aspectRatio" className="text-sm font-medium">Keep aspect ratio</label>
          </div>

          <Button onClick={resizeAndDownload} disabled={isProcessing || !sourceFile} className="w-full">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isProcessing ? 'Resizing...' : 'Resize & Download'}
          </Button>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}


