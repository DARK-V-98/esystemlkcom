import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Copy } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Unix Timestamp Converter Online",
  "description": "Convert Unix timestamps to human dates and back, in seconds or milliseconds. Free, runs in browser.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/timestamp-converter",
});

export const Route = createFileRoute("/tools/timestamp-converter")({
  head: () => ({
    meta: [
      { title: "Free Unix Timestamp Converter Online — Epoch to Date | ESYSTEMLK Tools" },
      { name: "description", content: "Convert Unix / epoch timestamps to human-readable dates and back, in seconds or milliseconds, with UTC and local time. Free — runs entirely in your browser." },
      { name: "keywords", content: "unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time converter, epoch to human date, milliseconds to date" },
      { property: "og:title", content: "Free Unix Timestamp Converter Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/timestamp-converter" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/timestamp-converter" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["timestamp-converter"].faq) },
    ],
  }),
  component: TimestampConverterPage,
});

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function localInputValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function TimestampConverterPage() {
  const now = Math.floor(Date.now() / 1000);
  const [ts, setTs] = useState(String(now));
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [dateStr, setDateStr] = useState(localInputValue(new Date()));
  const [copied, setCopied] = useState("");

  const tsNum = Number(ts);
  const validTs = ts !== "" && !Number.isNaN(tsNum);
  const date = validTs ? new Date(unit === "s" ? tsNum * 1000 : tsNum) : null;

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return unit === "s" ? Math.floor(d.getTime() / 1000) : d.getTime();
  };
  const computedTs = dateToTs();

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const setToNow = () => setTs(String(unit === "s" ? now : Date.now()));

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to readable dates and back. Seconds or milliseconds, UTC and local time."
      article={<ToolArticle title="Unix Timestamp Converter" data={TOOL_ARTICLES["timestamp-converter"]} />}
    >
      <div className="space-y-8">
        <div className="flex gap-3 items-center">
          <span className="text-sm text-text-secondary">Unit:</span>
          {([["s", "Seconds"], ["ms", "Milliseconds"]] as const).map(([u, label]) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                unit === u ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Timestamp -> Date */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground block">Timestamp → Date</label>
          <div className="flex gap-3 flex-wrap items-center">
            <input
              value={ts}
              onChange={(e) => setTs(e.target.value.trim())}
              placeholder="Enter a Unix timestamp…"
              className="flex-1 min-w-[200px] border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon"
            />
            <ToolBtn variant="outline" onClick={setToNow}>Now</ToolBtn>
          </div>
          {date && !Number.isNaN(date.getTime()) ? (
            <div className="bg-bg-blue/40 rounded-xl p-4 space-y-2 text-sm">
              <Row label="Local" value={date.toString()} onCopy={() => copy(date.toString(), "local")} copied={copied === "local"} />
              <Row label="UTC" value={date.toUTCString()} onCopy={() => copy(date.toUTCString(), "utc")} copied={copied === "utc"} />
              <Row label="ISO 8601" value={date.toISOString()} onCopy={() => copy(date.toISOString(), "iso")} copied={copied === "iso"} />
            </div>
          ) : (
            validTs === false && ts !== "" && <p className="text-sm text-red-500">Not a valid number.</p>
          )}
        </div>

        {/* Date -> Timestamp */}
        <div className="space-y-3 border-t border-border pt-6">
          <label className="text-sm font-semibold text-foreground block">Date → Timestamp</label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon"
          />
          {computedTs !== null && (
            <div className="bg-bg-blue/40 rounded-xl p-4">
              <Row
                label={unit === "s" ? "Seconds" : "Milliseconds"}
                value={String(computedTs)}
                onCopy={() => copy(String(computedTs), "computed")}
                copied={copied === "computed"}
              />
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted">✓ All conversions run in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}

function Row({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-bold text-neon uppercase tracking-wide">{label}</span>
      <code className="flex-1 font-mono text-foreground break-all">{value}</code>
      <button onClick={onCopy} className="shrink-0 text-xs text-text-muted hover:text-neon flex items-center gap-1 transition">
        <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
