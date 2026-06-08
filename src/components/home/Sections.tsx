import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Globe, Smartphone, MonitorCog, LayoutDashboard, Database, Palette,
  Cloud, ShieldCheck, Wrench, Rocket, BarChart3, Cable, Briefcase,
  MessageSquare, QrCode, Sliders, ArrowRight, ArrowUpRight, Check, Star, Quote,
  Infinity as InfinityIcon, Zap, Clock, BadgeCheck, Cpu, UserCheck,
  RefreshCw, Users, FileText, ArrowLeftRight, Plug, ImageIcon, Lock,
  Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Plus, Minus,
} from "lucide-react";
import { Section, SectionHeader, FadeIn, CountUp } from "./Section";
import { PROJECTS } from "@/data/projects";

/* ============ 2. Portfolio ============ */
export function ProjectCard({ name, url }: { name: string; url: string }) {
  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">("loading");
  const displayUrl = url.replace(/^https?:\/\//, "");
  const screenshotSrc = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=800`;

  useEffect(() => {
    const t = setTimeout(() => setImgStatus((s) => s === "loading" ? "error" : s), 15000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="card-neon rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(0,191,255,0.15)]">
      {/* Browser chrome bar */}
      <div className="bg-[#f4f5f7] px-3 py-2 flex items-center gap-2 border-b border-border shrink-0">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="flex-1 bg-white rounded text-[11px] text-text-muted px-2 py-0.5 truncate border border-border">
          {displayUrl}
        </span>
      </div>

      {/* Preview area */}
      <div className="relative overflow-hidden bg-[#f9fbff]" style={{ height: 200 }}>
        {/* Screenshot image via Microlink */}
        <img
          src={screenshotSrc}
          alt={`${name} preview`}
          loading="lazy"
          onLoad={() => setImgStatus("loaded")}
          onError={() => setImgStatus("error")}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ opacity: imgStatus === "loaded" ? 1 : 0, transition: "opacity 0.4s" }}
        />

        {/* Spinner while loading */}
        {imgStatus === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-text-muted">Loading preview…</span>
          </div>
        )}

        {/* Fallback if screenshot fails */}
        {imgStatus === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0f1e] to-[#0d1f3c] select-none">
            <div className="font-display font-black text-2xl tracking-[-0.04em]">
              <span className="text-white">ESYSTEM</span>
              <span style={{ background: "linear-gradient(90deg,#00bfff,#0077ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>LK</span>
            </div>
            <div className="mt-3 text-white/70 text-sm font-semibold">{name}</div>
            <div className="mt-1 text-white/30 text-xs">{displayUrl}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-border shrink-0">
        <span className="font-semibold text-foreground text-sm truncate">{name}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-2 inline-flex items-center gap-1 text-xs text-neon font-semibold hover:underline"
        >
          Visit <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function Portfolio() {
  const featured = PROJECTS.slice(0, 6);
  return (
    <Section id="portfolio">
      <SectionHeader
        badge="Our Work"
        title={<>A bit of <span className="gradient-hero-text">what we've built</span></>}
        subtitle="Not everything — just some of the sites and systems we've put out there."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((p) => (
          <FadeIn key={p.url}>
            <ProjectCard name={p.name} url={p.url} />
          </FadeIn>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="/projects"
          className="inline-flex items-center gap-2 btn-outline-neon rounded-xl px-7 py-3 font-semibold"
        >
          See all {PROJECTS.length} projects <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </Section>
  );
}

/* ============ 3. Why Go Digital ============ */
const TABS = [
  { key: "intro", label: "Intro", title: "Why digital matters", body: "Customers expect you online. A real digital presence builds trust the moment someone hears your name." },
  { key: "small", label: "Small", title: "For small businesses", body: "A clean website, social presence and a way to take orders online — the basics that double your reach." },
  { key: "mid", label: "Mid-level", title: "Growing companies", body: "Connect operations, CRM, inventory and customers under one roof so your team stops chasing spreadsheets." },
  { key: "ent", label: "Enterprise", title: "Enterprise systems", body: "Custom platforms, integrations and dashboards built around your workflow with full security and SLA." },
  { key: "ess", label: "Essentials", title: "What you actually need", body: "Domain, hosting, a fast site, analytics, a CRM, automation and a maintenance partner — we cover all of it." },
  { key: "now", label: "Start Now", title: "How to start today", body: "Book a free call. We map your digital roadmap in 30 minutes — no pressure, no upfront fee." },
];

export function WhyDigital() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active)!;
  return (
    <Section alt id="why-digital">
      <SectionHeader
        badge="Business Guide"
        title={<>Why every business needs a <span className="gradient-hero-text">digital system</span></>}
        subtitle="From small shops to large enterprises — here's what you're missing"
      />
      <FadeIn className="max-w-3xl mx-auto mb-10">
        <div className="card-neon rounded-2xl p-6 text-center">
          <div className="text-4xl lg:text-5xl font-display font-extrabold gradient-hero-text">80%</div>
          <p className="text-text-secondary mt-2">of customers search online before making a purchase</p>
        </div>
      </FadeIn>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition ${
              active === t.key
                ? "bg-gradient-to-r from-neon to-[#0077FF] text-white shadow-[0_6px_20px_rgba(0,191,255,0.3)]"
                : "bg-white border border-neon/30 text-neon hover:bg-neon/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div key={tab.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-neon rounded-2xl p-8 max-w-3xl mx-auto">
        <h3 className="font-display font-bold text-2xl text-foreground">{tab.title}</h3>
        <p className="mt-3 text-text-secondary leading-relaxed">{tab.body}</p>
        <a className="mt-5 inline-flex items-center gap-1 text-neon font-semibold text-sm" href="#contact">
          Learn more <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </Section>
  );
}

/* ============ 4. Central System ============ */
export function CentralSystem() {
  const orbits = [
    { icon: Globe, label: "Websites" },
    { icon: Smartphone, label: "Mobile Apps" },
    { icon: MonitorCog, label: "Software Systems" },
    { icon: LayoutDashboard, label: "One Dashboard" },
  ];
  return (
    <Section id="central">
      <SectionHeader
        badge="🇱🇰 First in Sri Lanka"
        title={<>One dashboard. Every system. <span className="gradient-hero-text">Total control.</span></>}
        subtitle="Every website, app and software — connected to one powerful hub. Manage everything from cs.esystemlk.com"
      />
      <div className="relative mx-auto max-w-3xl aspect-square sm:aspect-[2/1] mb-12">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-6 sm:gap-10">
          {orbits.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-neon rounded-2xl p-5 flex flex-col items-center justify-center text-center"
            >
              <span className="icon-circle"><o.icon className="w-5 h-5" /></span>
              <div className="mt-3 font-semibold text-foreground">{o.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon to-[#0077FF] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-[0_0_60px_rgba(0,191,255,0.5)]">
            ESYSTEMLK
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
        {[
          { v: 25, l: "Businesses Connected" },
          { v: 1, l: "Central Hub", suffix: "" },
          { v: 6, l: "Years Experience" },
        ].map((s) => (
          <div key={s.l} className="card-neon rounded-2xl p-6 text-center">
            <div className="text-4xl font-display font-extrabold gradient-hero-text">
              <CountUp to={s.v} suffix={s.suffix ?? "+"} />
            </div>
            <p className="text-text-secondary text-sm mt-1">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a href="https://cs.esystemlk.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold">
          Access Your Hub → cs.esystemlk.com
        </a>
      </div>
    </Section>
  );
}

/* ============ 5. EBOT 2.1 ============ */
export function Ebot() {
  const cards = [
    { i: MessageSquare, t: "WhatsApp Automation", d: "Automated instant replies for customers" },
    { i: LayoutDashboard, t: "Business Dashboard", d: "Complete control panel for management" },
    { i: QrCode, t: "QR Linking", d: "Link WhatsApp with a simple QR scan" },
    { i: Sliders, t: "Advanced Control", d: "Real-time sessions, scheduling, analytics" },
  ];
  return (
    <Section alt id="ebot">
      <div className="text-center mb-12">
        <span className="badge-pill">✨ New Release — EBOT 2.1</span>
        <h2 className="mt-5 font-display font-extrabold text-4xl lg:text-5xl tracking-tight">
          Transform your business with <span className="gradient-hero-text">WhatsApp intelligence</span>
        </h2>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Advanced WhatsApp automation with instant replies and a powerful management dashboard.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <FadeIn key={c.t}>
              <div className="card-neon rounded-2xl p-5 h-full">
                <span className="icon-circle"><c.i className="w-5 h-5" /></span>
                <h3 className="mt-3 font-display font-bold text-foreground">{c.t}</h3>
                <p className="text-sm text-text-secondary mt-1">{c.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div className="rounded-2xl bg-[#0A1628] p-6 font-mono text-sm shadow-[0_20px_60px_rgba(0,191,255,0.25)] border border-neon/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-neon-light">EBOT_ADMIN_V2.1</span>
            </div>
            <div className="space-y-2 text-green-400">
              <div>$ ebot --start --mode=production</div>
              <div className="text-neon-light">→ Connecting WhatsApp session...</div>
              <div className="text-green-300">✓ Session linked via QR</div>
              <div className="text-green-300">✓ Auto-reply engine: ONLINE</div>
              <div className="text-green-300">✓ Message scheduler: ACTIVE</div>
              <div className="text-neon-light">→ Dashboard endpoint ready</div>
              <div className="text-white/80">Status: RUNNING · SSL: OK · Mode: Production</div>
              <div className="text-green-400 animate-pulse">▌</div>
            </div>
          </div>
        </FadeIn>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">
        {["Real-time QR management", "Message scheduling", "Advanced analytics", "Secure data encryption"].map((b) => (
          <span key={b} className="flex items-center gap-2"><Check className="w-4 h-4 text-neon" />{b}</span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#contact" className="btn-primary rounded-lg px-6 py-3 font-semibold inline-flex items-center gap-2">Get Started with EBOT <ArrowRight className="w-4 h-4" /></a>
      </div>
    </Section>
  );
}

/* ============ 6. Services ============ */
const SERVICES = [
  { i: Globe, t: "Business Websites", d: "Beautiful sites that convert visitors.", tags: ["SEO Optimized", "Mobile Responsive", "Fast Loading"] },
  { i: Cable, t: "Web Applications", d: "Custom apps tailored to your workflow.", tags: ["Custom Features", "User-Friendly", "Scalable"] },
  { i: MonitorCog, t: "Software Systems", d: "Enterprise systems that run your ops.", tags: ["Full Integration", "Secure", "Automated"] },
  { i: Database, t: "Database Solutions", d: "Reliable data storage and queries.", tags: ["Optimized Queries", "Backup Systems", "Data Security"] },
  { i: Palette, t: "UI/UX Design", d: "Designs people love to use.", tags: ["Modern Design", "User Research", "Prototyping"] },
  { i: Cloud, t: "Cloud Hosting", d: "Fast, scalable hosting with SSL.", tags: ["Fast Servers", "Auto Scaling", "SSL Included"] },
  { i: ShieldCheck, t: "Security Solutions", d: "Keep your business safe online.", tags: ["Firewall", "Encryption", "Monitoring"] },
  { i: Wrench, t: "Maintenance & Support", d: "We never leave you on your own.", tags: ["24/7 Support", "Regular Updates", "Bug Fixes"] },
  { i: Rocket, t: "Performance Optimization", d: "Make every page lightning fast.", tags: ["Code Optimization", "CDN Setup", "Caching"] },
  { i: BarChart3, t: "Analytics & SEO", d: "Grow with data, not guesses.", tags: ["Keyword Research", "Traffic Analysis", "Reporting"] },
  { i: Plug, t: "API Development", d: "Connect your tools and services.", tags: ["RESTful APIs", "Documentation", "Authentication"] },
  { i: Briefcase, t: "Consulting", d: "Plan smart, build right.", tags: ["Strategy Planning", "Tech Audit", "Roadmap"] },
];

export function Services() {
  return (
    <Section id="services">
      <SectionHeader
        badge="Our Services"
        title={<>Complete <span className="gradient-hero-text">digital solutions</span></>}
        subtitle="From small business sites to full enterprise systems — we get it done right, every time."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.t} delay={(i % 4) * 0.05}>
            <div className="card-neon rounded-2xl p-6 h-full flex flex-col">
              <span className="icon-circle"><s.i className="w-5 h-5" /></span>
              <h3 className="mt-4 font-display font-bold text-foreground">{s.t}</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{s.d}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-1 rounded-full bg-bg-blue text-neon font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ============ 7. Process ============ */
const STEPS = [
  { n: "01", t: "Discovery Call", d: "Talk through your needs — no charge." },
  { n: "02", t: "Planning & Proposal", d: "Clear plan, timeline and exact cost." },
  { n: "03", t: "Design Phase", d: "Mockups until the design feels right." },
  { n: "04", t: "Development", d: "Clean code with regular updates." },
  { n: "05", t: "Testing & QA", d: "Tested on real devices before launch." },
  { n: "06", t: "Launch & Support", d: "Free maintenance for life." },
];

export function Process() {
  return (
    <Section alt id="process">
      <SectionHeader
        badge="Our Process"
        title={<>How we <span className="gradient-hero-text">build</span> your project</>}
        subtitle="A straightforward process — you always know where things stand."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STEPS.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.05}>
            <div className="card-neon rounded-2xl p-6 h-full relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-neon to-[#0077FF] text-white font-display font-bold flex items-center justify-center shadow-[0_0_20px_rgba(0,191,255,0.4)]">
                {s.n}
              </div>
              <h3 className="mt-3 font-display font-bold text-lg text-foreground">{s.t}</h3>
              <p className="text-sm text-text-secondary mt-2">{s.d}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-text-secondary">
        {["No Upfront Consultation Fees", "Flexible Payment Plans", "100% Satisfaction Guarantee"].map((t) => (
          <span key={t} className="flex items-center gap-2"><Check className="w-4 h-4 text-neon" />{t}</span>
        ))}
      </div>
    </Section>
  );
}

/* ============ 8. Free Tools ============ */
const TOOLS = [
  { i: FileText, t: "Invoice Generator", d: "Create professional PDF invoices" },
  { i: ArrowLeftRight, t: "Currency Converter", d: "Live exchange rates" },
  { i: Plug, t: "API Tester", d: "Browser-based API client" },
  { i: ImageIcon, t: "Image Compressor", d: "Adjustable quality compression" },
  { i: Lock, t: "SSL Checker", d: "Certificate expiry & issuer details" },
];

export function FreeTools() {
  return (
    <Section id="tools">
      <SectionHeader
        badge="Free Developer Tools"
        title={<>A suite of <span className="gradient-hero-text">powerful, secure tools</span></>}
        subtitle="Free browser-based utilities — no uploads, no waiting."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {TOOLS.map((t, i) => (
          <FadeIn key={t.t} delay={i * 0.05}>
            <div className="card-neon rounded-2xl p-5 h-full flex flex-col">
              <span className="icon-circle"><t.i className="w-5 h-5" /></span>
              <h3 className="mt-3 font-display font-bold text-foreground">{t.t}</h3>
              <p className="text-sm text-text-secondary mt-1">{t.d}</p>
              <a href="#contact" className="mt-4 text-neon font-semibold text-sm inline-flex items-center gap-1">Request Access <ArrowRight className="w-4 h-4" /></a>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="text-center mt-10">
        <a href="#contact" className="btn-outline-neon rounded-lg px-6 py-3 font-semibold inline-flex items-center gap-2">
          Request Access to All Tools <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </Section>
  );
}

/* ============ 9. Pricing ============ */
const SOFTWARE_TIERS = [
  { t: "Web Package", price: { usd: 299, lkr: 89000 }, blurb: "Perfect for small businesses and personal websites", popular: false,
    features: ["Responsive Design", "Up to 5 Pages", "Contact Form", "Social Media Integration", "Basic SEO", "Mobile Friendly", "Free Domain Setup", "Lifetime Free Maintenance"], cta: "Get Started" },
  { t: "Web App", price: { usd: 899, lkr: 269000 }, blurb: "Custom web applications with dashboards", popular: true,
    features: ["Custom Web Application", "User Authentication", "Admin Dashboard", "Database Integration", "API Development", "Real-time Features", "Lifetime Free Maintenance"], cta: "Get Started" },
  { t: "Software System", price: { usd: 1999, lkr: 599000 }, blurb: "Full software systems for growing teams", popular: false,
    features: ["Everything in Web App", "Full System Dev", "Multi-user Support", "Advanced Security", "Custom Integrations", "Data Analytics", "Priority Support", "Lifetime Free Maintenance"], cta: "Get Started" },
  { t: "Enterprise Pack", price: { usd: 4999, lkr: 1499000 }, blurb: "Dedicated team and full SLA", popular: false,
    features: ["Everything in Software System", "Dedicated Team", "CI/CD & DevOps", "SLA", "On-premise Option", "Scalability Architecture", "24/7 Support"], cta: "Contact Us" },
];

const LOGO_TIERS = [
  { t: "Logo Only", price: { usd: 49, lkr: 14500 }, blurb: "Single concept, final files", popular: false,
    features: ["1 Logo Concept", "Vector Files", "PNG / SVG / PDF", "Quick Delivery"] },
  { t: "Normal Logo Pack", price: { usd: 99, lkr: 29500 }, blurb: "3 concepts + brand colors", popular: false,
    features: ["3 Logo Concepts", "Color Variations", "Brand Color Palette", "Source Files"] },
  { t: "Standard Logo Pack", price: { usd: 199, lkr: 59500 }, blurb: "Full brand essentials", popular: true,
    features: ["5 Logo Concepts", "Brand Guidelines", "Social Media Kit", "Stationery Design", "Source Files"] },
  { t: "Advanced Branding Suite", price: { usd: 499, lkr: 149500 }, blurb: "Complete branding system", popular: false,
    features: ["Full Brand Identity", "Brand Strategy", "Marketing Templates", "Print Design", "Web Assets", "Style Guide PDF"] },
];

function PricingCard({ tier, currency }: { tier: any; currency: "usd" | "lkr" }) {
  return (
    <div className={`relative rounded-2xl p-6 h-full flex flex-col ${tier.popular ? "border-2 border-neon shadow-[0_12px_40px_rgba(0,191,255,0.25)] bg-white" : "card-neon"}`}>
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon to-[#0077FF] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-[0_0_20px_rgba(0,191,255,0.5)]">
          Most Popular
        </span>
      )}
      <h3 className="font-display font-bold text-xl text-foreground">{tier.t}</h3>
      <p className="text-sm text-text-secondary mt-1">{tier.blurb}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-xs text-text-muted">Starting from</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-display font-extrabold text-foreground">
          {currency === "usd" ? `$${tier.price.usd}` : `Rs ${tier.price.lkr.toLocaleString()}`}
        </span>
      </div>
      <ul className="mt-5 space-y-2 flex-1">
        {tier.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="w-4 h-4 text-neon mt-0.5 shrink-0" />{f}
          </li>
        ))}
      </ul>
      <a href="#contact" className={`mt-6 rounded-lg py-2.5 font-semibold text-center block ${tier.popular ? "btn-primary" : "btn-outline-neon"}`}>{tier.cta ?? "Get Started"}</a>
    </div>
  );
}

export function Pricing() {
  const [cur, setCur] = useState<"usd" | "lkr">("usd");
  return (
    <Section alt id="pricing">
      <SectionHeader
        badge="Transparent Pricing"
        title={<>Affordable packages for <span className="gradient-hero-text">every business</span></>}
        subtitle="Honest pricing, no surprises. Every package includes lifetime free maintenance."
      />
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white border border-neon/30 rounded-full p-1">
          {(["usd", "lkr"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCur(c)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider transition ${
                cur === c ? "bg-gradient-to-r from-neon to-[#0077FF] text-white" : "text-text-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <h3 className="text-center font-display font-bold text-lg text-text-secondary mb-6 uppercase tracking-widest">Software & Web Development</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SOFTWARE_TIERS.map((t) => <PricingCard key={t.t} tier={t} currency={cur} />)}
      </div>
      <h3 className="text-center font-display font-bold text-lg text-text-secondary mb-6 mt-16 uppercase tracking-widest">Logo Design & Branding</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {LOGO_TIERS.map((t) => <PricingCard key={t.t} tier={t} currency={cur} />)}
      </div>
      <p className="text-center text-sm text-text-muted mt-10">
        All packages include <span className="text-neon font-semibold">Free Lifetime Service Warranty</span>. Starting prices — final cost depends on complexity.
      </p>
    </Section>
  );
}

/* ============ 10. Tech Stack ============ */
const TECH = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "PostgreSQL", "Firebase", "Docker", "AWS", "Figma", "WordPress"];

export function TechStack() {
  const row = (reverse = false) => (
    <div className="overflow-hidden">
      <div className={`flex gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} whitespace-nowrap py-2`}>
        {[...TECH, ...TECH].map((t, i) => (
          <span key={i} className="px-5 py-2.5 rounded-full bg-[#E8F6FF] text-foreground font-semibold border border-neon/15">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <Section id="tech">
      <SectionHeader
        badge="Technologies"
        title={<>Our <span className="gradient-hero-text">tech stack</span></>}
        subtitle="Modern, battle-tested tools we use to build your product."
      />
      <div className="space-y-3">
        {row(false)}
        {row(true)}
      </div>
      <p className="text-center text-sm text-text-muted mt-8">And many more cutting-edge technologies…</p>
    </Section>
  );
}

/* ============ 11. Clients ============ */
const CLIENTS = ["bigcosta constructions", "joshtours", "aaryahardware", "Ceylon Export & Tourism Hub", "flycargolanka", "smartlabs", "Colombo District Election Dept", "blindbless", "skillhub"];
export function Clients() {
  return (
    <Section alt id="clients">
      <h2 className="text-center font-display font-extrabold text-3xl lg:text-4xl">
        Trusted by businesses across <span className="gradient-hero-text">Sri Lanka & beyond</span>
      </h2>
      <div className="mt-10 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span key={i} className="text-text-muted font-display font-semibold text-xl opacity-60 hover:opacity-100 hover:text-neon transition">
              {c}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ============ 12. Testimonials ============ */
const TESTIMONIALS = [
  { q: "Fast delivery, clean code and zero downtime since launch. Easily the best agency we've worked with in the region.", n: "Rashmi Perera", r: "Founder, FlyCargo Lanka" },
  { q: "They turned our messy spreadsheets into a beautiful dashboard. Our team saves hours every day.", n: "Dilan Fernando", r: "COO, AaryaHardware" },
];
export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  return (
    <Section id="testimonials">
      <SectionHeader badge="Client Stories" title={<>What our <span className="gradient-hero-text">clients say</span></>} />
      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-neon rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto">
        <Quote className="w-10 h-10 text-neon" />
        <p className="mt-4 text-xl lg:text-2xl text-foreground font-display leading-relaxed">"{t.q}"</p>
        <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon to-neon-light text-white flex items-center justify-center font-bold">
              {t.n.split(" ").map((s) => s[0]).join("")}
            </div>
            <div>
              <div className="font-semibold text-foreground">{t.n}</div>
              <div className="text-sm text-text-muted">{t.r}</div>
            </div>
          </div>
          <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-neon text-neon" />)}</div>
        </div>
      </motion.div>
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, j) => (
          <button key={j} onClick={() => setI(j)} className={`h-2 rounded-full transition-all ${i === j ? "w-8 bg-neon" : "w-2 bg-neon/30"}`} aria-label={`Slide ${j + 1}`} />
        ))}
      </div>
    </Section>
  );
}

/* ============ 13. Why Choose Us ============ */
const WHY = [
  { i: InfinityIcon, t: "Lifetime Free Maintenance" },
  { i: Zap, t: "Fast Delivery" },
  { i: Clock, t: "24/7 Support" },
  { i: BadgeCheck, t: "Quality Guaranteed" },
  { i: Cpu, t: "Modern Technology" },
  { i: UserCheck, t: "Customer First" },
  { i: RefreshCw, t: "Free Updates" },
  { i: Users, t: "Dedicated Team" },
];
const STATS = [
  { v: 260, l: "All Services Provided" }, { v: 25, l: "Websites" }, { v: 20, l: "Software Systems" },
  { v: 5,  l: "Web Apps" }, { v: 100, l: "Logo Designs" }, { v: 100, l: "IT Services Provided" },
  { v: 10, l: "On-Site Managements" }, { v: 6, l: "Years Experience" },
];
export function WhyChoose() {
  return (
    <Section alt id="why">
      <SectionHeader badge="Why Choose Us" title={<>What makes us <span className="gradient-hero-text">different</span></>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {WHY.map((w, i) => (
          <FadeIn key={w.t} delay={(i % 4) * 0.05}>
            <div className="card-neon rounded-2xl p-6 h-full">
              <span className="icon-circle"><w.i className="w-5 h-5" /></span>
              <h3 className="mt-4 font-display font-bold text-foreground">{w.t}</h3>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn>
        <div className="mt-10 bg-white rounded-2xl p-6 lg:p-8 border-l-4 border-neon shadow-[0_8px_30px_rgba(0,191,255,0.15)] flex flex-wrap items-center gap-6 justify-between">
          <div>
            <div className="text-4xl font-display font-extrabold gradient-hero-text">99% Uptime Guarantee</div>
            <p className="text-text-secondary mt-2 max-w-2xl">Since 2020, every site we manage has stayed online without a single outage.</p>
          </div>
          <BadgeCheck className="w-16 h-16 text-neon" />
        </div>
      </FadeIn>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-12">
        {STATS.map((s) => (
          <div key={s.l} className="card-neon rounded-2xl p-5 text-center">
            <div className="text-3xl font-display font-extrabold gradient-hero-text"><CountUp to={s.v} /></div>
            <p className="text-sm text-text-secondary mt-1">{s.l}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============ 14. FAQ ============ */
const FAQS = [
  { q: "How long does it take to build a website?", a: "Most websites are delivered in 2–4 weeks. Larger systems take 6–10 weeks depending on scope." },
  { q: "What's included in lifetime free maintenance?", a: "Bug fixes, security patches, small content updates, hosting checks and uptime monitoring — for as long as you stay with us." },
  { q: "Do you provide hosting and domain services?", a: "Yes. We handle domain registration, SSL, and high-performance hosting end to end." },
  { q: "What payment methods do you accept?", a: "Bank transfer, card payments, PayPal and major LKR gateways. Flexible payment plans available." },
  { q: "Can I update the website content myself?", a: "Absolutely. We ship every project with a simple admin panel and we'll train your team." },
  { q: "Do you offer e-commerce solutions?", a: "Yes — full e-commerce with payment gateways, inventory and shipping integrations." },
  { q: "What if I'm not satisfied with the design?", a: "We iterate on mockups until you're happy. Design approval is required before development begins." },
  { q: "Do you offer ongoing support after launch?", a: "Yes — 24/7 support is included with every plan, even after launch." },
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <SectionHeader badge="FAQ" title={<>Frequently asked <span className="gradient-hero-text">questions</span></>} />
      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="card-neon rounded-xl overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-foreground">{f.q}</span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isOpen ? "bg-gradient-to-br from-neon to-[#0077FF] text-white" : "bg-bg-blue text-neon"}`}>
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-text-secondary leading-relaxed text-sm">{f.a}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-10 text-text-secondary">
        Still have questions? <a href="#contact" className="text-neon font-semibold">Contact us →</a>
      </p>
    </Section>
  );
}

