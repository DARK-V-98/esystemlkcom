
"use client";

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon.ico' }, // Will be converted to .ico
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
];

export default function FaviconGeneratorPage() {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (PNG, JPG, etc.).');
                return;
            }
            setSourceFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const generateFavicons = async () => {
        if (!sourceFile) {
            setError('Please upload an image first.');
            return;
        }
        setIsProcessing(true);
        setError(null);

        const zip = new JSZip();
        const imageSrc = URL.createObjectURL(sourceFile);
        const img = new Image();
        img.src = imageSrc;

        img.onload = async () => {
            try {
                for (const { size, name } of faviconSizes) {
                    const canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, size, size);
                        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                        if (blob) {
                            if (name.endsWith('.ico')) {
                                // A simplified .ico structure for a single size
                                const icoBlob = await createIco(canvas);
                                zip.file(name, icoBlob);
                            } else {
                                zip.file(name, blob);
                            }
                        }
                    }
                }
                
                // Add manifest.json
                const manifest = {
                    name: "Your App Name",
                    short_name: "AppShortName",
                    icons: faviconSizes.filter(f => f.name.includes('android-chrome')).map(f => ({
                        src: `/${f.name}`,
                        sizes: `${f.size}x${f.size}`,
                        type: 'image/png'
                    })),
                    theme_color: "#ffffff",
                    background_color: "#ffffff",
                    display: "standalone"
                };
                zip.file('manifest.json', JSON.stringify(manifest, null, 2));

                const htmlContent = `
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/manifest.json">
`;
                zip.file('usage.html', htmlContent);

                const zipBlob = await zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, 'favicons.zip');

            } catch (err) {
                setError('Failed to generate favicons.');
                console.error(err);
            } finally {
                setIsProcessing(false);
                URL.revokeObjectURL(imageSrc);
            }
        };

        img.onerror = () => {
             setError('Failed to load image.');
             setIsProcessing(false);
        }
    };
    
    // Creates a basic ICO file structure
    const createIco = (canvas: HTMLCanvasElement): Promise<Blob> => {
        return new Promise(resolve => {
            canvas.toBlob(pngBlob => {
                if (!pngBlob) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const pngData = new Uint8Array(e.target?.result as ArrayBuffer);
                    const icoHeader = new Uint8Array([0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 24, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
                    icoHeader[6] = canvas.width;
                    icoHeader[7] = canvas.height;
                    icoHeader[14] = pngData.length & 255;
                    icoHeader[15] = pngData.length >> 8;
                    const finalIco = new Blob([icoHeader, pngData], {type: 'image/x-icon'});
                    resolve(finalIco);
                };
                reader.readAsArrayBuffer(pngBlob);
            }, 'image/png');
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Favicon Generator</h1>
                <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
                    Upload an image to generate all the necessary favicon files for your website.
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

            <Card className="max-w-2xl mx-auto bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Generate Favicons</CardTitle>
                    <CardDescription>Upload a square image (at least 512x512 recommended).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="file-upload" className="text-sm font-medium">Source Image</label>
                        <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    {previewUrl && (
                        <div className="p-4 bg-black/20 rounded-lg text-center">
                            <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md mx-auto" />
                        </div>
                    )}

                    <Button onClick={generateFavicons} disabled={isProcessing || !sourceFile} className="w-full">
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isProcessing ? 'Generating...' : 'Generate & Download ZIP'}
                    </Button>

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
