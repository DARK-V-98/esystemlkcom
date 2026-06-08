import { motion } from "framer-motion";
import { ArrowRight, Check, ArrowUpRight, Shield, Zap, Clock } from "lucide-react";

const TRUST = [
  { icon: Shield, label: "Lifetime Free Maintenance" },
  { icon: Zap,    label: "Fast Delivery" },
  { icon: Clock,  label: "24/7 Support" },
];

const CLIENTS = [
  "bigcosta constructions", "joshtours", "aaryahardware",
  "Ceylon Export Hub", "flycargolanka", "smartlabs",
  "blindbless", "skillhub",
];

const STATS = [
  { value: "25+",  label: "Happy Clients"   },
  { value: "260+", label: "Services Done"   },
  { value: "99%",  label: "Uptime"          },
  { value: "6+",   label: "Years"           },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-60" />

      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,191,255,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-0 lg:pt-36">

        {/* ── Top label ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon/30 bg-[#f0f9ff] text-[#0077ff] text-xs font-bold uppercase tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            Based in Sri Lanka · Building since 2018
          </span>
        </motion.div>

        {/* ── Main heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="font-display font-black text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
            Your business needs software
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #00bfff 0%, #0077ff 60%, #00bfff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
              }}
            >
              that actually works.
            </span>
          </h1>

          <p className="mt-6 text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal">
            We're a small team in Sri Lanka. We've built websites, web apps and software systems for over 25 businesses — and we still answer the phone when something breaks.
          </p>

          {/* ── CTAs ── */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#clients"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-foreground border border-border hover:border-neon/50 hover:text-neon transition-all duration-200 bg-white"
            >
              View Our Work
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── Trust pills ── */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon className="w-4 h-4 text-neon" />
                {label}
              </span>
            ))}
            <span className="flex items-center gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-neon" />
              No contracts, no lock-in
            </span>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border shadow-sm"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white px-6 py-8 text-center">
              <div
                className="font-display font-black text-4xl lg:text-5xl"
                style={{
                  background: "linear-gradient(135deg, #00bfff, #0077ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="mt-1.5 text-sm text-text-muted font-medium">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Client strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 pb-16 overflow-hidden"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-5">
            Some of the businesses we've worked with
          </p>
          <div className="relative">
            {/* fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex gap-14 animate-marquee whitespace-nowrap">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <span
                  key={i}
                  className="font-display font-bold text-base text-text-muted hover:text-neon transition-colors duration-200 cursor-default"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
