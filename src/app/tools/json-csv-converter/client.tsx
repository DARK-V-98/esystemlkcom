
"use client";

import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileDown, FileJson, FileSpreadsheet, RefreshCw, Copy, Check, Upload, Trash2, ArrowRightLeft, ShieldCheck, Zap } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

export default function JsonCsvConverterClient() {
  const [inputText, setInputText] = useState('[\n  {\n    "id": 1,\n    "name": "Leanne Graham",\n    "username": "Bret",\n    "email": "Sincere@april.biz"\n  },\n  {\n    "id": 2,\n    "name": "Ervin Howell",\n    "username": "Antonette",\n    "email": "Shanna@melissa.tv"\n  }\n]');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertData = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some data to convert.');
      return;
    }

    setIsProcessing(true);
    try {
      if (direction === 'json-to-csv') {
        const json = JSON.parse(inputText);
        const data = Array.isArray(json) ? json : [json];
        const csv = Papa.unparse(data);
        setOutputText(csv);
        toast.success('JSON to CSV conversion successful!');
      } else {
        const result = Papa.parse(inputText, { header: true, dynamicTyping: true });
        if (result.errors.length > 0) {
           throw new Error(result.errors[0].message);
        }
        setOutputText(JSON.stringify(result.data, null, 2));
        toast.success('CSV to JSON conversion successful!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to convert data. Check your format.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputText(content);
        toast.success('File loaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const extension = direction === 'json-to-csv' ? 'csv' : 'json';
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esystemlk-data.${extension}`;
    link.click();
    toast.success(`${extension.toUpperCase()} file downloaded!`);
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Result copied to clipboard!');
  };

  const swapDirection = () => {
    setDirection(prev => prev === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv');
    setInputText('');
    setOutputText('');
  };

  return (
    <ToolLayout 
      title="Advanced JSON ⇄ CSV Converter" 
      description="Seamlessly transform your data between JSON and CSV formats. High performance, 100% private, and supports complex objects. Perfect for developers and data analysts."
      category="Data Converters"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col h-full">
              <CardHeader className="pb-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       {direction === 'json-to-csv' ? <FileJson className="w-5 h-5 text-primary" /> : <FileSpreadsheet className="w-5 h-5 text-primary" />}
                       <CardTitle>Input Data</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={swapDirection} className="h-8 gap-2 uppercase font-black text-xs text-primary/70 hover:text-primary transition-all bg-primary/5 hover:bg-primary/10 rounded-lg">
                       <ArrowRightLeft className="w-3 h-3" /> Swap
                    </Button>
                 </div>
                 <CardDescription>
                    {direction === 'json-to-csv' ? 'Paste your JSON array or object.' : 'Paste your CSV rows here.'}
                 </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                 <div className="space-y-4">
                    <Textarea 
                       value={inputText} 
                       onChange={(e) => setInputText(e.target.value)} 
                       placeholder={direction === 'json-to-csv' ? '[ { "key": "value" } ]' : 'id,name,email\n1,John,john@example.com'} 
                       className="min-h-[400px] font-mono text-sm bg-black/20 border-white/5 focus:border-primary/50 transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" asChild className="h-12 border-white/5 hover:bg-white/5 gap-2 cursor-pointer">
                       <label className="m-0 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          UPLOAD FILE
                          <input type="file" onChange={handleFileUpload} className="hidden" accept={direction === 'json-to-csv' ? '.json' : '.csv'} />
                       </label>
                    </Button>
                    <Button onClick={() => setInputText('')} variant="ghost" className="h-12 text-red-400 hover:text-red-500 hover:bg-red-500/5 gap-2">
                       <Trash2 className="w-4 h-4" /> CLEAR
                    </Button>
                 </div>
                 <Button onClick={convertData} disabled={isProcessing || !inputText} className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-lg font-black uppercase">
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin mr-3" /> : (
                       direction === 'json-to-csv' ? <FileSpreadsheet className="w-5 h-5 mr-3" /> : <FileJson className="w-5 h-5 mr-3" />
                    )}
                    {isProcessing ? 'CONVERTING...' : `CONVERT TO ${direction === 'json-to-csv' ? 'CSV' : 'JSON'}`}
                 </Button>
              </CardContent>
           </Card>
        </div>

        {/* Preview Output */}
        <div className="lg:col-span-7 h-full">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative group">
              <CardHeader className="flex flex-row items-center justify-between z-10">
                 <div>
                    <CardTitle className="flex items-center gap-2">
                       {direction === 'json-to-csv' ? <FileSpreadsheet className="w-5 h-5 text-purple-400" /> : <FileJson className="w-5 h-5 text-purple-400" />}
                       Converted Output
                    </CardTitle>
                    <CardDescription>Your production data is ready.</CardDescription>
                 </div>
                 {outputText && (
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-9 gap-2 items-center bg-black/40 border-white/5 hover:bg-white/5 transition-all">
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                          Copy
                       </Button>
                       <Button variant="outline" size="sm" onClick={handleDownload} className="h-9 gap-2 items-center bg-black/40 border-white/5 hover:bg-white/5 transition-all">
                          <FileDown className="w-3 h-3 text-purple-400" />
                          Download
                       </Button>
                    </div>
                 )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-0">
                 <div className="flex-grow bg-black/40 font-mono text-xs p-8 overflow-auto max-h-[680px] border-t border-white/5">
                    {isProcessing ? (
                       <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                          <p className="text-sm font-black uppercase tracking-widest">Processing Data Store...</p>
                       </div>
                    ) : outputText ? (
                       <pre className="text-purple-300/80 leading-relaxed animate-in fade-in duration-500 whitespace-pre">
                          <code>{outputText}</code>
                       </pre>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 italic p-12 text-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                          <ArrowRightLeft className="w-20 h-20 mb-6 opacity-20" />
                          <p className="text-lg font-bold uppercase tracking-tighter">Ready for Conversion</p>
                          <p className="max-w-[200px] text-[10px] uppercase font-black tracking-widest mt-2">{direction === 'json-to-csv' ? 'Paste JSON on left to build CSV rows' : 'Paste CSV on left to build JSON objects'}</p>
                       </div>
                    )}
                 </div>
              </CardContent>
              {/* Trust Indicators */}
              <div className="absolute bottom-6 right-8 flex items-center gap-4 text-[9px] font-black uppercase text-white/5 tracking-[0.2em]">
                 <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Private</div>
                 <div className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Client-Side</div>
              </div>
           </Card>
        </div>
      </div>
    </ToolLayout>
  );
}