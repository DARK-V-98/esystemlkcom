import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Text Diff Checker Online",
  "description": "Compare two blocks of text and highlight what was added or removed. Free, runs in your browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/text-diff",
});

export const Route = createFileRoute("/tools/text-diff")({
  head: () => ({
    meta: [
      { title: "Free Text Diff Checker — Compare Two Texts Online | ESYSTEMLK Tools" },
      { name: "description", content: "Compare two blocks of text and instantly highlight the differences — additions and deletions, word by word. Free online diff tool that runs entirely in your browser." },
      { name: "keywords", content: "text diff checker, compare text online, diff tool, text comparison, find differences between texts, online diff checker, compare two texts" },
      { property: "og:title", content: "Free Text Diff Checker Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/text-diff" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/text-diff" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["text-diff"].faq) },
    ],
  }),
  component: TextDiffPage,
});

type Part = { type: "same" | "added" | "removed"; value: string };

// Word-level diff using a longest-common-subsequence table.
function diffWords(a: string, b: string): Part[] {
  const aw = a.match(/\S+|\s+/g) ?? [];
  const bw = b.match(/\S+|\s+/g) ?? [];
  const m = aw.length, n = bw.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = aw[i] === bw[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: Part[] = [];
  let i = 0, j = 0;
  const push = (type: Part["type"], value: string) => {
    const last = parts[parts.length - 1];
    if (last && last.type === type) last.value += value;
    else parts.push({ type, value });
  };
  while (i < m && j < n) {
    if (aw[i] === bw[j]) { push("same", aw[i]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { push("removed", aw[i]); i++; }
    else { push("added", bw[j]); j++; }
  }
  while (i < m) { push("removed", aw[i]); i++; }
  while (j < n) { push("added", bw[j]); j++; }
  return parts;
}

function TextDiffPage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [parts, setParts] = useState<Part[] | null>(null);

  const compare = () => setParts(diffWords(left, right));

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two blocks of text and highlight what was added or removed. Runs in your browser."
      article={<ToolArticle title="Text Diff Checker" data={TOOL_ARTICLES["text-diff"]} />}
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Original</label>
            <textarea
              value={left} onChange={(e) => setLeft(e.target.value)}
              placeholder="Paste the original text…" rows={8}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Changed</label>
            <textarea
              value={right} onChange={(e) => setRight(e.target.value)}
              placeholder="Paste the changed text…" rows={8}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon resize-y"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <ToolBtn onClick={compare} disabled={!left && !right}>Compare</ToolBtn>
          {parts && (
            <div className="flex gap-4 text-xs text-text-muted ml-auto">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block" /> Added</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 inline-block" /> Removed</span>
            </div>
          )}
        </div>

        {parts && (
          <div className="w-full border border-neon/30 rounded-lg px-4 py-3 text-sm bg-white whitespace-pre-wrap leading-relaxed break-words">
            {parts.length === 0 || parts.every((p) => p.type === "same" && p.value.trim() === "") ? (
              <span className="text-text-muted">No text to compare.</span>
            ) : (
              parts.map((p, i) =>
                p.type === "same" ? (
                  <span key={i}>{p.value}</span>
                ) : p.type === "added" ? (
                  <span key={i} className="bg-green-200/70 text-green-900 rounded px-0.5">{p.value}</span>
                ) : (
                  <span key={i} className="bg-red-200/70 text-red-900 line-through rounded px-0.5">{p.value}</span>
                )
              )
            )}
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Comparison runs in your browser. ✓ Nothing uploaded — safe for private documents.</p>
      </div>
    </ToolLayout>
  );
}
