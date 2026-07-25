import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Download } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free PDF Watermark Tool Online",
  "description": "Add a custom text watermark to any PDF file online for free. No upload to server.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/pdf-watermark",
});

export const Route = createFileRoute("/tools/pdf-watermark")({
  head: () => ({
    meta: [
      { title: "Free PDF Watermark Tool Online — Add Watermark to PDF | ESYSTEMLK Tools" },
      { name: "description", content: "Add a custom text watermark to any PDF online for free. Set text, opacity, angle and colour. No upload to server — runs entirely in your browser." },
      { name: "keywords", content: "pdf watermark online free, add watermark to pdf, pdf watermarker free, watermark pdf browser, add text to pdf free" },
      { property: "og:title", content: "Free PDF Watermark Tool — Add Watermark Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/pdf-watermark" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/pdf-watermark" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["pdf-watermark"].faq) },
    ],
  }),
  component: PdfWatermarkPage,
});

function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#ff0000");
  const [fontSize, setFontSize] = useState(60);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const apply = async () => {
    if (!file || !text) return;
    setLoading(true);
    setDone(false);
    try {
      const { PDFDocument, rgb, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      // Parse hex color
      const hex = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - (text.length * fontSize * 0.3),
          y: height / 2,
          size: fontSize,
          color: rgb(r, g, b),
          opacity: opacity / 100,
          rotate: degrees(angle),
        });
      }

      const out = await pdfDoc.save();
      setResultBytes(out);
      setDone(true);
    } catch (e) {
      alert("Failed to process PDF. Make sure the file is not password-protected.");
    }
    setLoading(false);
  };

  const download = () => {
    if (!resultBytes) return;
    const blob = new Blob([resultBytes], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `watermarked-${file?.name ?? "document.pdf"}`;
    a.click();
  };

  return (
    <ToolLayout
      title="PDF Watermark"
      description="Add a custom text watermark to every page of your PDF. Runs in your browser — nothing is uploaded."
      article={<ToolArticle title="PDF Watermark" data={TOOL_ARTICLES["pdf-watermark"]} />}
    >
      <div className="space-y-6">
        <UploadArea label="Click or drop a PDF file" accept=".pdf" onChange={(f) => { setFile(f); setDone(false); setResultBytes(null); }} file={file} />

        {file && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Watermark Text</label>
                <input value={text} onChange={(e) => setText(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Font Size: <strong>{fontSize}pt</strong></label>
                <input type="range" min={20} max={120} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-neon mt-2" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Opacity: <strong>{opacity}%</strong></label>
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-neon mt-2" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Rotation: <strong>{angle}°</strong></label>
                <input type="range" min={0} max={90} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full accent-neon mt-2" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border cursor-pointer p-1" />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <ToolBtn onClick={apply} disabled={loading || !text}>
                {loading ? "Processing…" : "Apply Watermark"}
              </ToolBtn>
              {done && (
                <ToolBtn variant="outline" onClick={download}>
                  <Download className="w-4 h-4" /> Download PDF
                </ToolBtn>
              )}
              {done && <span className="text-sm text-green-600 font-medium">✓ Watermark applied!</span>}
            </div>
          </>
        )}
        <p className="text-xs text-text-muted">✓ PDF never leaves your device. ✓ Free, no account needed.</p>
      </div>
    </ToolLayout>
  );
}
