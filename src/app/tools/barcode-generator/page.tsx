
"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Barcode, Palette, Ruler } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// A selection of common barcode formats supported by JsBarcode
const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'MSI', label: 'MSI' },
    { value: 'pharmacode', label: 'Pharmacode' },
];

export default function BarcodeGeneratorPage() {
  const [barcodeValue, setBarcodeValue] = useState('Example 1234');
  const [barcodeOptions, setBarcodeOptions] = useState({
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    lineColor: '#ffffff',
    background: 'transparent',
  });
  const [error, setError] = useState<string | null>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      content: 'Example 1234',
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
    },
  });
  
  const watchedValues = watch();

  useEffect(() => {
    if (barcodeRef.current && barcodeValue) {
      try {
        JsBarcode(barcodeRef.current, barcodeValue, {
          ...barcodeOptions,
          font: "monospace",
          fontSize: 18,
          textMargin: 5
        });
        setError(null);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Invalid input for this barcode type.";
        setError(message);
        if (barcodeRef.current) {
            barcodeRef.current.innerHTML = '';
        }
      }
    }
  }, [barcodeValue, barcodeOptions]);

  const onSubmit = (data: typeof watchedValues) => {
    setBarcodeOptions({
      format: data.format,
      width: data.width,
      height: data.height,
      displayValue: data.displayValue,
      lineColor: '#ffffff',
      background: 'transparent', // Keep preview background transparent
    });
    setBarcodeValue(data.content);
  };
  
  const handleDownload = () => {
    if (barcodeRef.current) {
      const svgElement = barcodeRef.current.cloneNode(true) as SVGSVGElement;

      // Create a temporary SVG with a white background for download
      try {
        JsBarcode(svgElement, barcodeValue, {
            ...barcodeOptions,
            background: '#ffffff', // Set white background for PNG
            lineColor: '#000000', // Set black lines for PNG
            fontOptions: 'bold',
            font: "monospace",
            fontSize: 18,
            textMargin: 5
        });
      } catch (e) {
          setError('Could not generate barcode for download.');
          return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const svgSize = svgElement.getBoundingClientRect();
      canvas.width = svgSize.width > 0 ? svgSize.width + 40 : 300;
      canvas.height = svgSize.height > 0 ? svgSize.height + 40 : 150;
      
      if(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 20, 20);
          
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `${barcodeValue.replace(/ /g, '_')}-${barcodeOptions.format}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Barcode Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Create standard barcodes for your products or inventory.
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
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Enter content and select a format.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="content">Barcode Content</Label>
                <Input {...register('content')} id="content" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select onValueChange={(value) => setValue('format', value as any)} defaultValue="CODE128">
                  <SelectTrigger id="format" className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeFormats.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                      <Checkbox id="displayValue" {...register('displayValue')} defaultChecked />
                      <Label htmlFor="displayValue">Display value</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="width">Width ({watchedValues.width})</Label>
                          <Input type="range" id="width" {...register('width', { valueAsNumber: true })} min="1" max="4" step="0.5" />
                      </div>
                      <div>
                           <Label htmlFor="height">Height ({watchedValues.height})</Label>
                          <Input type="range" id="height" {...register('height', { valueAsNumber: true })} min="50" max="150" />
                      </div>
                  </div>
              </div>

              <Button type="submit" className="w-full">
                <Barcode className="mr-2 h-4 w-4" /> Generate Barcode
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg h-full">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Your generated barcode will appear below.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-8 rounded-lg flex flex-col items-center justify-center min-h-[250px]">
                  {error ? (
                     <div className="text-center text-destructive">
                        <p className="font-bold">Error Generating Barcode</p>
                        <p className="text-sm">{error}</p>
                    </div>
                  ) : (
                    <svg ref={barcodeRef}></svg>
                  )}
                </div>
                {!error && (
                    <Button onClick={handleDownload} className="w-full mt-6" variant="hero" disabled={!barcodeValue}>
                        <Download className="mr-2 h-4 w-4" /> Download as PNG
                    </Button>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
