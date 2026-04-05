'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Rocket, MousePointer2, Layers, Cpu, Server } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CosmicHero = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]"
        />
        
        {/* Particle Stars */}
        <div className="absolute inset-0 opacity-30">
           {[...Array(50)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-white rounded-full"
               initial={{ 
                 x: Math.random() * 2000 - 1000, 
                 y: Math.random() * 2000 - 1000,
                 opacity: Math.random()
               }}
               animate={{ 
                 opacity: [0.2, 0.8, 0.2],
                 scale: [1, 1.5, 1],
               }}
               transition={{ 
                 duration: Math.random() * 3 + 2, 
                 repeat: Infinity,
                 delay: Math.random() * 5
               }}
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
             />
           ))}
        </div>

        {/* Abstract Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium tracking-wider uppercase">Next Era of Tech</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]"
          >
             <span className="text-shimmer block">BUILDING</span> 
             THE FUTURISTIC <br/> 
             <span className="text-primary italic">ECOSYSTEM.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            We transform complex challenges into elegant digital solutions. 
            From robust backend architectures to mesmerizing user interfaces.
          </motion.p>

          {/* Dynamic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button asChild variant="hero" size="xl" className="rounded-2xl px-12 neon-glow group">
              <Link href="#contact" className="gap-3">
                Deploy Your Vision 
                <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl" className="rounded-2xl px-12 border-white/20 text-white hover:bg-white/10 transition-colors">
              <Link href="#services" className="gap-3">
                <Layers className="w-5 h-5" />
                Our Stack
              </Link>
            </Button>
          </motion.div>

          {/* Feature Strip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-24 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-12 text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Cloud Native
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" /> Edge Performance
            </div>
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-4 h-4" /> AI Driven
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements Corner */}
      <div className="absolute bottom-20 left-20 hidden xl:block">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="w-32 h-32 border border-primary/20 rounded-full flex items-center justify-center"
        >
           <div className="w-24 h-24 border-dashed border border-white/10 rounded-full" />
        </motion.div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default CosmicHero;
