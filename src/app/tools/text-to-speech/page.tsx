
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, StopCircle, Volume2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TextToSpeechPage() {
  const [text, setText] = useState('Hello world! Welcome to our text-to-speech tool.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to set a default voice, preferring a local Google US English one if available
        const defaultVoice = availableVoices.find(voice => voice.name === 'Google US English') || availableVoices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      }
    };
    
    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial check

    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
        }
    }
  }, [isSpeaking]);

  const handleSpeak = () => {
    if (!text.trim() || !selectedVoice) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    const voice = voices.find(v => v.name === selectedVoice);
    if(voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const handlePauseResume = () => {
      if(window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsSpeaking(true);
      } else {
          window.speechSynthesis.pause();
          setIsSpeaking(false);
      }
  };

  const handleStop = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
  };


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Text to Speech</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Convert text to audio using your browser's built-in speech engine.
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
          <CardTitle>Converter</CardTitle>
          <CardDescription>Enter text, choose your settings, and generate the audio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="h-40 text-base"
            />
            
            {isClient && (
            <>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="voice">Voice</Label>
                        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                            <SelectTrigger id="voice">
                                <SelectValue placeholder="Select a voice..." />
                            </SelectTrigger>
                            <SelectContent>
                                {voices.map(voice => (
                                    <SelectItem key={voice.name} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rate">Rate ({rate.toFixed(1)})</Label>
                        <Slider id="rate" value={[rate]} onValueChange={(val) => setRate(val[0])} min={0.5} max={2} step={0.1} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pitch">Pitch ({pitch.toFixed(1)})</Label>
                        <Slider id="pitch" value={[pitch]} onValueChange={(val) => setPitch(val[0])} min={0} max={2} step={0.1} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button onClick={handleSpeak} disabled={isSpeaking} className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Speak
                    </Button>
                    <Button onClick={handlePauseResume} disabled={!isSpeaking && !window.speechSynthesis.paused} className="w-full" variant="secondary">
                        <Pause className="mr-2 h-4 w-4" /> Pause / Resume
                    </Button>
                     <Button onClick={handleStop} disabled={!isSpeaking} className="w-full" variant="destructive">
                        <StopCircle className="mr-2 h-4 w-4" /> Stop
                    </Button>
                </div>
             </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
