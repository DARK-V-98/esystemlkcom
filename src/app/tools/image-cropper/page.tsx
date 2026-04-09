
"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Crop, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg } from './crop-image';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ImageCropperPage() {
  const [sourceFile, setSourceFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSourceFile(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDownload = async () => {
    if (!sourceFile || !croppedAreaPixels) {
      setError('Please select an image and crop it first.');
      return;
    }
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(sourceFile, croppedAreaPixels, cropShape);
      if (croppedImage) {
        const a = document.createElement('a');
        a.href = croppedImage;
        a.download = 'cropped-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(croppedImage);
      }
    } catch (e) {
      console.error(e);
      setError('Could not crop the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Image Cropper</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Crop and zoom your images with an easy-to-use interface.
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

      <Card className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Crop Image</CardTitle>
          <CardDescription>Upload an image and adjust the crop area.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          
          {sourceFile && (
            <div className="relative h-96 w-full bg-black/20 rounded-lg">
              <Cropper
                image={sourceFile}
                crop={crop}
                zoom={zoom}
                aspect={cropShape === 'rect' ? 4 / 3 : 1}
                cropShape={cropShape}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {sourceFile && (
             <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Zoom</Label>
                    <Slider value={[zoom]} onValueChange={(val) => setZoom(val[0])} min={1} max={3} step={0.1} />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="crop-shape" checked={cropShape === 'round'} onCheckedChange={(checked) => setCropShape(checked ? 'round' : 'rect')} />
                    <Label htmlFor="crop-shape">Round Crop (for Avatars)</Label>
                </div>
                <Button onClick={handleDownload} disabled={isProcessing} className="w-full">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {isProcessing ? 'Processing...' : 'Download Cropped Image'}
                </Button>
            </div>
          )}
          
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}


