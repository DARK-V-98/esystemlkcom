
'use client';

import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

type AnimatedStatProps = {
  value: string;
  label: string;
  animationDelay?: number;
};

export default function AnimatedStat({ value, label, animationDelay = 0 }: AnimatedStatProps) {
  const numberRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(numberRef, { margin: '-50px' });
  
  const numericValue = parseInt(value.replace('+', ''), 10);
  const suffix = value.includes('+') ? '+' : '';

  useEffect(() => {
    if (isInView && numberRef.current) {
      const node = numberRef.current;
      const controls = animate(0, numericValue, {
        duration: 3, // Increased duration for a slower animation
        delay: animationDelay,
        ease: 'easeOut',
        onUpdate(value) {
          node.textContent = String(Math.round(value));
        },
        onComplete() {
            if(node) {
                node.textContent = String(numericValue);
            }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, numericValue, animationDelay]);

  return (
    <div className="text-center animate-fade-in opacity-0" style={{ animationDelay: `${animationDelay}s` }}>
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            <span ref={numberRef}>0</span>{suffix}
        </div>
        <div className="text-accent-foreground/70">{label}</div>
    </div>
  );
}
