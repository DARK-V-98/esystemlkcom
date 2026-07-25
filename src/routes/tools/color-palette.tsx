import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Color Palette Generator Online",
  "description": "Generate a harmonious color palette from a base color and copy the HEX codes. Free, in browser.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/color-palette",
});

export const Route = createFileRoute("/tools/color-palette")({
  head: () => ({
    meta: [
      { title: "Free Color Palette Generator — Build Color Schemes | ESYSTEMLK Tools" },
      { name: "description", content: "Generate a harmonious color palette from any base color and copy the HEX codes for your design or brand. Free online color scheme generator that runs in your browser." },
      { name: "keywords", content: "color palette generator, color scheme generator, palette maker, brand colors generator, complementary colors, color combinations, hex palette" },
      { property: "og:title", content: "Free Color Palette Generator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/color-palette" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/color-palette" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["color-palette"].faq) },
    ],
  }),
  component: ColorPalettePage,
});

function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return [200, 100, 50];
  let r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function buildPalette(base: string): string[] {
  const [h, s, l] = hexToHsl(base);
  const clamp = (n: number) => Math.max(8, Math.min(92, n));
  return [
    hslToHex(h, s, clamp(l - 30)),
    hslToHex(h, s, clamp(l - 15)),
    hslToHex(h, s, l),
    hslToHex(h, s, clamp(l + 18)),
    hslToHex((h + 30) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
  ];
}

function ColorPalettePage() {
  const [base, setBase] = useState("#00bfff");
  const [copied, setCopied] = useState("");
  const palette = buildPalette(base);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val);
      setTimeout(() => setCopied(""), 1500);
    });
  };

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate a harmonious palette from a base color and copy the HEX codes. Runs in your browser."
      article={<ToolArticle title="Color Palette Generator" data={TOOL_ARTICLES["color-palette"]} />}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm text-text-secondary">Base color:</label>
          <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-12 rounded-lg border border-border cursor-pointer" />
          <input value={base} onChange={(e) => setBase(e.target.value)} className="w-32 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {palette.map((c, i) => (
            <button
              key={i}
              onClick={() => copy(c)}
              className="group rounded-xl overflow-hidden border border-border text-left"
            >
              <div className="h-24" style={{ backgroundColor: c }} />
              <div className="px-3 py-2 bg-white flex items-center justify-between">
                <code className="text-xs font-mono text-foreground">{c}</code>
                <span className="text-[11px] text-text-muted group-hover:text-neon">{copied === c ? "Copied!" : "Copy"}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted">✓ Click any swatch to copy its HEX. ✓ Runs entirely in your browser.</p>
      </div>
    </ToolLayout>
  );
}
