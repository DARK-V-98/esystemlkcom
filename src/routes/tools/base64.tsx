import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Base64 Encoder & Decoder Online",
  "description": "Encode or decode Base64 text and files instantly in your browser. Free, no upload.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/base64",
});

export const Route = createFileRoute("/tools/base64")({
  head: () => ({
    meta: [
      { title: "Free Base64 Encoder & Decoder Online | ESYSTEMLK Tools" },
      { name: "description", content: "Encode text or files to Base64 and decode Base64 back to text or files. Free online Base64 tool — works entirely in your browser." },
      { name: "keywords", content: "base64 encoder decoder online, base64 encode text, base64 decode free, base64 converter online, encode decode base64, base64 to text" },
      { property: "og:title", content: "Free Base64 Encoder & Decoder Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/base64" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/base64" }],
    scripts: [{ type: "application/ld+json", children: LD }],
  }),
  component: Base64Page,
});

function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"text" | "file">("text");
  const [fileResult, setFileResult] = useState("");

  const encode = () => {
    setError("");
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setError("Failed to encode. Make sure the text is valid.");
    }
  };

  const decode = () => {
    setError("");
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setError("Invalid Base64 input. Make sure the string is valid.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFileResult(dataUrl);
    };
    reader.readAsDataURL(f);
  };

  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode or decode Base64 strings. Also encode files to Base64 data URLs.">
      <div className="space-y-6">
        {/* Tab */}
        <div className="flex gap-3">
          {(["text", "file"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); setOutput(""); setFileResult(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                tab === t ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {t === "text" ? "Text" : "File → Base64"}
            </button>
          ))}
        </div>

        {tab === "text" && (
          <>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Input</label>
              <textarea
                value={input} onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
                placeholder="Enter text or Base64 string…"
                rows={5}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <ToolBtn onClick={encode} disabled={!input}>Encode to Base64</ToolBtn>
              <ToolBtn variant="outline" onClick={decode} disabled={!input}>Decode from Base64</ToolBtn>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {output && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-text-secondary">Output</label>
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
          </>
        )}

        {tab === "file" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              <label className="cursor-pointer">
                <p className="text-sm text-text-secondary mb-2">Click to select any file</p>
                <input type="file" className="hidden" onChange={onFile} />
                <span className="text-xs text-text-muted">(image, PDF, document…)</span>
              </label>
            </div>
            {fileResult && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-text-secondary">Base64 Data URL</label>
                  <button onClick={() => { navigator.clipboard.writeText(fileResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                    <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea readOnly value={fileResult} rows={6}
                  className="w-full border border-neon/30 rounded-lg px-3 py-2 text-xs font-mono bg-bg-blue/40 focus:outline-none resize-y" />
                <p className="text-xs text-text-muted mt-1">Length: {fileResult.length.toLocaleString()} characters</p>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
