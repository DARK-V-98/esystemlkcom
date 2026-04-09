
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Camera, Calendar, MapPin, Download, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ExifReader from 'exif-reader';

interface Metadata {
    Make?: string;
    Model?: string;
    DateTimeOriginal?: Date;
    gps?: {
        GPSLatitude?: number[];
        GPSLongitude?: number[];
    };
    [key: string]: any;
}

export default function ImageMetadataViewerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith('image/jpeg')) {
                setError('Please select a JPG/JPEG file to view EXIF data.');
                setFile(null);
                setMetadata(null);
                setPreviewUrl(null);
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
            setIsProcessing(true);

            try {
                const buffer = await selectedFile.arrayBuffer();
                const tags = ExifReader(Buffer.from(buffer));

                setMetadata(tags);
            } catch (err) {
                setError('Could not read metadata from this file. It may be missing or corrupted.');
                setMetadata(null);
            } finally {
                setIsProcessing(false);
            }
        }
    };
    
    const downloadStrippedImage = () => {
        if (!previewUrl || !file) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${file.name.split('.')[0]}-stripped.jpg`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                }, 'image/jpeg');
            }
        };
        img.src = previewUrl;
    };

    const formatGps = (gps: any) => {
        if (!gps?.GPSLatitude || !gps?.GPSLongitude) return "Not Available";
        const lat = gps.GPSLatitude[0] + gps.GPSLatitude[1]/60 + gps.GPSLatitude[2]/3600;
        const lon = gps.GPSLongitude[0] + gps.GPSLongitude[1]/60 + gps.GPSLongitude[2]/3600;
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Image Metadata Viewer</h1>
                <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
                    Inspect EXIF data from your photos and remove it if needed.
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
                        <CardTitle>Upload Image</CardTitle>
                        <CardDescription>Select a JPG/JPEG file to inspect its metadata.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Input id="file-upload" type="file" accept="image/jpeg" onChange={handleFileChange} />
                        {previewUrl && (
                            <div className="p-4 bg-black/20 rounded-lg text-center">
                                <img src={previewUrl} alt="Preview" className="max-h-60 rounded-md mx-auto" />
                            </div>
                        )}
                        {error && <p className="text-sm text-destructive text-center">{error}</p>}
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Metadata (EXIF)</CardTitle>
                        <CardDescription>Information embedded in the image file.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isProcessing ? (
                            <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin" /></div>
                        ) : metadata ? (
                            <div className="space-y-4">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3"><Camera className="w-5 h-5 text-primary"/><span className="font-medium">Device:</span> <span className="font-mono">{metadata.Make} {metadata.Model || 'N/A'}</span></li>
                                    <li className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary"/><span className="font-medium">Date Taken:</span> <span className="font-mono">{metadata.DateTimeOriginal ? new Date(metadata.DateTimeOriginal).toLocaleString() : 'N/A'}</span></li>
                                    <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary"/><span className="font-medium">GPS:</span> <span className="font-mono">{formatGps(metadata.gps)}</span></li>
                                </ul>
                                <Button onClick={downloadStrippedImage} variant="secondary" className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" /> Download with Metadata Removed
                                </Button>
                                <Card className="bg-black/20 mt-4 max-h-60 overflow-auto">
                                    <CardHeader className="py-3"><CardTitle className="text-base">All Tags</CardTitle></CardHeader>
                                    <CardContent className="py-3">
                                        <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(metadata, null, 2)}</pre>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                Upload an image to see its metadata.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


