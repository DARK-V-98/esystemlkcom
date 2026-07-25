import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy, RefreshCw } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free UUID Generator Online (v4)",
  "description": "Generate one or many random version 4 UUIDs instantly in your browser. Free, no upload.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/uuid-generator",
});

export const Route = createFileRoute("/tools/uuid-generator")({
  head: () => ({
    meta: [
      { title: "Free UUID Generator Online — v4 GUID | ESYSTEMLK Tools" },
      { name: "description", content: "Generate random version 4 UUIDs (GUIDs) online for free. Create one or many unique identifiers instantly — runs entirely in your browser, nothing uploaded." },
      { name: "keywords", content: "uuid generator online, guid generator, uuid v4 generator, generate uuid, random uuid, unique id generator, bulk uuid generator" },
      { property: "og:title", content: "Free UUID Generator Online — v4 GUID" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/uuid-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/uuid-generator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["uuid-generator"].faq) },
    ],
  }),
  component: UuidGeneratorPage,
});

function makeUuid(): string {
  const c = globalThis.crypto;
  if (typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Fallback: build a v4 UUID from secure random bytes.
  const bytes = c.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

function UuidGeneratorPage() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([makeUuid()]);
  const [copied, setCopied] = useState("");

  const generate = () => {
    setUuids(Array.from({ length: count }, () => makeUuid()));
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate secure random version 4 UUIDs — one or many at a time. Runs in your browser."
      article={<ToolArticle title="UUID Generator" data={TOOL_ARTICLES["uuid-generator"]} />}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm text-text-secondary">How many:</label>
          <input
            type="number" min={1} max={100} value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, +e.target.value)))}
            className="w-20 border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-neon"
          />
          <ToolBtn onClick={generate}><RefreshCw className="w-4 h-4" /> Generate</ToolBtn>
          {uuids.length > 1 && (
            <button
              onClick={() => copy(uuids.join("\n"), "all")}
              className="text-sm text-text-secondary hover:text-neon font-semibold ml-auto"
            >
              {copied === "all" ? "✓ Copied all" : "Copy all"}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-blue/40 rounded-xl px-4 py-2.5">
              <code className="flex-1 text-sm font-mono break-all text-foreground">{u}</code>
              <button onClick={() => copy(u, String(i))} className="shrink-0 text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                <Copy className="w-3 h-3" /> {copied === String(i) ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted">✓ Uses a cryptographically secure random source. ✓ Nothing sent to servers.</p>
      </div>
    </ToolLayout>
  );
}
