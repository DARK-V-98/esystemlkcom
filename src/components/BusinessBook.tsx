'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Building2, Building, TrendingUp, Globe, ShoppingCart,
  Users, BarChart3, Shield, Smartphone, Clock, Star,
  ArrowRight, ArrowLeft, ChevronRight
} from 'lucide-react';

const PAGES = [
  {
    id: 0, tag: 'INTRODUCTION', tagColor: '#ff003c',
    title: 'WHY YOUR BUSINESS\nNEEDS A DIGITAL PRESENCE',
    subtitle: 'IN 2025, IF YOU\'RE NOT ONLINE — YOU DON\'T EXIST TO MOST CUSTOMERS.',
    body: 'Over 80% of customers search online before making a purchase decision. Whether you run a small tea shop or a large corporation, your digital presence is your first impression.',
    icon: Globe, iconColor: '#ff003c',
    stat: { value: '80%', label: 'OF CUSTOMERS SEARCH ONLINE FIRST' },
    bg: 'from-red-50 to-white', accent: '#ff003c',
  },
  {
    id: 1, tag: 'SMALL BUSINESS', tagColor: '#16a34a',
    title: 'SMALL BUSINESS\nSTARTER PACK',
    subtitle: 'YOU DON\'T NEED A BIG BUDGET TO LOOK PROFESSIONAL ONLINE.',
    body: 'A simple website with your services, contact info, and location puts you on the map. Customers can find you on Google, trust you faster, and contact you 24/7 even when your shop is closed.',
    icon: Store, iconColor: '#16a34a',
    stat: { value: '3×', label: 'MORE INQUIRIES WITH A WEBSITE VS WITHOUT' },
    bg: 'from-green-50 to-white', accent: '#16a34a',
    points: ['GOOGLE MAPS LISTING & LOCAL SEO', 'ONLINE CONTACT FORM & WHATSAPP LINK', 'SERVICE / PRODUCT SHOWCASE', 'CUSTOMER REVIEWS DISPLAY'],
  },
  {
    id: 2, tag: 'SMALL BUSINESS', tagColor: '#16a34a',
    title: 'TURN VISITORS\nINTO CUSTOMERS',
    subtitle: 'YOUR WEBSITE WORKS WHILE YOU SLEEP.',
    body: 'With an online booking system or inquiry form, customers can reach you at 2am. Automated replies, WhatsApp integration, and a clean portfolio builds trust before they even call you.',
    icon: Clock, iconColor: '#16a34a',
    stat: { value: '24/7', label: 'YOUR WEBSITE TAKES INQUIRIES FOR YOU' },
    bg: 'from-green-50 to-white', accent: '#16a34a',
    points: ['AUTOMATED INQUIRY RESPONSES', 'ONLINE APPOINTMENT BOOKING', 'PORTFOLIO & BEFORE/AFTER GALLERY', 'WHATSAPP CHAT INTEGRATION'],
  },
  {
    id: 3, tag: 'MID-LEVEL BUSINESS', tagColor: '#2563eb',
    title: 'SCALE UP WITH\nSMART SYSTEMS',
    subtitle: 'MANUAL WORK IS COSTING YOU TIME AND MONEY.',
    body: 'At mid-level, you\'re managing staff, inventory, orders, and customers. A proper web application automates the repetitive tasks so your team focuses on growth, not paperwork.',
    icon: Building2, iconColor: '#2563eb',
    stat: { value: '60%', label: 'REDUCTION IN ADMIN TIME WITH AUTOMATION' },
    bg: 'from-blue-50 to-white', accent: '#2563eb',
    points: ['INVENTORY & STOCK MANAGEMENT', 'STAFF SCHEDULING & HR SYSTEM', 'CUSTOMER CRM & FOLLOW-UPS', 'AUTOMATED INVOICING & BILLING'],
  },
  {
    id: 4, tag: 'MID-LEVEL BUSINESS', tagColor: '#2563eb',
    title: 'SELL ONLINE,\nGROW FASTER',
    subtitle: 'E-COMMERCE OPENS YOUR BUSINESS TO THE ENTIRE COUNTRY.',
    body: 'Adding an online store to your existing business can double your revenue. Customers from Colombo to Jaffna can order from you with payment gateway integration and delivery tracking.',
    icon: ShoppingCart, iconColor: '#2563eb',
    stat: { value: '2×', label: 'REVENUE POTENTIAL WITH E-COMMERCE' },
    bg: 'from-blue-50 to-white', accent: '#2563eb',
    points: ['FULL E-COMMERCE STORE', 'PAYMENT GATEWAY (CARDS, BANK)', 'ORDER TRACKING FOR CUSTOMERS', 'INVENTORY AUTO-SYNC'],
  },
  {
    id: 5, tag: 'LARGE SCALE', tagColor: '#7c3aed',
    title: 'ENTERPRISE-GRADE\nDIGITAL INFRASTRUCTURE',
    subtitle: 'LARGE BUSINESSES NEED SYSTEMS THAT TALK TO EACH OTHER.',
    body: 'At scale, you need everything connected — your website, POS system, HR software, accounting, and customer portal all sharing data in real time. We eliminate silos and give management full visibility.',
    icon: Building, iconColor: '#7c3aed',
    stat: { value: '99%', label: 'UPTIME ON ALL SYSTEMS WE MANAGE' },
    bg: 'from-purple-50 to-white', accent: '#7c3aed',
    points: ['CUSTOM ERP & CRM SYSTEMS', 'MULTI-BRANCH MANAGEMENT', 'REAL-TIME ANALYTICS DASHBOARD', 'ROLE-BASED STAFF ACCESS CONTROL'],
  },
  {
    id: 6, tag: 'LARGE SCALE', tagColor: '#7c3aed',
    title: 'DATA-DRIVEN\nDECISION MAKING',
    subtitle: 'STOP GUESSING. START KNOWING.',
    body: 'With a proper analytics dashboard, you see exactly which products sell, which branches perform, and where customers drop off. Real-time data means faster, smarter decisions.',
    icon: BarChart3, iconColor: '#7c3aed',
    stat: { value: '40%', label: 'FASTER DECISIONS WITH REAL-TIME DASHBOARDS' },
    bg: 'from-purple-50 to-white', accent: '#7c3aed',
    points: ['LIVE SALES & REVENUE DASHBOARD', 'CUSTOMER BEHAVIOUR ANALYTICS', 'STAFF PERFORMANCE TRACKING', 'AUTOMATED MONTHLY REPORTS'],
  },
  {
    id: 7, tag: 'ALL BUSINESSES', tagColor: '#ff003c',
    title: 'SECURITY &\nTRUST MATTER',
    subtitle: 'YOUR CUSTOMERS TRUST YOU WITH THEIR DATA.',
    body: 'SSL certificates, secure payment processing, and regular security audits protect your business and your customers. A secure website also ranks higher on Google.',
    icon: Shield, iconColor: '#ff003c',
    stat: { value: '85%', label: 'OF USERS ABANDON UNSECURED WEBSITES' },
    bg: 'from-red-50 to-white', accent: '#ff003c',
    points: ['SSL & HTTPS ON ALL PAGES', 'SECURE PAYMENT PROCESSING', 'REGULAR SECURITY AUDITS', 'DATA BACKUP & RECOVERY'],
  },
  {
    id: 8, tag: 'ALL BUSINESSES', tagColor: '#ff003c',
    title: 'MOBILE FIRST\nIS NOT OPTIONAL',
    subtitle: '70% OF YOUR CUSTOMERS ARE ON THEIR PHONES.',
    body: 'If your website doesn\'t work perfectly on mobile, you\'re losing customers every day. We build every site mobile-first — fast loading, easy navigation, and thumb-friendly layouts.',
    icon: Smartphone, iconColor: '#ff003c',
    stat: { value: '70%', label: 'OF WEB TRAFFIC COMES FROM MOBILE DEVICES' },
    bg: 'from-red-50 to-white', accent: '#ff003c',
    points: ['MOBILE-FIRST RESPONSIVE DESIGN', 'FAST LOADING ON 4G/3G', 'CLICK-TO-CALL & WHATSAPP BUTTONS', 'APP-LIKE PROGRESSIVE WEB APP'],
  },
  {
    id: 9, tag: 'GET STARTED', tagColor: '#ff003c',
    title: 'READY TO BUILD\nYOUR DIGITAL FUTURE?',
    subtitle: 'WE\'VE HELPED 25+ BUSINESSES GO DIGITAL. YOU\'RE NEXT.',
    body: 'From a simple business website to a full enterprise system — we handle everything. Free consultation, transparent pricing, and lifetime maintenance included. No hidden fees, no surprises.',
    icon: Star, iconColor: '#ff003c',
    stat: { value: '25+', label: 'BUSINESSES TRANSFORMED DIGITALLY' },
    bg: 'from-red-50 to-white', accent: '#ff003c',
    cta: true,
  },
];

