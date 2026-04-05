
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ImageCompressorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'webp'>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number, originalSize: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSourceFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const compressImage = () => {
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
                const objectUrl = URL.createObjectURL(blob);
                setResult({
                    url: objectUrl,
                    size: blob.size,
                    originalSize: sourceFile.size
                });
            } else {
              setError('Failed to compress image.');
            }
            setIsProcessing(false);
          }, `image/${targetFormat}`, quality / 100);
        }
      };
      img.onerror = () => {
        setError('Failed to load image.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(sourceFile);
  };
  
   const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const fileName = sourceFile?.name.substring(0, sourceFile.name.lastIndexOf('.'));
    a.download = `${fileName}_compressed.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Image Compressor</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Reduce the file size of your images with adjustable quality settings.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Upload an image and adjust the settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Source Image</Label>
              <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {previewUrl && (
              <div className="p-4 bg-black/20 rounded-lg text-center">
                <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">Original Size: {(sourceFile!.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="quality">Quality</Label>
                        <span className="text-sm font-medium text-primary">{quality}%</span>
                    </div>
                    <Slider id="quality" value={[quality]} onValueChange={(val) => setQuality(val[0])} min={1} max={100} step={1} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="format">Target Format</Label>
                    <Select onValueChange={(value) => setTargetFormat(value as any)} defaultValue={targetFormat}>
                        <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WEBP</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>

            <Button onClick={compressImage} disabled={isProcessing || !sourceFile} className="w-full">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isProcessing ? 'Compressing...' : 'Compress Image'}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
        </Card>

         <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Preview your compressed image.</CardDescription>
            </CardHeader>
             <CardContent>
                {result ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-black/20 rounded-lg text-center">
                            <img src={result.url} alt="Compressed" className="max-h-60 rounded-md mx-auto" />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            <p>Original: <strong>{(result.originalSize / 1024).toFixed(2)} KB</strong></p>
                            <p>Compressed: <strong>{(result.size / 1024).toFixed(2)} KB</strong></p>
                            <p>Reduction: <strong className="text-green-400">
                                {(((result.originalSize - result.size) / result.originalSize) * 100).toFixed(2)}%
                            </strong></p>
                        </div>
                        <Button onClick={handleDownload} className="w-full"><Download className="mr-2 h-4 w-4" /> Download Image</Button>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Compressed image will appear here.
                    </div>
                )}
             </CardContent>
         </Card>
      </div>
    </div>
  );
}