/* ============ 15. Limited Time Offer ============ */
export function OfferBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neon via-[#33CCFF] to-[#0077FF] p-10 lg:p-14 text-white text-center shadow-[0_30px_80px_rgba(0,191,255,0.4)]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%), radial-gradient(circle at 80% 80%, white, transparent 40%)" }} />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl lg:text-5xl">Let's build something great together.</h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/90">
              Book a free consultation — no pressure, no upfront fee. We'll map out exactly what you need and give you a clear quote.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#contact" className="rounded-lg px-6 py-3 bg-white text-neon font-semibold hover:scale-[1.02] transition shadow-lg">Start Your Project</a>
              <a href="#contact" className="rounded-lg px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-neon transition">Schedule a Free Call</a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/90">
              {["Free Consultation", "No Hidden Fees", "Fast Response", "Free Quote"].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><Check className="w-4 h-4" />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ 16. Contact ============ */
export function Contact() {
  return (
    <Section alt id="contact">
      <SectionHeader badge="Get in Touch" title={<>Let's build something <span className="gradient-hero-text">amazing</span></>} />
      <div className="grid lg:grid-cols-2 gap-8">
        <FadeIn>
          <form className="card-neon rounded-2xl p-6 lg:p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20" placeholder="Full Name" />
              <input className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20" placeholder="Email Address" type="email" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20" placeholder="Phone Number" />
              <input className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20" placeholder="Subject" />
            </div>
            <textarea rows={5} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20" placeholder="Tell us about your project…" />
            <button className="btn-primary rounded-lg px-6 py-3 font-semibold inline-flex items-center gap-2">Send Message <ArrowRight className="w-4 h-4" /></button>
          </form>
        </FadeIn>
        <div className="space-y-4">
          {[
            { i: Mail, t: "Email", v: "esystemlk@gmail.com" },
            { i: Phone, t: "Phone", v: "+94 76 571 1396 · +94 77 581 1396 · +94 70 671 1396" },
            { i: Globe, t: "Website", v: "www.esystemlk.com" },
            { i: MapPin, t: "Office", v: "No 618, 6th Floor, Jana Jaya City Mall, Rajagiriya, Sri Lanka" },
          ].map((c) => (
            <FadeIn key={c.t}>
              <div className="card-neon rounded-2xl p-5 flex items-start gap-4">
                <span className="icon-circle shrink-0"><c.i className="w-5 h-5" /></span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-text-muted font-semibold">{c.t}</div>
                  <div className="text-foreground font-semibold mt-0.5">{c.v}</div>
                </div>
              </div>
            </FadeIn>
          ))}
          {/* WhatsApp buttons */}
          <FadeIn>
            <div className="card-neon rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">WhatsApp Us</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/94765711396"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L0 24l6.338-1.501A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.372l-.36-.214-3.732.884.936-3.617-.235-.374A9.818 9.818 0 1112 21.818z"/>
                  </svg>
                  +94 76 571 1396
                </a>
                <a
                  href="https://wa.me/94775811396"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L0 24l6.338-1.501A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.372l-.36-.214-3.732.884.936-3.617-.235-.374A9.818 9.818 0 1112 21.818z"/>
                  </svg>
                  +94 77 581 1396
                </a>
              </div>
            </div>
          </FadeIn>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary pt-2">
            {["Free Consultation", "No Hidden Fees", "Quick Response"].map((t) => (
              <span key={t} className="flex items-center gap-2"><Check className="w-4 h-4 text-neon" />{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============ 17. Footer ============ */
export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="font-display font-black text-2xl tracking-[-0.04em] select-none">
              <span className="text-white">ESYSTEM</span>
              <span
                style={{
                  background: "linear-gradient(90deg,#00bfff,#0077ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >LK</span>
              <span
                className="ml-1 inline-block w-2 h-2 rounded-full align-middle mb-1"
                style={{ background: "#00bfff", boxShadow: "0 0 8px #00bfff" }}
              />
            </div>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              We build websites, web apps and software — maintained for life. Based in Sri Lanka, serving globally.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-neon hover:border-neon hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {["Home", "About", "Portfolio", "Pricing", "Blog", "Contact"].map((l) => (
                <li key={l}><a className="hover:text-neon transition">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {["Websites", "Web Apps", "Software Systems", "UI/UX Design", "Hosting", "Maintenance"].map((l) => (
                <li key={l}><a className="hover:text-neon transition">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 text-neon shrink-0 mt-0.5" />esystemlk@gmail.com</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 text-neon shrink-0 mt-0.5" /><span>+94 76 571 1396<br />+94 77 581 1396<br />+94 70 671 1396</span></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-neon shrink-0 mt-0.5" />No 618, 6th Floor, Jana Jaya City Mall, Rajagiriya, Sri Lanka</li>
            </ul>
            <ul className="mt-5 space-y-1 text-xs text-white/50">
              <li>• Lifetime free maintenance for all packages</li>
              <li>• Free consultation, no upfront fees</li>
              <li>• Refunds available before development starts</li>
              <li>• All work covered by NDA on request</li>
              <li>• Hosting & domain transferable any time</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neon/20 mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
          <div>© 2020–2026 Developed and Powered by <span className="text-neon font-semibold">ESYSTEMLK</span></div>
          <div className="flex gap-5">
            <a className="hover:text-neon transition">Privacy Policy</a>
            <a className="hover:text-neon transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
