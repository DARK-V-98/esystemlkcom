import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Check, X } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Color Contrast Checker (WCAG)",
  "description": "Check color contrast ratio against WCAG AA and AAA for accessible text. Free, in your browser.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/contrast-checker",
});

export const Route = createFileRoute("/tools/contrast-checker")({
  head: () => ({
    meta: [
      { title: "Free Color Contrast Checker — WCAG AA & AAA | ESYSTEMLK Tools" },
      { name: "description", content: "Check the contrast ratio between text and background colors against WCAG AA and AAA accessibility standards. Free online contrast checker that runs in your browser." },
      { name: "keywords", content: "color contrast checker, wcag contrast checker, accessibility contrast, contrast ratio calculator, aa aaa contrast, text readability checker" },
      { property: "og:title", content: "Free Color Contrast Checker (WCAG)" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/contrast-checker" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/contrast-checker" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["contrast-checker"].faq) },
    ],
  }),
  component: ContrastCheckerPage,
});

function luminance(hex: string): number | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  const chan = [m[1], m[2], m[3]].map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function Badge({ pass }: { pass: boolean }) {
  return pass ? (
    <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm"><Check className="w-4 h-4" /> Pass</span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm"><X className="w-4 h-4" /> Fail</span>
  );
}

function ContrastCheckerPage() {
  const [text, setText] = useState("#0b1220");
  const [bg, setBg] = useState("#ffffff");

  const lt = luminance(text);
  const lb = luminance(bg);
  const ratio = lt !== null && lb !== null ? (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05) : null;

  return (
    <ToolLayout
      title="Color Contrast Checker"
      description="Check text vs background contrast against WCAG AA and AAA accessibility standards."
      article={<ToolArticle title="Color Contrast Checker" data={TOOL_ARTICLES["contrast-checker"]} />}
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Text color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={text} onChange={(e) => setText(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon" />
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Background color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-border p-6" style={{ backgroundColor: bg, color: text }}>
          <p className="text-2xl font-bold">Large sample text</p>
          <p className="text-sm mt-1">The quick brown fox jumps over the lazy dog — this is normal body text at a smaller size.</p>
        </div>

        {ratio !== null ? (
          <div className="space-y-4">
            <div className="bg-bg-blue/40 rounded-2xl p-6 text-center">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">Contrast ratio</div>
              <div className="font-display font-black text-4xl text-neon">{ratio.toFixed(2)}:1</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                <span className="text-text-secondary">AA · normal</span> <Badge pass={ratio >= 4.5} />
              </div>
              <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                <span className="text-text-secondary">AA · large</span> <Badge pass={ratio >= 3} />
              </div>
              <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                <span className="text-text-secondary">AAA · normal</span> <Badge pass={ratio >= 7} />
              </div>
              <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                <span className="text-text-secondary">AAA · large</span> <Badge pass={ratio >= 4.5} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">Enter two valid 6-digit HEX colors.</p>
        )}

        <p className="text-xs text-text-muted">✓ Calculated in your browser using the WCAG formula. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
