'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Rocket, Layers, Cpu, Server, MousePointer2 } from "lucide-react";
import Link from "next/link";
import HeroDrawers from "@/components/HeroDrawers";

const CosmicHero = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale  = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 45%, #dbeafe 100%)' }}
    >
      {/* ── Background decoration ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb — top right */}
        <div
          className="absolute top-[-8%] right-[-6%] w-[48%] h-[48%] rounded-full"
          style={{ background: 'hsl(213,94%,52%,0.10)', filter: 'blur(110px)' }}
        />
        {/* Secondary orb — bottom left */}
        <div
          className="absolute bottom-[-6%] left-[-4%] w-[38%] h-[38%] rounded-full"
          style={{ background: 'hsl(199,89%,65%,0.09)', filter: 'blur(90px)' }}
        />
        {/* Center soft glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full"
          style={{ background: 'hsl(213,94%,52%,0.05)', filter: 'blur(140px)' }}
        />
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.035 }}>
          <defs>
            <pattern id="hg" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="hsl(213,94%,52%)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg)" />
        </svg>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-white/70 backdrop-blur-md shadow-sm mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium tracking-wider uppercase text-primary">
              Next Era of Tech
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95] break-words"
          >
            <span className="text-shimmer block">BUILDING</span>
            <span className="block sm:inline text-foreground">THE FUTURISTIC</span>
            <br className="hidden sm:block" />
            <span className="text-primary italic block sm:inline">ECOSYSTEM.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4 sm:px-0"
          >
            We take your toughest problems and turn them into software that actually works — clean backends, fast frontends, and everything in between.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6 sm:px-0"
          >
            <Button asChild variant="hero" size="xl" className="rounded-2xl px-12 neon-glow group w-full sm:w-auto">
              <Link href="#contact" className="gap-3">
                Deploy Your Vision
                <Rocket className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="heroOutline"
              size="xl"
              className="rounded-2xl px-12 w-full sm:w-auto glass-card"
            >
              <Link href="#services" className="gap-3">
                <Layers className="w-5 h-5" />
                Our Stack
              </Link>
            </Button>
          </motion.div>

          {/* Feature strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-primary/12 flex flex-wrap justify-center gap-6 md:gap-12 text-primary/70 uppercase tracking-[0.2em] text-[10px] font-bold"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Cloud Native
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Edge Performance
            </div>
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-4 h-4 text-primary" />
              AI Driven
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating ring — bottom left */}
      <div className="absolute bottom-20 left-20 hidden xl:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            border: '1px solid hsl(213,94%,52%,0.28)',
            boxShadow: '0 0 20px hsl(213,94%,52%,0.10)',
          }}
        >
          <div
            className="w-24 h-24 rounded-full"
            style={{ border: '1px dashed hsl(213,94%,52%,0.18)' }}
          />
        </motion.div>
      </div>

      {/* HeroDrawers — bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-16 right-6 md:right-10 z-20"
      >
        <HeroDrawers />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default CosmicHero;
