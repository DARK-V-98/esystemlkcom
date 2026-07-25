import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Percentage Calculator Online",
  "description": "Calculate percentages, percentage of a number and percentage change instantly. Free, in browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/percentage-calculator",
});

export const Route = createFileRoute("/tools/percentage-calculator")({
  head: () => ({
    meta: [
      { title: "Free Percentage Calculator Online — Percent Of, Change | ESYSTEMLK Tools" },
      { name: "description", content: "Calculate a percentage of a number, what percent one number is of another, and percentage increase or decrease. Free online percentage calculator, runs in your browser." },
      { name: "keywords", content: "percentage calculator, percent calculator, percentage of a number, percentage change calculator, percentage increase decrease, calculate percent online" },
      { property: "og:title", content: "Free Percentage Calculator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/percentage-calculator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/percentage-calculator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["percentage-calculator"].faq) },
    ],
  }),
  component: PercentageCalculatorPage,
});

const fmt = (n: number) => (Number.isFinite(n) ? Math.round(n * 10000) / 10000 : 0).toLocaleString();

function Num({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="number" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-24 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-neon"
    />
  );
}

function Result({ children }: { children: React.ReactNode }) {
  return <div className="bg-bg-blue/40 rounded-xl px-4 py-3 text-sm font-semibold text-foreground">{children}</div>;
}

function PercentageCalculatorPage() {
  const [a1, setA1] = useState("15"); const [a2, setA2] = useState("200");
  const [b1, setB1] = useState("50"); const [b2, setB2] = useState("200");
  const [c1, setC1] = useState("200"); const [c2, setC2] = useState("250");

  const r1 = (Number(a1) / 100) * Number(a2);
  const r2 = (Number(b1) / Number(b2)) * 100;
  const r3 = ((Number(c2) - Number(c1)) / Number(c1)) * 100;

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Find a percentage of a number, what percent one number is of another, and percentage change."
      article={<ToolArticle title="Percentage Calculator" data={TOOL_ARTICLES["percentage-calculator"]} />}
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">What is X% of a number?</h3>
          <div className="flex items-center gap-2 flex-wrap text-sm text-text-secondary">
            What is <Num value={a1} onChange={setA1} /> % of <Num value={a2} onChange={setA2} /> ?
          </div>
          <Result>= {fmt(r1)}</Result>
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">X is what percent of Y?</h3>
          <div className="flex items-center gap-2 flex-wrap text-sm text-text-secondary">
            <Num value={b1} onChange={setB1} /> is what percent of <Num value={b2} onChange={setB2} /> ?
          </div>
          <Result>= {fmt(r2)} %</Result>
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <h3 className="font-semibold text-foreground">Percentage increase / decrease</h3>
          <div className="flex items-center gap-2 flex-wrap text-sm text-text-secondary">
            From <Num value={c1} onChange={setC1} /> to <Num value={c2} onChange={setC2} />
          </div>
          <Result>
            {Number.isFinite(r3) ? (
              <span className={r3 >= 0 ? "text-green-600" : "text-red-600"}>
                {r3 >= 0 ? "▲ increase" : "▼ decrease"} of {fmt(Math.abs(r3))} %
              </span>
            ) : "—"}
          </Result>
        </div>

        <p className="text-xs text-text-muted">✓ Calculated live in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
