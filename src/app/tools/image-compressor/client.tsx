
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Minimize2, ImageIcon, Plus, Trash2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

export default function ImageCompressorClient() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(70);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'webp'>('webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number, originalSize: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      setSourceFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const compressImage = () => {
    if (!sourceFile) return;
    setIsProcessing(true);

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
                toast.success('Compression complete!');
            } else {
              toast.error('Failed to compress image.');
            }
            setIsProcessing(false);
          }, `image/${targetFormat}`, quality / 100);
        }
      };
      img.onerror = () => {
        toast.error('Failed to load image.');
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

  const removeImage = () => {
    setSourceFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolLayout 
      title="Advanced Image Compressor" 
      description="Efficiently reduce the file size of your JPEG and WEBP images without losing visual quality. 100% private processing right in your browser."
      category="Image Tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
             <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-emerald-500" />
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Minimize2 className="w-5 h-5 text-primary" />
                   Compression Settings
                </CardTitle>
                <CardDescription>Upload image and adjust parameters.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-8 flex-grow">
                <div className="relative group/upload">
                   {!previewUrl && (
                      <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="h-48 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group-hover/upload:border-primary/30"
                      >
                         <Plus className="w-12 h-12 text-primary/50 mb-3" />
                         <p className="text-sm text-foreground/70 font-semibold tracking-wide uppercase">Select Image to Compress</p>
                         <p className="text-xs text-muted-foreground mt-1 underline">or drag and drop</p>
                      </div>
                   )}
                   <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp" 
                   />

                   {previewUrl && (
                     <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 p-4 flex flex-col items-center">
                        <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg shadow-xl" />
                        <div className="mt-4 flex flex-col items-center gap-1">
                           <p className="text-xs font-bold text-white/50 truncate max-w-[200px] uppercase tracking-tighter">{sourceFile?.name}</p>
                           <p className="text-[10px] text-primary font-black uppercase">{(sourceFile!.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={removeImage} 
                           className="absolute top-2 right-2 h-8 w-8 text-red-400 hover:text-red-500 hover:bg-black/40 rounded-full"
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                   )}
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Target Format</Label>
                          <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Recommended: WEBP</span>
                       </div>
                       <Select value={targetFormat} onValueChange={(val) => setTargetFormat(val as any)}>
                          <SelectTrigger className="h-12 bg-black/20 border-white/5 font-semibold">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10">
                             <SelectItem value="jpeg" className="font-bold">JPEG</SelectItem>
                             <SelectItem value="webp" className="font-bold text-emerald-400">WEBP (Optimized)</SelectItem>
                          </SelectContent>
                       </Select>
                   </div>

                   <div className="space-y-4">
                       <div className="flex justify-between items-center px-1">
                          <Label className="text-sm font-bold uppercase">Compression Strength</Label>
                          <span className="text-lg font-black text-primary">{quality}%</span>
                       </div>
                       <Slider 
                          value={[quality]} 
                          onValueChange={(val) => setQuality(val[0])} 
                          min={10} 
                          max={100} 
                          step={1} 
                          className="py-2"
                       />
                       <p className="text-[10px] text-muted-foreground text-center italic">Lower quality results in smaller file sizes.</p>
                   </div>
                </div>

                <Button 
                   onClick={compressImage} 
                   disabled={!sourceFile || isProcessing} 
                   className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-black shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                   {isProcessing ? (
                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
                   ) : (
                     <Zap className="w-5 h-5 mr-2" />
                   )}
                   {isProcessing ? 'COMPRESSING...' : 'COMPRESS IMAGE'}
                </Button>
             </CardContent>
           </Card>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7 h-full">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative p-8">
              {result ? (
                <div className="w-full h-full flex flex-col items-center animate-in zoom-in-95 duration-500">
                    <div className="relative group/result">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <img 
                          src={result.url} 
                          alt="Compressed" 
                          className="relative max-h-[400px] rounded-2xl shadow-2xl border border-white/10" 
                        />
                    </div>
                    
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                           <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Old Size</p>
                           <p className="text-sm font-bold">{(result.originalSize / 1024).toFixed(2)} KB</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                           <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">New Size</p>
                           <p className="text-sm font-bold text-emerald-400">{(result.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                           <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Format</p>
                           <p className="text-sm font-bold uppercase">{targetFormat}</p>
                        </div>
                        <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/20 flex flex-col items-center text-center">
                           <p className="text-[10px] uppercase font-black text-emerald-500 mb-1">Savings</p>
                           <p className="text-sm font-black text-emerald-400">
                              {(((result.originalSize - result.size) / result.originalSize) * 100).toFixed(2)}%
                           </p>
                        </div>
                    </div>

                    <Button 
                       onClick={handleDownload} 
                       className="mt-8 w-full h-14 bg-white text-black hover:bg-white/90 font-black text-lg gap-3"
                    >
                       <Download className="w-5 h-5" />
                       DOWNLOAD OPTIMIZED IMAGE
                    </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center max-w-sm space-y-6 opacity-30">
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center">
                       <ImageIcon className="w-12 h-12 text-primary" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tighter">Compressed Preview</h3>
                       <p className="text-sm">Optimize your image on the left to see the high-quality result here.</p>
                    </div>
                </div>
              )}

              <div className="absolute bottom-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                 <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted</div>
                 <div className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Instant</div>
                 <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Browser-only</div>
              </div>
           </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
