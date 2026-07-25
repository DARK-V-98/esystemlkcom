import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Online Word Counter",
  "description": "Count words, characters, sentences, paragraphs and reading time online for free. Real-time, no upload.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/word-counter",
});

export const Route = createFileRoute("/tools/word-counter")({
  head: () => ({
    meta: [
      { title: "Free Online Word Counter — Count Words & Characters | ESYSTEMLK Tools" },
      { name: "description", content: "Count words, characters, sentences, paragraphs and estimated reading time in real time. Free online word counter — paste your text and get instant results." },
      { name: "keywords", content: "word counter online free, character counter, count words online, word count tool, sentence counter, reading time calculator, word frequency counter" },
      { property: "og:title", content: "Free Word Counter — Words, Characters & Reading Time" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/word-counter" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/word-counter" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["word-counter"].faq) },
    ],
  }),
  component: WordCounterPage,
});

function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.trim() === "" ? 0 : (text.match(/[^.!?]+[.!?]+/g) ?? [text.trim()]).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
    const readingTime = Math.max(1, Math.ceil(words / 200)); // 200 wpm average
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  // Word frequency
  const freq = useMemo(() => {
    if (!text.trim()) return [];
    const map = new Map<string, number>();
    text.toLowerCase().match(/\b[a-z']{2,}\b/g)?.forEach((w) => map.set(w, (map.get(w) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [text]);

  const STATS = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No spaces", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Read time", value: stats.readingTime + " min" },
  ];

  return (
    <ToolLayout
      title="Word Counter"
      description="Paste or type any text — get live word count, character count, reading time and top words."
      article={<ToolArticle title="Word Counter" data={TOOL_ARTICLES["word-counter"]} />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm text-text-secondary block mb-1">Your text</label>
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here…"
            rows={10}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon resize-y"
          />
          {text && (
            <button onClick={() => setText("")} className="text-xs text-text-muted hover:text-red-500 mt-1 transition">
              Clear text
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="bg-bg-blue/40 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-neon">{s.value.toLocaleString()}</div>
              <div className="text-xs text-text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {freq.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Top 10 Words</h3>
            <div className="space-y-2">
              {freq.map(([word, count]) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-foreground w-32 truncate">{word}</span>
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="h-2 bg-neon rounded-full transition-all"
                      style={{ width: `${(count / freq[0][1]) * 100}%` }} />
                  </div>
                  <span className="text-sm text-text-secondary w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-text-muted">✓ Real-time. ✓ Nothing sent to servers. ✓ Free.</p>
      </div>
    </ToolLayout>
  );
}
