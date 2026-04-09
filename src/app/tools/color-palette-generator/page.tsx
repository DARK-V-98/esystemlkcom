
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Check, Palette, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function hexToRgb(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generatePalette(baseHex: string, count = 5) {
    const baseRgb = hexToRgb(baseHex);
    if (!baseRgb) return [];
    
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const palette = [];
    
    // Analogous palette
    for (let i = 0; i < count; i++) {
        let newHue = (baseHsl.h + (i * 30)) % 360;
        palette.push(`hsl(${newHue}, ${baseHsl.s}%, ${baseHsl.l}%)`);
    }
    return palette.map(hslToHex);
}

function hslToHex(hsl: string): string {
    const match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(hsl);
    if (!match) return "#000000";
    
    let h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ColorPaletteGeneratorPage() {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [palette, setPalette] = useState<string[]>([]);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    useEffect(() => {
        setPalette(generatePalette(baseColor));
    }, [baseColor]);
    
    const handleRandom = () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        setBaseColor(randomColor);
    };

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Color Palette Generator</h1>
                <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
                    Create beautiful color schemes from a base color or generate random palettes.
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
                    <CardTitle>Generator</CardTitle>
                    <CardDescription>Pick a base color or generate one randomly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="h-12 pl-14" />
                            <Input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 p-0 bg-transparent border-none cursor-pointer" />
                        </div>
                        <Button onClick={handleRandom} className="h-12">
                            <RefreshCw className="mr-2 h-4 w-4" /> Random Color
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {palette.map((color) => {
                            const rgb = hexToRgb(color);
                            const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
                            return (
                                <div key={color} className="space-y-2 group">
                                    <div 
                                        className="h-32 rounded-lg relative cursor-pointer" 
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleCopy(color)}
                                    >
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {copiedColor === color ? <Check className="w-8 h-8 text-white" /> : <Copy className="w-8 h-8 text-white" />}
                                        </div>
                                    </div>
                                    <div className="text-xs space-y-1 font-mono">
                                        <p className="truncate"><strong>HEX:</strong> {color}</p>
                                        {rgb && <p><strong>RGB:</strong> {rgb.r}, {rgb.g}, {rgb.b}</p>}
                                        {hsl && <p><strong>HSL:</strong> {hsl.h}, {hsl.s}, {hsl.l}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


