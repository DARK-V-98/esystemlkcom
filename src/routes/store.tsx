import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";
import {
  STORE_ITEMS,
  CATEGORIES,
  FEATURED_ID,
  type StoreCategory,
  type StoreItem,
} from "@/data/store";
import {
  Download, Crown, Check, Monitor, Smartphone, LayoutTemplate,
  Package, Sparkles, ArrowRight, Crosshair,
} from "lucide-react";

const CATEGORY_ICON: Record<StoreCategory, typeof Monitor> = {
  software: Monitor,
  app: Smartphone,
  template: LayoutTemplate,
};

const LD_STORE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "ESYSTEMLK Store — Software, Apps & Templates",
  description:
    "Download software, apps, design templates and starter code from ESYSTEMLK. Free downloads with optional premium upgrades.",
  url: "https://www.esystemlk.com/store",
  itemListElement: STORE_ITEMS.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    description: item.tagline,
  })),
});

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store — ESYSTEMLK | Software, Apps, Templates & Code" },
      {
        name: "description",
        content:
          "The ESYSTEMLK Store: download our software like CrossCore (custom gaming crosshair overlay), apps, plus design templates and starter code for developers building AI websites.",
      },
      {
        name: "keywords",
        content:
          "esystemlk store, crosshair software download, gaming overlay software, free software download Sri Lanka, website templates, AI website templates, developer starter code, premium software",
      },
      { property: "og:title", content: "ESYSTEMLK Store — Software, Apps & Templates" },
      {
        property: "og:description",
        content:
          "Download software, apps, design templates and starter code. Free tiers available, premium upgrades for power users.",
      },
      { property: "og:url", content: "https://www.esystemlk.com/store" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/store" }],
    scripts: [{ type: "application/ld+json", children: LD_STORE }],
  }),
  component: StorePage,
});

