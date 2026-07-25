import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy, RefreshCw } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Strong Password Generator Online",
  "description": "Generate cryptographically secure random passwords instantly. Free, runs in browser — nothing sent to servers.",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/password-generator",
});

export const Route = createFileRoute("/tools/password-generator")({
  head: () => ({
    meta: [
      { title: "Free Strong Password Generator Online | ESYSTEMLK Tools" },
      { name: "description", content: "Generate cryptographically secure, random strong passwords online for free. Customize length and character types. No account needed." },
      { name: "keywords", content: "password generator free, strong password generator, random password generator, secure password maker, generate password online, complex password generator" },
      { property: "og:title", content: "Free Strong Password Generator — Secure & Random" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/password-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/password-generator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["password-generator"].faq) },
    ],
  }),
  component: PasswordGeneratorPage,
});

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function strength(pwd: string): { label: string; color: string; pct: number } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", color: "#ef4444", pct: 25 };
  if (score <= 4) return { label: "Fair", color: "#f59e0b", pct: 50 };
  if (score <= 5) return { label: "Good", color: "#3b82f6", pct: 75 };
  return { label: "Strong", color: "#22c55e", pct: 100 };
}

function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(1);
  const [bulk, setBulk] = useState<string[]>([]);

  const generate = useCallback((len = length, options = opts) => {
    let charset = "";
    if (options.upper) charset += CHARS.upper;
    if (options.lower) charset += CHARS.lower;
    if (options.numbers) charset += CHARS.numbers;
    if (options.symbols) charset += CHARS.symbols;
    if (!charset) return "";
    const arr = crypto.getRandomValues(new Uint32Array(len));
    return Array.from(arr).map((v) => charset[v % charset.length]).join("");
  }, [length, opts]);

  const gen = () => {
    const pwd = generate();
    setPassword(pwd);
    setBulk([]);
  };

  const genBulk = () => {
    setBulk(Array.from({ length: count }, () => generate()));
    setPassword("");
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const str = password ? strength(password) : null;

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate cryptographically secure passwords using your browser's built-in crypto API."
      article={<ToolArticle title="Password Generator" data={TOOL_ARTICLES["password-generator"]} />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Length: <strong>{length}</strong></label>
          <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="w-full accent-neon" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(opts) as (keyof typeof opts)[]).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
              <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts((o) => ({ ...o, [k]: e.target.checked }))} className="accent-neon" />
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </label>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <ToolBtn onClick={gen}><RefreshCw className="w-4 h-4" /> Generate</ToolBtn>
        </div>

        {password && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-bg-blue/40 rounded-xl px-4 py-3">
              <code className="flex-1 text-base font-mono break-all text-foreground">{password}</code>
              <button onClick={() => copy(password)} className="shrink-0 text-text-secondary hover:text-neon transition text-sm font-semibold">
                {copied ? "✓ Copied" : <><Copy className="w-4 h-4 inline" /> Copy</>}
              </button>
            </div>
            {str && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Strength</span>
                  <span style={{ color: str.color }} className="font-semibold">{str.label}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: str.pct + "%", backgroundColor: str.color }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary">Bulk generate:</label>
            <input type="number" min={2} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(2, +e.target.value)))}
              className="w-16 border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-neon" />
            <ToolBtn onClick={genBulk}>Generate {count}</ToolBtn>
          </div>
          {bulk.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-xl border border-border">
              {bulk.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2 border-b border-border/50 last:border-b-0 hover:bg-bg-blue/30">
                  <code className="flex-1 text-sm font-mono text-foreground">{p}</code>
                  <button onClick={() => navigator.clipboard.writeText(p)} className="text-xs text-text-muted hover:text-neon">Copy</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted">✓ Uses <code>crypto.getRandomValues</code> — cryptographically secure. ✓ Nothing sent to servers.</p>
      </div>
    </ToolLayout>
  );
}
