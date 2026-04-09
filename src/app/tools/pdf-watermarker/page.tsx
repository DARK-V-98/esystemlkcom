
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PDFDocument, rgb, StandardFonts, RotationTypes } from 'pdf-lib';

export default function PdfWatermarkerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('Confidential');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.2);
  const [color, setColor] = useState('#ff0000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const processAndDownload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const colorRgb = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          font: helveticaFont,
          size: fontSize,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          opacity: opacity,
           rotate: {
            type: RotationTypes.Degrees,
            angle: -45,
          },
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([Uint8Array.from(pdfBytes)], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.replace('.pdf', '')}-watermarked.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to watermark PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  function hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    };
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">PDF Watermarker</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Add a custom text watermark to your PDF files securely in your browser.
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
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Upload your PDF and customize the watermark.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">PDF File</Label>
              <Input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="watermark-text">Watermark Text</Label>
              <Input id="watermark-text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="color">Watermark Color</Label>
              <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="font-size">Font Size</Label>
                <span className="text-sm font-medium text-primary">{fontSize}px</span>
              </div>
              <Slider id="font-size" value={[fontSize]} onValueChange={(val) => setFontSize(val[0])} min={10} max={200} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="opacity">Opacity</Label>
                 <span className="text-sm font-medium text-primary">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider id="opacity" value={[opacity]} onValueChange={(val) => setOpacity(val[0])} min={0.05} max={1} step={0.05} />
            </div>

            <Button onClick={processAndDownload} disabled={isProcessing || !file} className="w-full">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isProcessing ? 'Processing...' : 'Add Watermark & Download'}
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
        </Card>
    </div>
  );
}


