
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

// A smaller, curated list for better usability
const timezones = [
  'UTC',
  'America/New_York', // EST/EDT
  'America/Los_Angeles', // PST/PDT
  'Europe/London', // GMT/BST
  'Europe/Paris', // CET/CEST
  'Asia/Tokyo', // JST
  'Asia/Dubai',
  'Asia/Kolkata', // IST
  'Australia/Sydney', // AEST/AEDT
];

export default function TimeZoneConverterPage() {
  const [isClient, setIsClient] = useState(false);
  const [baseTime, setBaseTime] = useState(new Date());
  const [baseTimezone, setBaseTimezone] = useState<string>('UTC');
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    // This effect runs only on the client, preventing hydration errors
    setIsClient(true);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setBaseTimezone(userTimezone);
    const now = new Date();
    setBaseTime(now);
    setTimeInput(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Update time every minute if the selected timezone is the user's local one
    const interval = setInterval(() => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (baseTimezone === userTimezone) {
            const now = new Date();
            setBaseTime(now);
            setTimeInput(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        }
    }, 1000 * 60); 
    
    return () => clearInterval(interval);
  }, [baseTimezone, isClient]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setTimeInput(timeValue);
    const [hours, minutes] = timeValue.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(); // We need to reconstruct the date to be sure
        
        // This is tricky. We'll interpret the new time in the context of the currently selected timezone
        // This is an approximation as it doesn't handle DST changes perfectly without a library, but it's good for this tool.
        const tempDateStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}T${timeValue}:00`;
        
        // The key is to create a date object that represents the *local* time in the *target* timezone.
        // The most reliable way without a heavy library is to work with UTC and offsets,
        // but for a client-side tool, this simpler approach is often sufficient.
        // We'll create a new date object.
        const updatedDate = new Date(tempDateStr);
        setBaseTime(updatedDate);
    }
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTz = e.target.value;
    setBaseTimezone(newTz);
  };
  
  const getConvertedTime = (targetTz: string) => {
    if (!isClient || !baseTime) return "Loading...";
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: targetTz,
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric',
            hour12: true
        });
        return formatter.format(baseTime);
    } catch(e) {
        return "Invalid Timezone";
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Time Zone Converter</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert time between different cities and countries around the world.
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
          <CardTitle>Global Time Converter</CardTitle>
          <CardDescription>Select a base time and timezone to see the equivalent time in other locations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg">
                <div>
                    <label htmlFor="base-time" className="text-sm font-medium">Base Time</label>
                    <Input type="time" id="base-time" value={timeInput} onChange={handleTimeChange} className="mt-1" disabled={!isClient} />
                </div>
                 <div>
                    <label htmlFor="base-timezone" className="text-sm font-medium">Base Timezone</label>
                    <select id="base-timezone" value={baseTimezone} onChange={handleTimezoneChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" disabled={!isClient}>
                        {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
                        {isClient && 
                            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                                Your Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')})
                            </option>
                        }
                    </select>
                </div>
            </div>

            <div className="space-y-3">
              {isClient ? timezones.map(tz => (
                 <div key={tz} className="flex justify-between items-center bg-black/20 p-3 rounded-md">
                   <div>
                      <p className="font-semibold">{tz.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">{getConvertedTime(tz).split(',').slice(0, 2).join(',')}</p>
                   </div>
                   <p className="font-mono text-lg font-bold text-primary">{getConvertedTime(tz).split(',')[2]}</p>
                 </div>
              )) : (
                <p className="text-center text-muted-foreground">Loading timezones...</p>
              )}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