function StorePage() {
  const [active, setActive] = useState<StoreCategory>("software");

  const featured = STORE_ITEMS.find((i) => i.id === FEATURED_ID);
  const activeMeta = CATEGORIES.find((c) => c.key === active)!;
  const items = STORE_ITEMS.filter(
    (i) => i.category === active && i.id !== FEATURED_ID,
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── Page header ── */}
          <div className="mb-12 text-center">
            <span className="badge-pill mb-4">
              <Package className="w-3.5 h-3.5" /> ESYSTEMLK Store
            </span>
            <h1 className="font-display font-black text-4xl lg:text-5xl tracking-tight text-foreground">
              Software, apps &{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#00bfff,#0077ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ready-to-ship code
              </span>
            </h1>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              Everything we build, in one place. Download the free version,
              upgrade to premium when you need more — or grab a template and
              build on top of it.
            </p>
          </div>

          {/* ── Featured product ── */}
          {featured && <FeaturedCard item={featured} />}

          {/* ── Category tabs ── */}
          <div className="mt-16 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICON[c.key];
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "btn-primary"
                      : "bg-bg-blue text-text-secondary hover:text-neon"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {c.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-sm text-text-secondary max-w-xl mx-auto">
            {activeMeta.blurb}
          </p>

          {/* ── Grid ── */}
          <div className="mt-10">
            {items.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState category={active} hasFeatured={
                active === "software" && !!featured
              } />
            )}
          </div>

          {/* ── Footer CTA ── */}
          <div className="mt-20 card-neon rounded-2xl p-8 lg:p-10 text-center">
            <h2 className="font-display font-black text-2xl lg:text-3xl">
              Need something built for you?
            </h2>
            <p className="mt-3 text-text-secondary max-w-xl mx-auto">
              We build custom software, web apps and websites — with lifetime
              free maintenance on every package.
            </p>
            <a
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
            >
              Talk to us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Featured hero slot — the flagship product
   ───────────────────────────────────────────── */
function FeaturedCard({ item }: { item: StoreItem }) {
  return (
    <section
      id={item.id}
      className="relative overflow-hidden rounded-3xl border border-neon/25 bg-navy text-white"
    >
      <div className="mesh-blob w-80 h-80 -top-20 -right-20 bg-neon animate-blob" />
      <div className="mesh-blob w-72 h-72 -bottom-24 -left-16 bg-[#0077ff] animate-blob" />

      <div className="relative grid lg:grid-cols-2 gap-10 p-8 lg:p-12">
        {/* Left — product info */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-neon/40 text-neon text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Featured
          </span>

          <h2 className="mt-5 font-display font-black text-3xl lg:text-4xl tracking-tight">
            {item.name}
            {item.version && (
              <span className="ml-3 align-middle text-sm font-semibold text-white/50">
                {item.version}
              </span>
            )}
          </h2>

          <p className="mt-2 text-neon font-medium">{item.tagline}</p>

          <p className="mt-4 text-white/70 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {[...item.platforms, ...item.tags].map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-medium"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {item.downloadUrl && (
              <a
                href={item.downloadUrl}
                className="inline-flex items-center gap-2 btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Download {item.price}
              </a>
            )}
            {item.premiumUrl && (
              <a
                href={item.premiumUrl}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold border border-neon/50 text-neon hover:bg-neon hover:text-navy transition-colors"
              >
                <Crown className="w-4 h-4" />
                Go Premium
              </a>
            )}
          </div>

          <p className="mt-3 text-xs text-white/40">
            No account required for the free version.
          </p>
        </div>

        {/* Right — free vs premium */}
        <div className="grid sm:grid-cols-2 gap-4">
          <TierBox
            title="Free"
            price={item.price}
            features={item.features}
            tone="free"
          />
          <TierBox
            title="Premium"
            price={item.premiumPrice}
            features={item.premiumFeatures}
            tone="premium"
          />
        </div>
      </div>
    </section>
  );
}

function TierBox({
  title,
  price,
  features,
  tone,
}: {
  title: string;
  price: string;
  features: string[];
  tone: "free" | "premium";
}) {
  const premium = tone === "premium";
  return (
    <div
      className={`rounded-2xl p-6 border ${
        premium
          ? "border-neon/50 bg-neon/10 shadow-[0_0_30px_rgba(0,191,255,0.15)]"
          : "border-white/15 bg-white/5"
      }`}
    >
      <div className="flex items-center gap-2">
        {premium ? (
          <Crown className="w-4 h-4 text-neon" />
        ) : (
          <Crosshair className="w-4 h-4 text-white/60" />
        )}
        <h3 className="font-display font-bold text-white">{title}</h3>
      </div>
      {price && (
        <div className="mt-1 text-2xl font-display font-black text-neon">
          {price}
        </div>
      )}
      <ul className="mt-4 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
            <Check className="w-4 h-4 text-neon shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Standard product card
   ───────────────────────────────────────────── */
function ProductCard({ item }: { item: StoreItem }) {
  const Icon = CATEGORY_ICON[item.category];
  return (
    <div className="card-neon rounded-2xl p-6 flex flex-col">
      <div className="flex items-start justify-between">
        <span className="icon-circle">
          <Icon className="w-5 h-5" />
        </span>
        {item.comingSoon && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-blue text-text-muted font-medium">
            Coming soon
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display font-bold text-foreground">
        {item.name}
      </h3>
      <p className="text-xs text-neon font-medium mt-0.5">{item.tagline}</p>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed flex-1">
        {item.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full bg-bg-blue text-neon font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.downloadUrl && !item.comingSoon && (
          <a
            href={item.downloadUrl}
            className="inline-flex items-center gap-1.5 btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> {item.price}
          </a>
        )}
        {item.premiumUrl && (
          <a
            href={item.premiumUrl}
            className="inline-flex items-center gap-1.5 btn-outline-neon rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Crown className="w-3.5 h-3.5" /> Premium
          </a>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty state — placeholder slots for new items
   ───────────────────────────────────────────── */
function EmptyState({
  category,
  hasFeatured,
}: {
  category: StoreCategory;
  hasFeatured: boolean;
}) {
  const Icon = CATEGORY_ICON[category];
  const label = CATEGORIES.find((c) => c.key === category)!.label;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-dashed border-neon/30 bg-bg-blue/40 p-6 flex flex-col items-center justify-center text-center min-h-[220px]"
        >
          <span className="icon-circle opacity-60">
            <Icon className="w-5 h-5" />
          </span>
          <p className="mt-4 font-display font-bold text-text-secondary">
            {i === 0 && hasFeatured
              ? "More software on the way"
              : `New ${label.toLowerCase()} slot`}
          </p>
          <p className="mt-1 text-xs text-text-muted max-w-[200px]">
            Reserved space — new releases land here.
          </p>
        </div>
      ))}
    </div>
  );
}
