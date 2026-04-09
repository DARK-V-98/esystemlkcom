
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Wand2 } from 'lucide-react';
import Link from 'next/link';

const optimizeSvg = (svgString: string): string => {
    let result = svgString;
    // Remove comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    // Remove XML declaration
    result = result.replace(/<\?xml.*?\?>/g, '');
    // Remove DOCTYPE
    result = result.replace(/<!DOCTYPE.*?>/g, '');
    // Remove editor-specific metadata
    result = result.replace(/<(sodipodi|inkscape):[^>]+>/g, '');
    result = result.replace(/<\/\s*(sodipodi|inkscape):[^>]+>/g, '');
    // Remove unnecessary attributes
    result = result.replace(/\s(id|class|style|data-name)="[^"]*"/g, '');
    // Collapse whitespace
    result = result.replace(/\s\s+/g, ' ');
    result = result.replace(/>\s+</g, '><');
    // Trim and return
    return result.trim();
};


export default function SvgOptimizerPage() {
    const [inputSvg, setInputSvg] = useState('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>');
    const [outputSvg, setOutputSvg] = useState('');
    const [copied, setCopied] = useState(false);
    
    const handleOptimize = () => {
        setOutputSvg(optimizeSvg(inputSvg));
    };

    const handleCopy = () => {
        if (outputSvg) {
            navigator.clipboard.writeText(outputSvg);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const originalSize = new Blob([inputSvg]).size;
    const optimizedSize = new Blob([outputSvg]).size;
    const reduction = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize) * 100 : 0;

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">SVG Optimizer</h1>
                <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
                    Minify your SVG code by removing unnecessary data.
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
                <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Input SVG</CardTitle>
                        <CardDescription>Paste your SVG code below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={inputSvg}
                            onChange={(e) => setInputSvg(e.target.value)}
                            className="font-mono h-[300px] text-xs"
                            placeholder="<svg>...</svg>"
                        />
                         <div className="p-4 bg-black/20 rounded-lg text-center h-32 flex items-center justify-center">
                            <div dangerouslySetInnerHTML={{ __html: inputSvg }} className="w-16 h-16 [&>svg]:w-full [&>svg]:h-full text-foreground"/>
                         </div>
                        <Button onClick={handleOptimize} className="w-full">
                            <Wand2 className="mr-2 h-4 w-4" /> Optimize SVG
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Optimized SVG</CardTitle>
                                <CardDescription>The minified output.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!outputSvg}>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            readOnly
                            value={outputSvg}
                            className="font-mono h-[300px] text-xs bg-black/20"
                            placeholder="Optimized SVG code will appear here..."
                        />
                        <div className="p-4 bg-black/20 rounded-lg text-center h-32 flex items-center justify-center">
                            {outputSvg && <div dangerouslySetInnerHTML={{ __html: outputSvg }} className="w-16 h-16 [&>svg]:w-full [&>svg]:h-full text-foreground"/>}
                        </div>
                        {outputSvg && (
                          <div className="text-center text-sm text-muted-foreground">
                            Original: <strong>{originalSize} bytes</strong> | 
                            Optimized: <strong>{optimizedSize} bytes</strong> | 
                            Reduction: <strong className="text-primary">{reduction.toFixed(2)}%</strong>
                          </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


