'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, TrendingUp, Cpu, Globe, Cloud, Server,
  Network, Rocket, ArrowRight
} from 'lucide-react';

/* ── Particles ── */
const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 2,
  color: i % 2 === 0 ? '#ff003c' : '#00eaff',
  dur: Math.random() * 5 + 4,
  delay: Math.random() * 4,
}));

function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, filter: `blur(${p.size / 2}px)` }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Grid ── */
function TechGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
        <defs>
          <pattern id="cg" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke="#00eaff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cg)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
        <motion.line x1="0" y1="35%" x2="100%" y2="35%" stroke="#ff003c" strokeWidth="0.6" strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, -300] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
        <motion.line x1="0" y1="65%" x2="100%" y2="65%" stroke="#00eaff" strokeWidth="0.6" strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, -300] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />
        <motion.line x1="25%" y1="0" x2="25%" y2="100%" stroke="#00eaff" strokeWidth="0.6" strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, -300] }} transition={{ duration: 11, repeat: Infinity, ease: 'linear' }} />
        <motion.line x1="75%" y1="0" x2="75%" y2="100%" stroke="#ff003c" strokeWidth="0.6" strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, -300] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
      </svg>
    </div>
  );
}

/* ── Neon Icon ── */
function NeonIcon({ Icon, color, delay = 0 }: { Icon: React.ElementType; color: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }} className="flex flex-col items-center gap-2">
      <motion.div animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}80`, boxShadow: `0 0 20px ${color}40` }}>
        <Icon className="w-7 h-7" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Network diagram — image based ── */
function NetworkDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] aspect-square"
    >
      <motion.img
        src="/p.jpg"
        alt="ESYSTEMLK Network Diagram"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 0 16px #00eaff30) drop-shadow(0 0 30px #ff003c15)' }}
      />
    </motion.div>
  );
}

/* ── Scenes ── */
const SCENES = [
  {
    id: 0,
    duration: 4000,
    render: () => (
      <div className="flex flex-col items-center gap-4 md:gap-6 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border"
          style={{ borderColor: '#ff003c60', background: '#ff003c10', boxShadow: '0 0 20px #ff003c30' }}>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-ping" style={{ background: '#ff003c' }} />
          <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase" style={{ color: '#ff003c' }}>THE QUESTION</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight max-w-3xl uppercase tracking-tight">
          <span style={{ color: '#fff' }}>ARE YOU READY TO</span><br />
          <span style={{ color: '#ff003c', textShadow: '0 0 30px #ff003c' }}>BUILD YOUR BUSINESS</span><br />
          <span style={{ color: '#00eaff', textShadow: '0 0 30px #00eaff' }}>ONLINE PRESENCE?</span>
        </motion.h2>
      </div>
    ),
  },
  {
    id: 1,
    duration: 4500,
    render: () => (
      <div className="flex flex-col items-center gap-6 md:gap-8 text-center px-6">
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-lg md:text-2xl font-bold max-w-2xl leading-relaxed uppercase tracking-wide" style={{ color: '#ffffff80' }}>
          WITH OVER{' '}
          <span className="font-black" style={{ color: '#00eaff', textShadow: '0 0 15px #00eaff' }}>6 YEARS OF EXPERIENCE</span>
          {' '}AND A{' '}
          <span className="font-black" style={{ color: '#ff003c', textShadow: '0 0 15px #ff003c' }}>99% SUCCESS RATE</span>,
          <br className="hidden md:block" /> WE HELP BUSINESSES GROW THEIR DIGITAL PRESENCE.
        </motion.p>
        <div className="flex gap-4 md:gap-6">
          <NeonIcon Icon={CheckCircle2} color="#00eaff" delay={0.3} />
          <NeonIcon Icon={TrendingUp}   color="#ff003c" delay={0.5} />
          <NeonIcon Icon={Cpu}          color="#00eaff" delay={0.7} />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    duration: 4500,
    render: () => (
      <div className="flex flex-col items-center gap-4 md:gap-6 text-center px-4">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-xl md:text-4xl font-black uppercase tracking-tight" style={{ color: '#ffffff50' }}>
          WE DON'T JUST BUILD WEBSITES
        </motion.p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="h-0.5 w-32 md:w-48 origin-left"
          style={{ background: 'linear-gradient(90deg,#ff003c,#00eaff)', boxShadow: '0 0 12px #00eaff' }} />
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight"
          style={{ color: '#00eaff', textShadow: '0 0 30px #00eaff' }}>
          WE BUILD COMPLETE<br />DIGITAL ECOSYSTEMS
        </motion.p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-2">
          <NeonIcon Icon={Globe}   color="#00eaff" delay={0.8}  />
          <NeonIcon Icon={Cloud}   color="#ff003c" delay={0.95} />
          <NeonIcon Icon={Server}  color="#00eaff" delay={1.1}  />
          <NeonIcon Icon={Network} color="#ff003c" delay={1.25} />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    duration: 5000,
    render: () => (
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
          <span style={{ color: '#fff' }}>FROM MODERN WEBSITES</span><br />
          <span style={{ color: '#ff003c', textShadow: '0 0 20px #ff003c' }}>TO FULLY CONNECTED</span><br />
          <span style={{ color: '#00eaff', textShadow: '0 0 20px #00eaff' }}>OFFICE SYSTEMS</span>
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="w-full">
          <NetworkDiagram />
        </motion.div>
      </div>
    ),
  },
  {
    id: 4,
    duration: 4000,
    render: () => (
      <div className="flex flex-col items-center gap-6 md:gap-8 text-center px-4">
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight max-w-3xl">
          <span style={{ color: '#ffffff70' }}>POWER YOUR ENTIRE BUSINESS</span><br />
          <span style={{ color: '#ff003c', textShadow: '0 0 30px #ff003c' }}>WITH ONE SMART</span><br />
          <span style={{ color: '#00eaff', textShadow: '0 0 30px #00eaff' }}>TECHNOLOGY HUB</span>
        </motion.p>
        <motion.div
          animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 30px #ff003c40', '0 0 60px #ff003c80', '0 0 30px #ff003c40'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
          style={{ background: '#ff003c15', border: '2px solid #ff003c' }}
        >
          <Rocket className="w-7 h-7 md:w-9 md:h-9" style={{ color: '#ff003c', filter: 'drop-shadow(0 0 10px #ff003c)' }} />
        </motion.div>
      </div>
    ),
  },
  {
    id: 5,
    duration: 5000,
    render: () => (
      <div className="flex flex-col items-center gap-6 md:gap-8 text-center px-6">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="text-[10px] md:text-sm font-black tracking-[0.4em] uppercase" style={{ color: '#ffffff30' }}>
          THE FUTURE STARTS NOW
        </motion.p>
        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl md:text-5xl font-black uppercase tracking-tight" style={{ color: '#fff' }}>
          READY TO GET STARTED?
        </motion.h3>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
          <Link href="#contact"
            className="inline-flex items-center justify-center gap-3 px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg tracking-widest uppercase w-full sm:w-auto text-center"
            style={{
              background: 'linear-gradient(135deg,#ff003c,#cc0030)',
              color: '#fff',
              boxShadow: '0 0 30px #ff003c60, 0 0 60px #ff003c30',
              border: '1px solid #ff003c80',
            }}>
            START BUILDING YOUR DIGITAL FUTURE
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </motion.div>
        <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-xs md:text-sm tracking-widest uppercase font-bold" style={{ color: '#00eaff80' }}>
          FREE CONSULTATION · NO COMMITMENT
        </motion.p>
      </div>
    ),
  },
];

/* ── Dots ── */
function Dots({ current, total, onDot }: { current: number; total: number; onDot: (i: number) => void }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onDot(i)}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 28 : 8, height: 8,
            background: i === current ? '#ff003c' : '#ffffff30',
            boxShadow: i === current ? '0 0 10px #ff003c' : 'none',
          }} />
      ))}
    </div>
  );
}

/* ── Main ── */
export default function CinematicStory() {
  const [scene, setScene] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScene(i);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setScene(prev => (prev + 1) % SCENES.length);
    }, SCENES[scene].duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scene]);

  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: '100vh' }}>
      <Particles />
      <TechGrid />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[150px] pointer-events-none" style={{ background: '#ff003c0d' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[150px] pointer-events-none" style={{ background: '#00eaff0a' }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen pb-20">
        <AnimatePresence mode="wait">
          <motion.div key={scene}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mx-auto px-4">
            {SCENES[scene].render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <motion.div key={`bar-${scene}`}
        className="absolute bottom-0 left-0 h-0.5 z-20"
        style={{ background: 'linear-gradient(90deg,#ff003c,#00eaff)', boxShadow: '0 0 8px #00eaff' }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: SCENES[scene].duration / 1000, ease: 'linear' }}
      />

      <Dots current={scene} total={SCENES.length} onDot={goTo} />
    </section>
  );
}
