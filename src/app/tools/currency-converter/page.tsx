
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Repeat, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Currency {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
}

interface FreeApiRates {
    [key: string]: number;
}

interface PrimaryApiRates {
    [key: string]: { value: number };
}
interface PrimaryApiCurrencies {
     [key: string]: Currency;
}

type ApiSource = 'primary' | 'free';

// --- Sub-components for better organization ---

const CurrencyInput = ({ amount, onAmountChange, currency, onCurrencyChange, currencies, isDisabled = false }: {
    amount: string;
    onAmountChange: (value: string) => void;
    currency: string;
    onCurrencyChange: (value: string) => void;
    currencies: Currency[];
    isDisabled?: boolean;
}) => (
    <div className="w-full space-y-2">
        <Input 
            type="number" 
            value={amount} 
            onChange={(e) => onAmountChange(e.target.value)} 
            className="text-lg h-12" 
            disabled={isDisabled}
        />
        <select 
            value={currency} 
            onChange={(e) => onCurrencyChange(e.target.value)} 
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={isDisabled}
        >
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </select>
    </div>
);

const LoadingState = () => (
    <div className="flex items-center justify-center h-48">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
);

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">
        <p>Could not load live rates.</p>
        <p className="text-xs">{message}</p>
        <Button onClick={onRetry} variant="destructive" size="sm" className="mt-4">Retry</Button>
    </div>
);

// --- Main Page Component ---

export default function CurrencyConverterPage() {
  // State for API selection
  const [apiSource, setApiSource] = useState<ApiSource>('primary');
  
  // State for Primary API
  const [primaryRates, setPrimaryRates] = useState<PrimaryApiRates | null>(null);
  const [primaryCurrencies, setPrimaryCurrencies] = useState<PrimaryApiCurrencies | null>(null);
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);
  
  // State for Free API
  const [freeRates, setFreeRates] = useState<FreeApiRates | null>(null);
  const [isFreeLoading, setIsFreeLoading] = useState(false);
  const [freeError, setFreeError] = useState<string | null>(null);

  // State for Converter UI
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [lastChanged, setLastChanged] = useState<'amount' | 'converted'>('amount');

  // Fetch data from Primary API
  const fetchPrimaryData = async () => {
    if (isPrimaryLoading || primaryRates) return;
    setIsPrimaryLoading(true);
    setPrimaryError(null);
    try {
      const response = await fetch('/api/currency-rates');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch exchange rates.');
      }
      const result = await response.json();
      if (result.rates && result.currencies) {
          setPrimaryRates(result.rates);
          setPrimaryCurrencies(result.currencies);
      } else {
           throw new Error('Invalid data from primary currency API.');
      }
    } catch (e) {
      setPrimaryError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsPrimaryLoading(false);
    }
  };

  // Fetch data from Free API
  const fetchFreeData = async () => {
    if (isFreeLoading || freeRates) return;
    setIsFreeLoading(true);
    setFreeError(null);
    try {
        const response = await fetch('/api/free-currency-rates');
        if (!response.ok) throw new Error('Failed to fetch free rates.');
        const result = await response.json();
        setFreeRates(result.rates);
    } catch (e) {
        setFreeError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsFreeLoading(false);
    }
  };
  
  useEffect(() => {
    // Always fetch primary data first for the full currency list
    if (!primaryCurrencies && !isPrimaryLoading && !primaryError) {
      fetchPrimaryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to fetch data when API source changes
  useEffect(() => {
    if (apiSource === 'primary' && !primaryRates && !primaryError) {
      fetchPrimaryData();
    } else if (apiSource === 'free' && !freeRates && !freeError) {
      fetchFreeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSource]);

  // Determine current active state based on selected API
  const isLoading = apiSource === 'primary' ? isPrimaryLoading : isFreeLoading;
  const error = apiSource === 'primary' ? primaryError : freeError;
  const rates = apiSource === 'primary' ? primaryRates : freeRates;

  const currencyOptions = useMemo(() => {
    if (primaryCurrencies) {
      return Object.values(primaryCurrencies).sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  }, [primaryCurrencies]);

  // Conversion calculation logic
  useEffect(() => {
    if (!rates) return;

    let fromRateValue: number | undefined;
    let toRateValue: number | undefined;
    
    if (apiSource === 'primary' && primaryRates) {
        fromRateValue = primaryRates[fromCurrency]?.value;
        toRateValue = primaryRates[toCurrency]?.value;
    } else if (apiSource === 'free' && freeRates) {
        fromRateValue = freeRates[fromCurrency];
        toRateValue = freeRates[toCurrency];
    }
    
    if (fromRateValue === undefined || toRateValue === undefined) {
        if (lastChanged === 'amount') setConvertedAmount('');
        else setAmount('');
        return;
    }
    
    if (lastChanged === 'amount') {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum)) {
            setConvertedAmount('');
            return;
        }
        const amountInBase = amountNum / fromRateValue;
        const finalAmount = amountInBase * toRateValue;
        setConvertedAmount(finalAmount.toFixed(4));

    } else { // lastChanged === 'converted'
        const convertedNum = parseFloat(convertedAmount);
        if (isNaN(convertedNum)) {
            setAmount('');
            return;
        }
        const amountInBase = convertedNum / toRateValue;
        const finalAmount = amountInBase * fromRateValue;
        setAmount(finalAmount.toFixed(4));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, convertedAmount, fromCurrency, toCurrency, rates, lastChanged, apiSource]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const handleRetry = () => {
    if (apiSource === 'primary') {
      fetchPrimaryData();
    } else {
      fetchFreeData();
    }
  }

  const isFormDisabled = !primaryCurrencies;
  const isInputDisabled = isLoading || !rates || currencyOptions.length === 0;


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Currency Converter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert between major currencies using live exchange rates.
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

      <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Convert Currency</CardTitle>
              <CardDescription>Enter an amount and select your currencies.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="api-switch" className={apiSource === 'free' ? 'text-primary' : 'text-muted-foreground'}>Free Rates</Label>
                <Switch 
                  id="api-switch" 
                  checked={apiSource === 'primary'} 
                  onCheckedChange={(checked) => setApiSource(checked ? 'primary' : 'free')}
                  disabled={isFormDisabled}
                />
                <Label htmlFor="api-switch" className={apiSource === 'primary' ? 'text-primary' : 'text-muted-foreground'}>Live Rates</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           {isFormDisabled ? <LoadingState /> : error ? <ErrorState message={error} onRetry={handleRetry} /> : (
            <>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <CurrencyInput 
                      amount={amount}
                      onAmountChange={(value) => { setAmount(value); setLastChanged('amount'); }}
                      currency={fromCurrency}
                      onCurrencyChange={setFromCurrency}
                      currencies={currencyOptions}
                      isDisabled={isInputDisabled}
                  />
                  <Button variant="ghost" size="icon" onClick={handleSwap} className="shrink-0 mt-8" disabled={isInputDisabled}>
                    <Repeat className="w-5 h-5 text-primary"/>
                  </Button>
                  <CurrencyInput 
                      amount={convertedAmount}
                      onAmountChange={(value) => { setConvertedAmount(value); setLastChanged('converted'); }}
                      currency={toCurrency}
                      onCurrencyChange={setToCurrency}
                      currencies={currencyOptions}
                      isDisabled={isInputDisabled}
                  />
                </div>
                <div className="text-center text-muted-foreground text-xs p-4 rounded-md bg-black/20 flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" />
                  {apiSource === 'primary' 
                    ? 'Using live rates provided by currencyapi.com.' 
                    : 'Using free-tier rates. Data may be less frequent.'}
                </div>
            </>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
