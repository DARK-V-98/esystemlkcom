import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Hash Generator Online — MD5 SHA-256 SHA-512",
  "description": "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text or files. Free, runs in browser.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/hash-generator",
});

export const Route = createFileRoute("/tools/hash-generator")({
  head: () => ({
    meta: [
      { title: "Free Hash Generator — SHA-256, SHA-512, MD5 Online | ESYSTEMLK Tools" },
      { name: "description", content: "Generate SHA-256, SHA-512, SHA-1 cryptographic hashes from text or any file. Free online hash generator — runs entirely in your browser." },
      { name: "keywords", content: "hash generator online free, sha256 generator, sha512 generator, md5 hash generator, file hash checker, sha1 generator online, checksum generator" },
      { property: "og:title", content: "Free Hash Generator — SHA-256 SHA-512 Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/hash-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/hash-generator" }],
    scripts: [{ type: "application/ld+json", children: LD }],
  }),
  component: HashGeneratorPage,
});

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function hashBuffer(algo: Algo, buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function HashGeneratorPage() {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const generateText = async () => {
    if (!text) return;
    setLoading(true);
    const enc = new TextEncoder().encode(text);
    const results: Record<string, string> = {};
    for (const algo of ALGOS) {
      results[algo] = await hashBuffer(algo, enc.buffer as ArrayBuffer);
    }
    setHashes(results);
    setLoading(false);
  };

  const generateFile = async () => {
    if (!file) return;
    setLoading(true);
    const buf = await file.arrayBuffer();
    const results: Record<string, string> = {};
    for (const algo of ALGOS) {
      results[algo] = await hashBuffer(algo, buf);
    }
    setHashes(results);
    setLoading(false);
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  return (
    <ToolLayout title="Hash Generator" description="Generate SHA-256, SHA-512, SHA-384 and SHA-1 hashes from text or any file.">
      <div className="space-y-6">
        {/* Tab */}
        <div className="flex gap-3">
          {(["text", "file"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setHashes({}); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                tab === t ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {t === "text" ? "Text" : "File"}
            </button>
          ))}
        </div>

        {tab === "text" && (
          <>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Input text</label>
              <textarea
                value={text} onChange={(e) => { setText(e.target.value); setHashes({}); }}
                placeholder="Enter any text to hash…"
                rows={4}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
              />
            </div>
            <ToolBtn onClick={generateText} disabled={loading || !text}>
              {loading ? "Hashing…" : "Generate Hashes"}
            </ToolBtn>
          </>
        )}

        {tab === "file" && (
          <>
            <UploadArea label="Drop any file to hash" accept="*" onChange={(f) => { setFile(f); setHashes({}); }} file={file} />
            {file && (
              <ToolBtn onClick={generateFile} disabled={loading}>
                {loading ? "Hashing…" : "Generate Hashes"}
              </ToolBtn>
            )}
          </>
        )}

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {ALGOS.map((algo) => (
              <div key={algo} className="bg-bg-blue/40 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-neon uppercase tracking-wide">{algo}</span>
                  <button onClick={() => copy(hashes[algo], algo)} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                    <Copy className="w-3 h-3" /> {copied === algo ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="text-xs font-mono text-foreground break-all">{hashes[algo]}</code>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Uses the browser's built-in Web Crypto API. ✓ Nothing sent to servers. ✓ SHA-1 shown for legacy/checksum use — not recommended for security.</p>
      </div>
    </ToolLayout>
  );
}
