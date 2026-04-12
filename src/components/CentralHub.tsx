'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  Globe,
  Smartphone,
  Monitor,
  LayoutDashboard,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

/* ─── Parallax orbs ─── */
function ParallaxOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['-10%', '30%']);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, background: 'radial-gradient(circle, #ff003c 0%, transparent 70%)', filter: 'blur(80px)' }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{ y: y2, background: 'radial-gradient(circle, #00eaff 0%, transparent 70%)', filter: 'blur(100px)' }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        style={{ y: y3, background: 'radial-gradient(circle, #ff003c 0%, transparent 70%)', filter: 'blur(120px)' }}
        className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full"
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  );
}

/* ─── Animated letter-by-letter headline ─── */
function AnimatedLine({
  text,
  color,
  delay = 0,
  glow,
}: {
  text: string;
  color: string;
  delay?: number;
  glow?: string;
}) {
  return (
    <span className="block">
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{ color, textShadow: glow ? `0 0 20px ${glow}, 0 0 40px ${glow}60` : undefined }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Feature card ─── */
interface CardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, desc, color, delay }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: `0 0 30px ${color}50, 0 20px 60px rgba(0,0,0,0.6)` }}
      className="relative rounded-2xl p-6 flex flex-col gap-4 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 0 0px ${color}00`,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-bl-2xl rounded-tr-2xl opacity-20"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}50`, boxShadow: `0 0 16px ${color}30` }}
      >
        <Icon className="w-6 h-6" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
      </div>
      <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color }}>
        {title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {desc}
      </p>
    </motion.div>
  );
}

/* ─── Orbiting hub diagram ─── */
const ORBIT_ICONS = [
  { Icon: Globe,      color: '#00eaff', angle: 0   },
  { Icon: Smartphone, color: '#ff003c', angle: 90  },
  { Icon: Monitor,    color: '#00eaff', angle: 180 },
  { Icon: Zap,        color: '#ff003c', angle: 270 },
];

function HubDiagram() {
  const RADIUS = 110;

  return (
    <div className="relative flex items-center justify-center scale-90 sm:scale-100" style={{ width: 300, height: 300 }}>
      {/* Orbit ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: RADIUS * 2 + 48,
          height: RADIUS * 2 + 48,
          border: '1px dashed rgba(0,234,255,0.2)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      {/* Center hub */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px #ff003c40, 0 0 40px #ff003c20',
            '0 0 40px #ff003c80, 0 0 80px #ff003c40',
            '0 0 20px #ff003c40, 0 0 40px #ff003c20',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, #1a0008 0%, #050505 100%)',
          border: '2px solid #ff003c80',
        }}
      >
        <span className="text-[9px] font-black tracking-[0.2em] text-center leading-tight uppercase" style={{ color: '#ff003c' }}>
          ESYSTEM<br />LK
        </span>
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          style={{ border: '1px solid #ff003c60' }}
        />
      </motion.div>

      {/* Orbiting icons */}
      {ORBIT_ICONS.map(({ Icon, color, angle }, idx) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * RADIUS;
        const y = Math.sin(rad) * RADIUS;

        return (
          <motion.div
            key={idx}
            className="absolute"
            style={{ left: '50%', top: '50%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: idx * 0.5 }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: x - 20,
                top: y - 20,
                width: 40,
                height: 40,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: idx * 0.5 }}
            >
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}60`,
                  boxShadow: `0 0 14px ${color}50`,
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }}
              >
                <Icon className="w-5 h-5" style={{ color, filter: `drop-shadow(0 0 5px ${color})` }} />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Dashed connector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        {ORBIT_ICONS.map(({ color, angle }, idx) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 150 + Math.cos(rad) * RADIUS;
          const y2 = 150 + Math.sin(rad) * RADIUS;
          return (
            <motion.line
              key={idx}
              x1="150" y1="150"
              x2={x2} y2={y2}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.35"
              animate={{ strokeDashoffset: [0, -40] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: idx * 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Count-up stat ─── */
function StatItem({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const isNumeric = /^\d+/.test(value);
    if (!isNumeric) { setDisplayed(value); return; }

    const num = parseInt(value);
    const suffix = value.replace(/^\d+/, '');
    let start = 0;
    const steps = 40;
    const step = num / steps;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start = Math.min(Math.round(step * frame), num);
      setDisplayed(`${start}${suffix}`);
      if (start >= num) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <motion.span
        className="text-5xl md:text-6xl font-black tracking-tight"
        style={{ color, textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40` }}
        animate={{ textShadow: [`0 0 20px ${color}60`, `0 0 40px ${color}cc`, `0 0 20px ${color}60`] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {displayed}
      </motion.span>
      <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Main section ─── */
const CARDS: CardProps[] = [
  { icon: Globe,           title: 'WEBSITES',        desc: 'All your websites live and monitored in one place',          color: '#00eaff', delay: 0.1 },
  { icon: Smartphone,      title: 'MOBILE APPS',     desc: 'Your apps, updates, and analytics — all here',              color: '#ff003c', delay: 0.2 },
  { icon: Monitor,         title: 'SOFTWARE SYSTEMS', desc: 'POS, HRM, ERP — managed from one dashboard',               color: '#00eaff', delay: 0.3 },
  { icon: LayoutDashboard, title: 'ONE DASHBOARD',   desc: 'Login once. Control everything.',                           color: '#ff003c', delay: 0.4 },
];

const STATS = [
  { value: '25+', label: 'Businesses Connected', color: '#ff003c' },
  { value: '1',    label: 'Central Hub',           color: '#00eaff' },
  { value: '6+',   label: 'Years Experience',       color: '#ff003c' },
];

export default function CentralHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#050505', minHeight: '100vh' }}
    >
      <ParallaxOrbs />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="ch-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="#00eaff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ch-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center gap-20">

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(255,0,60,0.08)',
            border: '1px solid rgba(255,0,60,0.4)',
            boxShadow: '0 0 24px rgba(255,0,60,0.2)',
          }}
        >
          <motion.span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: '#ff003c', boxShadow: '0 0 8px #ff003c' }}
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-xs font-black tracking-[0.35em] uppercase" style={{ color: '#ff003c' }}>
            🇱🇰 FIRST IN SRI LANKA
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight uppercase">
            {inView && (
              <>
                <AnimatedLine text="ALL YOUR SYSTEMS." color="#ffffff" delay={0} />
                <AnimatedLine text="ONE CENTRAL HUB." color="#ffffff" delay={0.6} />
                <AnimatedLine text="SIMPLY MANAGED." color="#00eaff" delay={1.2} glow="#00eaff" />
              </>
            )}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 2.2 }}
            className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Every website, app, software, and system we build for you — connected to one powerful dashboard.
            Manage everything from a single place.
          </motion.p>
        </div>

        {/* ── Feature cards ── */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>

        {/* ── Hub diagram ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs font-black tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
            CENTRAL SYSTEM ARCHITECTURE
          </p>
          <HubDiagram />
          <p className="text-xs tracking-widest uppercase font-bold" style={{ color: 'rgba(0,234,255,0.5)' }}>
            cs.esystemlk.com
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <div className="w-full grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.a
            href="https://cs.esystemlk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm md:text-base tracking-[0.15em] uppercase text-white"
            style={{
              background: 'linear-gradient(135deg, #ff003c, #cc0030)',
              border: '1px solid rgba(255,0,60,0.6)',
              boxShadow: '0 0 30px rgba(255,0,60,0.4), 0 0 60px rgba(255,0,60,0.15)',
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(255,0,60,0.4), 0 0 60px rgba(255,0,60,0.15)',
                '0 0 50px rgba(255,0,60,0.7), 0 0 90px rgba(255,0,60,0.3)',
                '0 0 30px rgba(255,0,60,0.4), 0 0 60px rgba(255,0,60,0.15)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(255,0,60,0.8), 0 0 100px rgba(255,0,60,0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            ACCESS YOUR HUB
            <ArrowRight className="w-5 h-5" />
            <span className="opacity-60 text-xs">cs.esystemlk.com</span>
          </motion.a>

          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: '#00eaff' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(0,234,255,0.6)' }}>
              FIRST IN SRI LANKA · ONE HUB · ALL SYSTEMS
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
