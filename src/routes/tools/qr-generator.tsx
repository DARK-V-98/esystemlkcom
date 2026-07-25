import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Download } from "lucide-react";
import QRCode from "qrcode";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free QR Code Generator Online",
  "description": "Generate QR codes for URLs, text, emails, or phone numbers instantly. Free, no signup.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/qr-generator",
});

export const Route = createFileRoute("/tools/qr-generator")({
  head: () => ({
    meta: [
      { title: "Free QR Code Generator Online — Create QR Codes Instantly | ESYSTEMLK Tools" },
      { name: "description", content: "Generate QR codes for URLs, text, emails, phone numbers and more. Free online QR code maker — no signup, no watermark, instant download as PNG." },
      { name: "keywords", content: "qr code generator free, create qr code online, qr code maker, free qr generator, generate qr code for url, qr code creator no signup" },
      { property: "og:title", content: "Free QR Code Generator — No Signup, Instant Download" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/qr-generator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/qr-generator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["qr-generator"].faq) },
    ],
  }),
  component: QrGeneratorPage,
});

function QrGeneratorPage() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const url = await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      setQrUrl(url);
    } catch {
      alert("Failed to generate QR code.");
    }
    setLoading(false);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const PRESETS = [
    { label: "URL", prefix: "https://" },
    { label: "Email", prefix: "mailto:" },
    { label: "Phone", prefix: "tel:+" },
    { label: "SMS", prefix: "sms:+" },
    { label: "WhatsApp", prefix: "https://wa.me/" },
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate a QR code for any URL, text, email or phone number. Download as PNG, no watermark."
      article={<ToolArticle title="QR Code Generator" data={TOOL_ARTICLES["qr-generator"]} />}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setText(p.prefix)}
              className="px-3 py-1 text-xs font-semibold rounded-full border border-border hover:border-neon/60 text-text-secondary transition">
              {p.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-1">Text or URL</label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setQrUrl(""); }}
            placeholder="https://www.esystemlk.com"
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-1">Size: <strong>{size}×{size}px</strong></label>
          <input type="range" min={128} max={512} step={32} value={size}
            onChange={(e) => { setSize(+e.target.value); setQrUrl(""); }}
            className="w-full accent-neon" />
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <ToolBtn onClick={generate} disabled={loading || !text.trim()}>
            {loading ? "Generating…" : "Generate QR Code"}
          </ToolBtn>
          {qrUrl && (
            <ToolBtn variant="outline" onClick={download}>
              <Download className="w-4 h-4" /> Download PNG
            </ToolBtn>
          )}
        </div>

        {qrUrl && (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
              <img src={qrUrl} alt="Generated QR Code" width={size} height={size} className="block" />
            </div>
            <p className="text-xs text-text-muted">Right-click → Save image, or use the download button above.</p>
          </div>
        )}
        <p className="text-xs text-text-muted">✓ Generated locally in your browser. ✓ No data sent to servers.</p>
      </div>
    </ToolLayout>
  );
}
