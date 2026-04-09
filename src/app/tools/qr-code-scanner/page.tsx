
"use client";

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, Video, X, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function QrCodeScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const boundingBoxRef = useRef<HTMLDivElement>(null);

    const tick = () => {
        if (isScanning && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current && boundingBoxRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const boundingBox = boundingBoxRef.current;
            
            if (video.videoHeight === 0) {
                 if (isScanning) requestAnimationFrame(tick);
                 return;
            }

            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                
                if (code) {
                    setScanResult(code.data);
                    
                    const { x, y } = code.location.topLeftCorner;
                    const width = code.location.topRightCorner.x - x;
                    const height = code.location.bottomLeftCorner.y - y;
                    
                    const videoRect = video.getBoundingClientRect();
                    
                    if (videoRect.width > 0 && video.videoWidth > 0) {
                        const scaleX = videoRect.width / video.videoWidth;
                        const scaleY = videoRect.height / video.videoHeight;

                        boundingBox.style.left = `${x * scaleX}px`;
                        boundingBox.style.top = `${y * scaleY}px`;
                        boundingBox.style.width = `${width * scaleX}px`;
                        boundingBox.style.height = `${height * scaleY}px`;
                        boundingBox.style.display = 'block';
                    }

                    stopScan();
                } else if (isScanning) {
                    if (boundingBox) boundingBox.style.display = 'none';
                    requestAnimationFrame(tick);
                }
            }
        } else if (isScanning) {
            requestAnimationFrame(tick);
        }
    };
    
    const startScan = async () => {
        setScanResult(null);
        setError(null);
        setIsScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
                await videoRef.current.play();
                requestAnimationFrame(tick);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please grant permission and try again.");
            setIsScanning(false);
            setHasCameraPermission(false);
        }
    };

    const stopScan = () => {
        setIsScanning(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (boundingBoxRef.current) {
            boundingBoxRef.current.style.display = 'none';
        }
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            stopScan(); // Stop camera if it's running
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    if(canvasRef.current){
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        if (!ctx) return;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        if(imageData) {
                            const code = jsQR(imageData.data, imageData.width, imageData.height);
                            if (code) {
                                setScanResult(code.data);
                                setError(null);
                            } else {
                                setError("No QR code found in the image.");
                                setScanResult(null);
                            }
                        }
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCopy = () => {
        if (scanResult) {
          navigator.clipboard.writeText(scanResult);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const isUrl = (text: string | null): boolean => {
        if (!text) return false;
        try {
            new URL(text);
            return text.startsWith('http://') || text.startsWith('https://');
        } catch (_) {
            return false;
        }
    }


    useEffect(() => {
        // Cleanup function to stop camera when component unmounts
        return () => {
            stopScan();
        }
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">QR Code Scanner</h1>
                <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
                    Scan QR codes using your camera or by uploading an image.
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
                    <CardTitle>Scan QR Code</CardTitle>
                    <CardDescription>Use your camera or upload an image file.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-black/20 rounded-lg overflow-hidden relative aspect-video flex items-center justify-center">
                        <video ref={videoRef} className="w-full h-full object-cover" hidden={!isScanning} playsInline/>
                        {!isScanning && <p className="text-gray-600">Camera is off</p>}
                        <div ref={boundingBoxRef} className="absolute border-2 border-primary bg-primary/20" style={{ display: 'none' }} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {!isScanning ? (
                            <Button onClick={startScan} className="w-full">
                                <Video className="mr-2 h-4 w-4" /> Start Camera
                            </Button>
                        ) : (
                            <Button onClick={stopScan} variant="destructive" className="w-full">
                                <X className="mr-2 h-4 w-4" /> Stop Camera
                            </Button>
                        )}
                         <Button asChild variant="secondary" className="w-full">
                            <label htmlFor="qr-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" /> Upload Image
                                <Input id="qr-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                        </Button>
                    </div>

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    {scanResult && (
                         <Card className="bg-black/40">
                             <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Scan Result</CardTitle>
                                     <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy result">
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                        {isUrl(scanResult) && (
                                            <Button asChild variant="ghost" size="icon" title="Open link">
                                                 <a href={scanResult} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                             </CardHeader>
                            <CardContent>
                                <p className="font-mono bg-background p-4 rounded-md break-all">{scanResult}</p>
                            </CardContent>
                         </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


