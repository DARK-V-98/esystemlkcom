
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock, Unlock, Download, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FileEncryptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processedFile, setProcessedFile] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setProcessedFile(null);
      setError(null);
    }
  };

  const processFile = async () => {
    if (!file || !password) {
      setError('Please select a file and enter a password.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProcessedFile(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const key = await getKey(password);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const algorithm = { name: 'AES-GCM', iv: iv };

      if (mode === 'encrypt') {
        const encryptedData = await window.crypto.subtle.encrypt(algorithm, key, arrayBuffer);
        const ivAndData = new Uint8Array(iv.length + encryptedData.byteLength);
        ivAndData.set(iv);
        ivAndData.set(new Uint8Array(encryptedData), iv.length);
        
        const blob = new Blob([ivAndData]);
        setProcessedFile({ blob, fileName: `${file.name}.encrypted` });
      } else {
        if (arrayBuffer.byteLength < 12) {
          throw new Error('Invalid encrypted file. File is too small.');
        }
        const ivFromData = new Uint8Array(arrayBuffer, 0, 12);
        const data = new Uint8Array(arrayBuffer, 12);
        const decryptedAlgorithm = { name: 'AES-GCM', iv: ivFromData };
        
        const decryptedData = await window.crypto.subtle.decrypt(decryptedAlgorithm, key, data);
        const blob = new Blob([decryptedData]);
        setProcessedFile({ blob, fileName: file.name.replace('.encrypted', '') });
      }
    } catch (e) {
      console.error(e);
      setError(`Failed to ${mode}. The password might be incorrect or the file may be corrupted.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getKey = async (password: string) => {
      const salt = new TextEncoder().encode('some-static-salt'); // In a real app, this should be unique per file and stored with it.
      const keyMaterial = await window.crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(password),
          'PBKDF2',
          false,
          ['deriveKey']
      );
      return await window.crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
      );
  }

  const handleDownload = () => {
    if (processedFile) {
      const url = URL.createObjectURL(processedFile.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = processedFile.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">File Encryption</h1>
        <p className="text-gray-600 md:text-xl mt-4 max-w-3xl mx-auto">
          Secure your files with AES-256 encryption. Everything happens in your browser.
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
          <CardTitle>Encrypt or Decrypt a File</CardTitle>
          <CardDescription>Your file is never uploaded. All processing is done on your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-full">
                <Button onClick={() => setMode('encrypt')} variant={mode === 'encrypt' ? 'hero' : 'ghost'} className="rounded-full">
                    <Lock className="mr-2 h-4 w-4" /> Encrypt
                </Button>
                <Button onClick={() => setMode('decrypt')} variant={mode === 'decrypt' ? 'hero' : 'ghost'} className="rounded-full">
                    <Unlock className="mr-2 h-4 w-4" /> Decrypt
                </Button>
            </div>

            <div className="space-y-2">
                <label htmlFor="file-upload" className="text-sm font-medium">File</label>
                <Input id="file-upload" type="file" onChange={handleFileChange} />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a strong password" />
            </div>

            <Button onClick={processFile} disabled={isProcessing || !file || !password} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === 'encrypt' ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                {isProcessing ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt File' : 'Decrypt File')}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            
            {processedFile && (
                <div className="text-center space-y-4 p-4 bg-black/20 rounded-md">
                    <p className="text-green-400">File processed successfully!</p>
                    <Button onClick={handleDownload} variant="hero" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download "{processedFile.fileName}"
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}


