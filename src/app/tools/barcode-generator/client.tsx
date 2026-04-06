
"use client";

import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Barcode, Palette, Ruler, Info, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const barcodeFormats = [
    { value: 'CODE128', label: 'CODE128 (Most Common)' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF-14' },
    { value: 'MSI', label: 'MSI' },
    { value: 'pharmacode', label: 'Pharmacode' },
];

export default function BarcodeGeneratorClient() {
  const [content, setContent] = useState('ESYSTEMLK-9941');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState<string | null>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && content) {
      try {
        JsBarcode(barcodeRef.current, content, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          lineColor: lineColor,
          background: 'transparent',
          font: "monospace",
          fontSize: 16,
          textMargin: 5
        });
        setError(null);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Invalid input for this format.";
        setError(message);
        if (barcodeRef.current) barcodeRef.current.innerHTML = '';
      }
    }
  }, [content, format, width, height, displayValue, lineColor]);

  const handleDownload = () => {
    if (barcodeRef.current) {
        const svg = barcodeRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgSize = svg.getBoundingClientRect();
        
        canvas.width = svgSize.width + 40;
        canvas.height = svgSize.height + 40;
        
        if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 20, 20);
                const pngUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = pngUrl;
                link.download = `barcode-${content}.png`;
                link.click();
                toast.success('Barcode downloaded successfully!');
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }
    }
  };

  return (
    <ToolLayout 
      title="Advanced Barcode Generator" 
      description="Create a variety of standard barcodes for retail, shipping, or personal organization. Customize dimensions, colors, and encoding formats instantly."
      category="Utility"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
             <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-purple-500" />
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Barcode className="w-5 h-5 text-primary" />
                   Barcode Data
                </CardTitle>
                <CardDescription>Setup your barcode content and format.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 flex-grow">
                <div className="space-y-2">
                   <Label htmlFor="content">Content to Encode</Label>
                   <Input 
                      id="content" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="ABC-12345" 
                      className="h-12 bg-black/20 border-white/5 text-lg font-bold"
                   />
                </div>

                <div className="space-y-2">
                   <Label htmlFor="format">Encoding Format</Label>
                   <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="h-11 bg-black/20 border-white/5">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {barcodeFormats.map(f => (
                           <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       <Label className="text-xs uppercase font-black text-muted-foreground">Width: {width}</Label>
                       <Slider value={[width]} onValueChange={(val) => setWidth(val[0])} min={1} max={4} step={0.5} />
                    </div>
                    <div className="space-y-4">
                       <Label className="text-xs uppercase font-black text-muted-foreground">Height: {height}</Label>
                       <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={40} max={180} step={10} />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center space-x-2">
                      <Checkbox id="displayValue" checked={displayValue} onCheckedChange={(val) => setDisplayValue(!!val)} />
                      <Label htmlFor="displayValue" className="font-bold text-sm">Show Human-Readable Text</Label>
                   </div>
                   <Input 
                     type="color" 
                     value={lineColor} 
                     onChange={(e) => setLineColor(e.target.value)}
                     className="w-10 h-10 p-1 bg-transparent border-none cursor-pointer"
                   />
                </div>

                <Button 
                   onClick={handleDownload} 
                   disabled={!!error || !content} 
                   className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-black shadow-lg shadow-primary/20 transition-all font-bold"
                >
                   <Download className="w-5 h-5 mr-3" />
                   DOWNLOAD SVG / PNG
                </Button>
             </CardContent>
           </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center relative p-12">
              <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-black uppercase text-white/20 tracking-widest">
                 <Ruler className="w-3 h-3" /> Scan Preview
              </div>
              
              <div className="bg-white p-10 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden min-w-[300px]">
                 {error ? (
                    <div className="text-center p-8 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h4 className="text-red-500 font-black uppercase tracking-tighter">Encoding Error</h4>
                        <p className="text-xs text-red-400 mt-2 italic px-4 max-w-[200px]">{error}</p>
                    </div>
                 ) : (
                    <svg ref={barcodeRef} className="max-w-full h-auto" />
                 )}
              </div>

              <div className="mt-12 flex items-center gap-6 text-white/30">
                 <div className="flex flex-col items-center gap-1 group transition-all hover:text-white pointer-events-none">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Standardized</span>
                 </div>
                 <div className="flex flex-col items-center gap-1 group transition-all hover:text-white pointer-events-none">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Vector-Perfect</span>
                 </div>
                 <div className="flex flex-col items-center gap-1 group transition-all hover:text-white pointer-events-none">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">High Res</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
