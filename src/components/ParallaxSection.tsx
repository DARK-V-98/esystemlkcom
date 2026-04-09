'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;        // how much the bg moves (default 0.3)
  fadeIn?: boolean;      // fade + slide up on enter
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.3,
  fadeIn = true,
  className = '',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20 });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [0.97, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background layer */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      />

      {/* Content layer with fade-in */}
      {fadeIn ? (
        <motion.div style={{ opacity, scale }}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </div>
  );
}

/* ── Floating parallax orb — reusable decorative element ── */
interface ParallaxOrbProps {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  speed?: number;
  blur?: number;
  opacity?: number;
}

export function ParallaxOrb({
  color, size, top, left, right, bottom,
  speed = 0.2, blur = 120, opacity = 0.12,
}: ParallaxOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0px', `${speed * 200}px`]);

  return (
    <div ref={ref} className="absolute pointer-events-none overflow-hidden inset-0">
      <motion.div
        style={{
          y,
          width: size,
          height: size,
          top, left, right, bottom,
          background: color,
          opacity,
          borderRadius: '50%',
          filter: `blur(${blur}px)`,
          position: 'absolute',
        }}
      />
    </div>
  );
}
