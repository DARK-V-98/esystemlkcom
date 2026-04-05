
"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Upload, Loader2, Sheet } from 'lucide-react';
import Link from 'next/link';

export default function CsvExcelConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const convertAndDownload = () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const results = Papa.parse(text, { header: false });
        
        if (results.errors.length > 0) {
            throw new Error(`CSV Parsing Error: ${results.errors[0].message}`);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(results.data as any[][]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const fileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.xlsx';
        XLSX.writeFile(workbook, fileName);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to convert file.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">CSV to Excel Converter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert your CSV files into XLSX spreadsheets for business analysis.
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
          <CardTitle>Convert CSV to XLSX</CardTitle>
          <CardDescription>Your file is converted in your browser and never uploaded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">CSV File</label>
            <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="p-4 bg-black/20 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Selected file: <span className="font-medium text-foreground">{file.name}</span></p>
            </div>
          )}

          <Button onClick={convertAndDownload} disabled={isProcessing || !file} className="w-full">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sheet className="mr-2 h-4 w-4" />}
            {isProcessing ? 'Converting...' : 'Convert & Download XLSX'}
          </Button>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
