import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free JSON Formatter & Validator Online",
  "description": "Format, beautify, minify and validate JSON instantly in your browser. Free, no upload.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/json-formatter",
});

export const Route = createFileRoute("/tools/json-formatter")({
  head: () => ({
    meta: [
      { title: "Free JSON Formatter, Validator & Beautifier Online | ESYSTEMLK Tools" },
      { name: "description", content: "Format, beautify, minify and validate JSON online for free. Instantly pretty-print messy JSON or find syntax errors — runs entirely in your browser, nothing uploaded." },
      { name: "keywords", content: "json formatter online, json validator, json beautifier, format json, minify json, json pretty print, validate json online, json lint" },
      { property: "og:title", content: "Free JSON Formatter & Validator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/json-formatter" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/json-formatter" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["json-formatter"].faq) },
    ],
  }),
  component: JsonFormatterPage,
});

function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = (minify = false) => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : indent));
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout
      title="JSON Formatter / Validator"
      description="Beautify, minify and validate JSON. Everything runs in your browser — nothing is uploaded."
      article={<ToolArticle title="JSON Formatter / Validator" data={TOOL_ARTICLES["json-formatter"]} />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder='{"hello":"world","items":[1,2,3]}'
            rows={7}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
          />
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <ToolBtn onClick={() => format(false)} disabled={!input}>Format</ToolBtn>
          <ToolBtn variant="outline" onClick={() => format(true)} disabled={!input}>Minify</ToolBtn>
          <label className="text-sm text-text-secondary flex items-center gap-2 ml-auto">
            Indent
            <select
              value={indent}
              onChange={(e) => setIndent(+e.target.value)}
              className="border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-neon"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-mono">{error}</p>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-text-secondary">Result</label>
              <button onClick={copy} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly value={output} rows={9}
              className="w-full border border-neon/30 rounded-lg px-3 py-2 text-sm font-mono bg-bg-blue/40 focus:outline-none resize-y"
            />
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
