import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Color Converter — HEX, RGB, HSL",
  "description": "Convert colors between HEX, RGB and HSL and pick colors visually. Free, runs in your browser.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/color-converter",
});

export const Route = createFileRoute("/tools/color-converter")({
  head: () => ({
    meta: [
      { title: "Free Color Converter — HEX to RGB to HSL Picker | ESYSTEMLK Tools" },
      { name: "description", content: "Convert colors between HEX, RGB and HSL and pick a color visually. See all formats at once. Free online color converter that runs entirely in your browser." },
      { name: "keywords", content: "color converter, hex to rgb, rgb to hex, hex to hsl, color picker online, hsl converter, css color converter, color code converter" },
      { property: "og:title", content: "Free Color Converter — HEX, RGB, HSL" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/color-converter" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/color-converter" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["color-converter"].faq) },
    ],
  }),
  component: ColorConverterPage,
});

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
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

function ColorConverterPage() {
  const [hex, setHex] = useState("#00bfff");
  const [copied, setCopied] = useState("");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;
  const rgbStr = rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : "—";
  const hslStr = hsl ? `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` : "—";

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB and HSL, and pick a color visually. Runs in your browser."
      article={<ToolArticle title="Color Converter" data={TOOL_ARTICLES["color-converter"]} />}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="color" value={rgb ? hex : "#00bfff"}
            onChange={(e) => setHex(e.target.value)}
            className="w-20 h-20 rounded-xl border border-border cursor-pointer bg-white"
          />
          <div
            className="flex-1 min-w-[160px] h-20 rounded-xl border border-border"
            style={{ backgroundColor: rgb ? hex : "transparent" }}
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-1">HEX</label>
          <input
            value={hex} onChange={(e) => setHex(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon"
          />
          {!rgb && <p className="text-xs text-red-500 mt-1">Enter a valid 6-digit HEX color, e.g. #00bfff.</p>}
        </div>

        {rgb && (
          <div className="space-y-3">
            {([["HEX", hex.toLowerCase(), "hex"], ["RGB", rgbStr, "rgb"], ["HSL", hslStr, "hsl"]] as const).map(([label, val, key]) => (
              <div key={key} className="flex items-center gap-3 bg-bg-blue/40 rounded-xl px-4 py-2.5">
                <span className="w-12 shrink-0 text-xs font-bold text-neon uppercase">{label}</span>
                <code className="flex-1 font-mono text-sm text-foreground">{val}</code>
                <button onClick={() => copy(val, key)} className="shrink-0 text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                  <Copy className="w-3 h-3" /> {copied === key ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
