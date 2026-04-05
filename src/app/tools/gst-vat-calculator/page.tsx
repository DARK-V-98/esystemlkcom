
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function GstVatCalculatorPage() {
  const [basePrice, setBasePrice] = useState('100');
  const [taxRate, setTaxRate] = useState('18');
  const [finalPrice, setFinalPrice] = useState('');
  const [taxAmount, setTaxAmount] = useState('');

  const calculate = (mode: 'add' | 'remove') => {
    const priceNum = parseFloat(basePrice);
    const rateNum = parseFloat(taxRate);

    if (isNaN(priceNum) || isNaN(rateNum)) {
      setFinalPrice('');
      setTaxAmount('');
      return;
    }

    if (mode === 'add') {
      const tax = priceNum * (rateNum / 100);
      setTaxAmount(tax.toFixed(2));
      setFinalPrice((priceNum + tax).toFixed(2));
    } else { // remove
      const originalPrice = priceNum / (1 + rateNum / 100);
      const tax = priceNum - originalPrice;
      setTaxAmount(tax.toFixed(2));
      setFinalPrice(originalPrice.toFixed(2));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">GST / VAT Calculator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Quickly add or remove GST/VAT from any price for your business calculations.
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
          <CardTitle>Tax Calculator</CardTitle>
          <CardDescription>Enter a price and tax rate to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base-price">Amount</Label>
              <Input id="base-price" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="e.g., 100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g., 18" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Button onClick={() => calculate('add')} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Tax
            </Button>
            <Button onClick={() => calculate('remove')} variant="secondary" className="w-full">
              <Minus className="mr-2 h-4 w-4" /> Remove Tax
            </Button>
          </div>

          {(finalPrice || taxAmount) && (
            <Card className="bg-black/20 text-center p-6">
              <CardTitle className="text-primary mb-2">Results</CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Price:</span>
                    <span className="font-bold text-xl">{finalPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Amount:</span>
                    <span className="font-bold text-xl">{taxAmount}</span>
                </div>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
