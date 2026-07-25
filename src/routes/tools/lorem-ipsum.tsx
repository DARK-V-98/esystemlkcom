import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy, RefreshCw } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Lorem Ipsum Generator Online",
  "description": "Generate Lorem Ipsum placeholder text by paragraphs, sentences or words. Free, in browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/lorem-ipsum",
});

export const Route = createFileRoute("/tools/lorem-ipsum")({
  head: () => ({
    meta: [
      { title: "Free Lorem Ipsum Generator — Placeholder Text | ESYSTEMLK Tools" },
      { name: "description", content: "Generate Lorem Ipsum placeholder text by paragraphs, sentences or words for your designs and mockups. Free online dummy text generator — runs in your browser." },
      { name: "keywords", content: "lorem ipsum generator, placeholder text generator, dummy text generator, lipsum, filler text, lorem ipsum paragraphs, generate lorem ipsum" },
      { property: "og:title", content: "Free Lorem Ipsum Generator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/lorem-ipsum" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/lorem-ipsum" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["lorem-ipsum"].faq) },
    ],
  }),
  component: LoremIpsumPage,
});

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

const rand = (n: number) => Math.floor(Math.random() * n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function makeSentence() {
  const len = 8 + rand(8);
  const w = Array.from({ length: len }, () => WORDS[rand(WORDS.length)]);
  return cap(w.join(" ")) + ".";
}
function makeParagraph() {
  const len = 3 + rand(4);
  return Array.from({ length: len }, makeSentence).join(" ");
}

function LoremIpsumPage() {
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (unit === "paragraphs") {
      const paras = Array.from({ length: count }, makeParagraph);
      if (classic && paras.length) {
        paras[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + paras[0];
      }
      result = paras.join("\n\n");
    } else if (unit === "sentences") {
      result = Array.from({ length: count }, makeSentence).join(" ");
    } else {
      const w = Array.from({ length: count }, () => WORDS[rand(WORDS.length)]);
      result = cap(w.join(" ")) + ".";
    }
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text by paragraphs, sentences or words for your designs and mockups."
      article={<ToolArticle title="Lorem Ipsum Generator" data={TOOL_ARTICLES["lorem-ipsum"]} />}
    >
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {(["paragraphs", "sentences", "words"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition capitalize ${
                unit === u ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {u}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm text-text-secondary flex items-center gap-2">
            How many
            <input
              type="number" min={1} max={100} value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, +e.target.value)))}
              className="w-20 border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-neon"
            />
          </label>
          {unit === "paragraphs" && (
            <label className="text-sm text-text-secondary flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="accent-neon" />
              Start with "Lorem ipsum…"
            </label>
          )}
          <ToolBtn onClick={generate}><RefreshCw className="w-4 h-4" /> Generate</ToolBtn>
        </div>

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-text-secondary">Result</label>
              <button onClick={copy} className="text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="w-full border border-neon/30 rounded-lg px-4 py-3 text-sm bg-bg-blue/40 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {output}
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted">✓ Generated in your browser. ✓ Free to use anywhere.</p>
      </div>
    </ToolLayout>
  );
}
