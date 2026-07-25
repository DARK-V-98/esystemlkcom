import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy, RefreshCw } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free CSS Gradient Generator Online",
  "description": "Design CSS linear gradients visually and copy the ready-to-use CSS. Free, runs in your browser.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/gradient-generator",
});

export const Route = createFileRoute("/tools/gradient-generator")({
  head: () => ({
    meta: [
      { title: "Free CSS Gradient Generator — Linear Gradient Maker | ESYSTEMLK Tools" },
      { name: "description", content: "Design CSS linear gradients visually with a live preview and copy the ready-to-use CSS. Free online gradient generator that runs entirely in your browser." },
      { name: "keywords", content: "css gradient generator, linear gradient maker, gradient background css, gradient tool online, css background generator, ui gradient" },
      { property: "og:title", content: "Free CSS Gradient Generator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/gradient-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/gradient-generator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["gradient-generator"].faq) },
    ],
  }),
  component: GradientGeneratorPage,
});

const randHex = () => "#" + Array.from({ length: 6 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

function GradientGeneratorPage() {
  const [c1, setC1] = useState("#00bfff");
  const [c2, setC2] = useState("#0077ff");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const css = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  const full = `background: ${css};`;

  const copy = () => {
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Design a linear gradient visually and copy the ready-to-use CSS. Runs in your browser."
      article={<ToolArticle title="CSS Gradient Generator" data={TOOL_ARTICLES["gradient-generator"]} />}
    >
      <div className="space-y-6">
        <div className="h-48 rounded-2xl border border-border" style={{ backgroundImage: css }} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Color 1</label>
            <div className="flex items-center gap-2">
              <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input value={c1} onChange={(e) => setC1(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon" />
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Color 2</label>
            <div className="flex items-center gap-2">
              <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <input value={c2} onChange={(e) => setC2(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-1">Angle: <strong>{angle}°</strong></label>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full accent-neon" />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setC1(randHex()); setC2(randHex()); }}
            className="btn-outline-neon inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" /> Random
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-text-secondary">CSS</label>
            <button onClick={copy} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
              <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block w-full border border-neon/30 rounded-lg px-3 py-2.5 text-sm font-mono bg-bg-blue/40 break-all">{full}</code>
        </div>

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
