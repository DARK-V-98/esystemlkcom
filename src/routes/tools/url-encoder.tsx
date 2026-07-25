import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free URL Encoder & Decoder Online",
  "description": "Encode or decode URLs and query-string values instantly in your browser. Free, no upload.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/url-encoder",
});

export const Route = createFileRoute("/tools/url-encoder")({
  head: () => ({
    meta: [
      { title: "Free URL Encoder & Decoder Online | ESYSTEMLK Tools" },
      { name: "description", content: "Encode or decode URLs and query-string values online for free. Percent-encode special characters or decode them back — runs entirely in your browser, nothing uploaded." },
      { name: "keywords", content: "url encoder decoder online, url encode, url decode, percent encoding, encodeuricomponent online, query string encoder, escape url" },
      { property: "og:title", content: "Free URL Encoder & Decoder Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/url-encoder" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/url-encoder" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["url-encoder"].faq) },
    ],
  }),
  component: UrlEncoderPage,
});

function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"component" | "full">("component");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = (decode: boolean) => {
    setError("");
    try {
      if (decode) {
        setOutput(mode === "component" ? decodeURIComponent(input) : decodeURI(input));
      } else {
        setOutput(mode === "component" ? encodeURIComponent(input) : encodeURI(input));
      }
    } catch {
      setOutput("");
      setError("Could not process this input. Check that it is valid.");
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
      title="URL Encoder / Decoder"
      description="Percent-encode or decode URLs and query-string values. Runs in your browser — nothing is uploaded."
      article={<ToolArticle title="URL Encoder / Decoder" data={TOOL_ARTICLES["url-encoder"]} />}
    >
      <div className="space-y-6">
        <div className="flex gap-3">
          {([["component", "Component"], ["full", "Full URL"]] as const).map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                mode === m ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-1">Input</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="Enter text or a URL…"
            rows={5}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <ToolBtn onClick={() => run(false)} disabled={!input}>Encode</ToolBtn>
          <ToolBtn variant="outline" onClick={() => run(true)} disabled={!input}>Decode</ToolBtn>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-text-secondary">Result</label>
              <button onClick={copy} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly value={output} rows={5}
              className="w-full border border-neon/30 rounded-lg px-3 py-2 text-sm font-mono bg-bg-blue/40 focus:outline-none resize-y"
            />
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
