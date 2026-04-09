'use client';

import { useState } from 'react';
import { Phone, Monitor, Facebook } from 'lucide-react';

interface DrawerProps {
  position: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  glowColor: string;
}

function Drawer({ position, label, sublabel, icon, href, color, glowColor }: DrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative select-none"
      style={{
        width: 200,
        height: 50,
        marginBottom: 10,
        perspective: '600px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Back panel — chest body */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9)',
        }}
      />

      {/* Drawer face */}
      <a
        href={href}
        target={href.startsWith('tel') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={(e) => { e.preventDefault(); setOpen(true); }}
        onTouchEnd={() => setOpen(false)}
        className="absolute inset-0 rounded-xl flex items-center gap-3 px-4 no-underline"
        style={{
          background: open
            ? `linear-gradient(135deg, ${color}30, ${color}15)`
            : `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${open ? color : color + '50'}`,
          boxShadow: open
            ? `0 0 30px ${glowColor}50, 0 12px 40px rgba(0,0,0,0.7), inset 0 1px 0 ${color}40`
            : `0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 ${color}20`,
          transform: open
            ? 'translate3d(-8px, -4px, 32px)'
            : 'translate3d(0, 0, 0)',
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 10,
          cursor: 'pointer',
        }}
      >
        {/* Handle bar at top */}
        <div
          className="absolute rounded-full"
          style={{
            width: '35%',
            height: 3,
            top: 7,
            left: '50%',
            transform: 'translateX(-50%)',
            background: open ? color : `${color}40`,
            boxShadow: open ? `0 0 8px ${glowColor}` : 'none',
            transition: 'all 0.3s',
          }}
        />

        {/* Icon box */}
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 32,
            height: 32,
            background: open ? `${color}25` : `${color}12`,
            border: `1px solid ${open ? color : color + '40'}`,
            boxShadow: open ? `0 0 14px ${glowColor}70` : 'none',
            transition: 'all 0.3s',
          }}
        >
          <span style={{
            color: open ? color : '#ffffff90',
            filter: open ? `drop-shadow(0 0 6px ${glowColor})` : 'none',
            transition: 'all 0.3s',
          }}>
            {icon}
          </span>
        </div>

        {/* Labels */}
        <div className="flex flex-col leading-tight">
          <span
            className="text-[11px] font-black uppercase tracking-widest"
            style={{
              color: open ? color : '#ffffffcc',
              textShadow: open ? `0 0 10px ${glowColor}` : 'none',
              transition: 'all 0.3s',
            }}
          >
            {label}
          </span>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: '#ffffff40' }}>
            {sublabel}
          </span>
        </div>
      </a>
    </div>
  );
}

export default function HeroDrawers() {
  const drawers: DrawerProps[] = [
    {
      position: 1,
      label: 'Call Us',
      sublabel: '+94 76 571 1396',
      icon: <Phone className="w-4 h-4" />,
      href: 'tel:+94765711396',
      color: '#ff003c',
      glowColor: '#ff003c',
    },
    {
      position: 2,
      label: 'Central System',
      sublabel: 'cs.esystemlk.com',
      icon: <Monitor className="w-4 h-4" />,
      href: 'https://cs.esystemlk.com',
      color: '#00eaff',
      glowColor: '#00eaff',
    },
    {
      position: 3,
      label: 'Follow Us',
      sublabel: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      href: 'https://web.facebook.com/esystemlk/',
      color: '#1877f2',
      glowColor: '#1877f2',
    },
  ];

  return (
    <div
      className="flex flex-col items-end"
      style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}
    >
      {drawers.map(d => (
        <Drawer key={d.position} {...d} />
      ))}
    </div>
  );
}
