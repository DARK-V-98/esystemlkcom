'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Globe, Sparkles, Zap, Shield, Rocket, Laptop, Smartphone, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ModernHero = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for interactive background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]: [number, number]) => `radial-gradient(600px circle at ${x}px ${y}px, hsl(var(--primary) / 0.15), transparent 80%)`
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-32"
    >
      {/* Interactive Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-slate opacity-[0.3] dark:opacity-[0.1]" />
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: spotlightBackground }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-0" />
      </div>

      {/* Ornamentals */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-float" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Content Left */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Software Development</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
            >
              {"Architecting Digital Excellence for Your Vision.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {word === "Digital" || word === "Excellence" ? (
                    <span className="text-primary italic">{word}&nbsp;</span>
                  ) : (
                    word + " "
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              We craft high-performance websites, scalable web applications, and intuitive software ecosystems. 
              Premium quality engineering at competitive rates, starting from <span className="text-foreground font-semibold">$150</span>.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Button asChild variant="hero" size="xl" className="rounded-full shadow-red-lg">
                <Link href="#contact" className="gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl" className="rounded-full glass">
                <Link href="#portfolio" className="gap-2">
                  View Our Work
                </Link>
              </Button>
            </motion.div>

            {/* Micro Stats/Features */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Shield className="w-4 h-4 text-primary" />
                </div>
                <span>Secured Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>High Performance</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Globe className="w-4 h-4 text-primary" />
                </div>
                <span>Scalable Design</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Graphical Representation Right */}
          <motion.div 
            className="flex-1 relative w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Visual Block - Main Container */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass border-white/10 p-8 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
              
              {/* Interactive Elements Decoration */}
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-50">
                  <div className="absolute top-[10%] right-[10%] w-40 h-40 border border-primary/20 rounded-full animate-spin-slow" />
                  <div className="absolute bottom-[20%] left-[10%] w-24 h-24 border border-dashed border-primary/30 rounded-full" />
              </div>

              {/* Main Illustration Stack */}
              <div className="relative z-20 flex flex-col items-center">
                 <motion.div 
                   animate={{ y: [0, -20, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="relative"
                 >
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-primary rounded-[2rem] flex items-center justify-center shadow-red-lg transform rotate-12 relative z-20">
                        <Code2 className="w-16 h-16 md:w-24 md:h-24 text-white -rotate-12" />
                    </div>
                    {/* Floating Glow under icon */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/40 blur-2xl rounded-full" />
                 </motion.div>
                 
                 <div className="mt-12 flex gap-4">
                    <motion.div 
                      animate={{ y: [0, 15, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="glass border-primary/20 px-6 py-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl"
                    >
                        <Laptop className="w-8 h-8 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">Web Apps</span>
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 15, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="glass border-primary/20 px-6 py-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl"
                    >
                        <Smartphone className="w-8 h-8 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">Mobile UI</span>
                    </motion.div>
                 </div>
              </div>

              {/* Floating feature pills in the visual */}
              <div className="absolute top-12 left-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>99.9% Clean Code</span>
                  </motion.div>
              </div>

              <div className="absolute bottom-12 right-12">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    <Rocket className="w-4 h-4 text-orange-500" />
                    <span>Fast Performance</span>
                  </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHero;
