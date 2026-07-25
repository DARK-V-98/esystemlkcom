import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Text Case Converter Online",
  "description": "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more. Free, in browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/case-converter",
});

export const Route = createFileRoute("/tools/case-converter")({
  head: () => ({
    meta: [
      { title: "Free Case Converter — UPPERCASE, lowercase, Title Case | ESYSTEMLK Tools" },
      { name: "description", content: "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and kebab-case online for free. Runs entirely in your browser." },
      { name: "keywords", content: "case converter online, uppercase lowercase converter, title case converter, camelcase converter, snake case, sentence case tool, change text case" },
      { property: "og:title", content: "Free Text Case Converter Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/case-converter" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/case-converter" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["case-converter"].faq) },
    ],
  }),
  component: CaseConverterPage,
});

const words = (s: string) => s.match(/[A-Za-z0-9]+/g) ?? [];

const CASES: { key: string; label: string; fn: (s: string) => string }[] = [
  { key: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { key: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
  { key: "title", label: "Title Case", fn: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { key: "sentence", label: "Sentence case", fn: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
  { key: "camel", label: "camelCase", fn: (s) => words(s).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
  { key: "snake", label: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { key: "kebab", label: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
];

function CaseConverterPage() {
  const [text, setText] = useState("");
  const [active, setActive] = useState("title");
  const [copied, setCopied] = useState(false);

  const output = CASES.find((c) => c.key === active)!.fn(text);

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more."
      article={<ToolArticle title="Case Converter" data={TOOL_ARTICLES["case-converter"]} />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Your text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to convert…"
            rows={5}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon resize-y"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CASES.map((c) => (
            <button key={c.key} onClick={() => setActive(c.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                active === c.key ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-text-secondary">Result</label>
            <button onClick={copy} disabled={!output} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition disabled:opacity-40">
              <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly value={output} rows={5}
            className="w-full border border-neon/30 rounded-lg px-3 py-2 text-sm bg-bg-blue/40 focus:outline-none resize-y"
          />
        </div>

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
