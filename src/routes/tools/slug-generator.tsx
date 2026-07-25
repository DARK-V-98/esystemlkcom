import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free URL Slug Generator Online",
  "description": "Turn any title into a clean, SEO-friendly URL slug instantly. Free, runs in your browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/slug-generator",
});

export const Route = createFileRoute("/tools/slug-generator")({
  head: () => ({
    meta: [
      { title: "Free URL Slug Generator — SEO-Friendly Slugs | ESYSTEMLK Tools" },
      { name: "description", content: "Convert any title or phrase into a clean, SEO-friendly URL slug. Handles accents, spaces and special characters — free and runs entirely in your browser." },
      { name: "keywords", content: "slug generator, url slug generator, seo slug tool, permalink generator, url friendly text, convert title to slug, make url slug" },
      { property: "og:title", content: "Free URL Slug Generator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/slug-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/slug-generator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["slug-generator"].faq) },
    ],
  }),
  component: SlugGeneratorPage,
});

// U+0300–U+036F are combining diacritical marks; stripping them after NFD
// normalization turns accented letters (é, ñ, ā) into plain ASCII.
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string, sep: string) {
  return text
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/[\s_-]+/g, sep)
    .replace(new RegExp(`^${sep}+|${sep}+$`, "g"), "");
}

function SlugGeneratorPage() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = slugify(text, sep);

  const copy = () => {
    navigator.clipboard.writeText(slug).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout
      title="URL Slug Generator"
      description="Turn any title into a clean, SEO-friendly URL slug. Handles accents and special characters."
      article={<ToolArticle title="URL Slug Generator" data={TOOL_ARTICLES["slug-generator"]} />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Title or phrase</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Best Coffee Shops in Colombo 2026"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon"
          />
        </div>

        <div className="flex gap-3 items-center">
          <span className="text-sm text-text-secondary">Separator:</span>
          {([["-", "Hyphen ( - )"], ["_", "Underscore ( _ )"]] as const).map(([s, label]) => (
            <button key={s} onClick={() => setSep(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                sep === s ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-text-secondary">Slug</label>
            <button onClick={copy} disabled={!slug} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition disabled:opacity-40">
              <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="w-full border border-neon/30 rounded-lg px-3 py-2.5 text-sm font-mono bg-bg-blue/40 min-h-[42px] break-all">
            {slug || <span className="text-text-muted">your-slug-appears-here</span>}
          </div>
        </div>

        <p className="text-xs text-text-muted">✓ Runs entirely in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