const CHAPTERS = [
  { label: 'INTRO',      pages: [0],    color: '#ff003c' },
  { label: 'SMALL',      pages: [1, 2], color: '#16a34a' },
  { label: 'MID-LEVEL',  pages: [3, 4], color: '#2563eb' },
  { label: 'ENTERPRISE', pages: [5, 6], color: '#7c3aed' },
  { label: 'ESSENTIALS', pages: [7, 8], color: '#ff003c' },
  { label: 'START NOW',  pages: [9],    color: '#ff003c' },
];

export default function BusinessBook() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<'right' | 'left'>('right');
  const [paused, setPaused] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((i: number) => {
    setDir(i > page ? 'right' : 'left');
    setPage(i);
  }, [page]);

  const next = () => { if (page < PAGES.length - 1) goTo(page + 1); };
  const prev = () => { if (page > 0) goTo(page - 1); };

  // Auto-advance — pauses on hover/touch
  useEffect(() => {
    if (paused) return;
    autoRef.current = setTimeout(() => {
      setDir('right');
      setPage(p => (p + 1) % PAGES.length);
    }, 6000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [page, paused]);

  const current = PAGES[page];
  const Icon = current.icon;

  return (
    <section className="relative bg-white overflow-hidden py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black tracking-[0.3em] uppercase text-red-500">BUSINESS GUIDE</span>
        </div>
        <h2 className="text-2xl md:text-5xl font-black text-black tracking-tight leading-tight">
          WHY EVERY BUSINESS NEEDS<br />
          <span style={{ color: '#ff003c' }}>A DIGITAL SYSTEM</span>
        </h2>
        <p className="text-gray-500 mt-3 text-sm md:text-lg max-w-2xl mx-auto font-semibold uppercase tracking-wide">
          FROM SMALL SHOPS TO LARGE ENTERPRISES — HERE'S WHAT YOU'RE MISSING
        </p>
      </div>

      {/* Chapter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-10 px-4">
        {CHAPTERS.map((ch, ci) => {
          const active = ch.pages.includes(page);
          return (
            <button key={ci} onClick={() => goTo(ch.pages[0])}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 border"
              style={{
                background: active ? ch.color : 'transparent',
                color: active ? '#fff' : ch.color,
                borderColor: ch.color,
                boxShadow: active ? `0 0 16px ${ch.color}40` : 'none',
              }}>
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* Book — pause auto-advance on hover or touch */}
      <div className="relative max-w-5xl mx-auto px-3 md:px-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="relative" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              initial={{ rotateY: dir === 'right' ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: dir === 'right' ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center center' }}
              className={`w-full rounded-2xl md:rounded-3xl bg-gradient-to-br ${current.bg} border border-gray-100 shadow-xl md:shadow-2xl overflow-hidden`}
            >
              {/* Accent spine */}
              <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full rounded-l-2xl md:rounded-l-3xl"
                style={{ background: current.accent }} />

              <div className="flex flex-col md:grid md:grid-cols-2 h-full">
                {/* Content */}
                <div className="p-5 md:p-12 flex flex-col justify-between order-2 md:order-1">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 md:mb-4 text-white"
                      style={{ background: current.accent }}>
                      {current.tag}
                    </span>

                    <h3 className="text-xl md:text-4xl font-black text-black leading-tight mb-2 md:mb-3 whitespace-pre-line">
                      {current.title}
                    </h3>

                    <p className="text-xs md:text-sm font-black mb-3 md:mb-4 uppercase tracking-wide" style={{ color: current.accent }}>
                      {current.subtitle}
                    </p>

                    <p className="text-gray-600 leading-relaxed text-xs md:text-base mb-4 md:mb-6">
                      {current.body}
                    </p>

                    {current.points && (
                      <ul className="space-y-1.5 md:space-y-2">
                        {current.points.map((pt, i) => (
                          <motion.li key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700">
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" style={{ color: current.accent }} />
                            {pt}
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {current.cta && (
                      <motion.a href="#contact"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 mt-4 md:mt-6 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-white uppercase tracking-widest text-xs md:text-sm"
                        style={{ background: current.accent, boxShadow: `0 8px 30px ${current.accent}40` }}>
                        GET FREE CONSULTATION
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.a>
                    )}
                  </div>

                  {/* Stat */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-5 md:mt-8 p-3 md:p-4 rounded-xl md:rounded-2xl border"
                    style={{ borderColor: `${current.accent}30`, background: `${current.accent}08` }}>
                    <div className="text-2xl md:text-4xl font-black" style={{ color: current.accent }}>
                      {current.stat.value}
                    </div>
                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                      {current.stat.label}
                    </div>
                  </motion.div>
                </div>

                {/* Visual */}
                <div className="relative flex items-center justify-center p-5 md:p-12 bg-gradient-to-br from-transparent to-gray-50/50 order-1 md:order-2 min-h-[160px] md:min-h-0">
                  <div className="absolute top-3 right-4 md:top-6 md:right-8 text-[10px] md:text-xs font-black tracking-widest text-gray-300 uppercase">
                    {String(page + 1).padStart(2, '0')} / {String(PAGES.length).padStart(2, '0')}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex flex-col items-center gap-4 md:gap-6"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center"
                      style={{
                        background: `${current.iconColor}12`,
                        border: `2px solid ${current.iconColor}30`,
                        boxShadow: `0 20px 60px ${current.iconColor}20`,
                      }}>
                      <Icon className="w-10 h-10 md:w-16 md:h-16" style={{ color: current.iconColor }} />
                    </motion.div>

                    {/* Dots */}
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px]">
                      {PAGES.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === page ? 20 : 5,
                            height: 5,
                            background: i === page ? current.accent : `${current.accent}30`,
                          }} />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center justify-between mt-5 md:mt-8">
          <button onClick={prev} disabled={page === 0}
            className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all disabled:opacity-30"
            style={{ background: page === 0 ? '#f3f4f6' : current.accent, color: page === 0 ? '#9ca3af' : '#fff' }}>
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            PREV
          </button>

          <span className="text-[10px] md:text-xs font-black tracking-widest text-gray-400 uppercase">
            {paused ? '⏸ PAUSED' : `PAGE ${page + 1} OF ${PAGES.length}`}
          </span>

          <button onClick={next} disabled={page === PAGES.length - 1}
            className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all disabled:opacity-30"
            style={{ background: page === PAGES.length - 1 ? '#f3f4f6' : current.accent, color: page === PAGES.length - 1 ? '#9ca3af' : '#fff' }}>
            NEXT
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Progress bar — only runs when not paused */}
        <div className="mt-4 md:mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
          {!paused && (
            <motion.div
              key={`prog-${page}-${paused}`}
              className="h-full rounded-full"
              style={{ background: current.accent }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          )}
          {paused && (
            <div className="h-full rounded-full" style={{ background: current.accent, width: '100%', opacity: 0.3 }} />
          )}
        </div>
      </div>
    </section>
  );
}
