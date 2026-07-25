import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Download } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Image Resizer Online",
  "description": "Resize images to exact pixel dimensions online for free. Maintain aspect ratio or set custom size.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/image-resizer",
});

export const Route = createFileRoute("/tools/image-resizer")({
  head: () => ({
    meta: [
      { title: "Free Image Resizer Online — Resize Images to Any Size | ESYSTEMLK Tools" },
      { name: "description", content: "Resize images to exact pixel dimensions online for free. Maintain aspect ratio or set custom width and height. No upload — runs in your browser." },
      { name: "keywords", content: "image resizer online free, resize image online, change image size, resize photo online, image dimensions changer free" },
      { property: "og:title", content: "Free Image Resizer — Resize to Any Size Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/image-resizer" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/image-resizer" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["image-resizer"].faq) },
    ],
  }),
  component: ImageResizerPage,
});

function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState("");

  const onFile = useCallback((f: File) => {
    setFile(f);
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      setOrigW(img.naturalWidth); setOrigH(img.naturalHeight);
      setW(img.naturalWidth); setH(img.naturalHeight);
    };
    img.src = url;
    setPreview(url);
    setResult("");
  }, []);

  const onW = (v: number) => {
    setW(v);
    if (lock && origW) setH(Math.round(v * origH / origW));
  };
  const onH = (v: number) => {
    setH(v);
    if (lock && origH) setW(Math.round(v * origW / origH));
  };

  const resize = () => {
    if (!file || !preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      setResult(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result;
    a.download = `resized-${w}x${h}.png`;
    a.click();
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize any image to exact pixel dimensions. Optionally lock aspect ratio."
      article={<ToolArticle title="Image Resizer" data={TOOL_ARTICLES["image-resizer"]} />}
    >
      <div className="space-y-6">
        <UploadArea label="Click or drop an image" accept="image/*" onChange={onFile} file={file} />
        {file && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Width (px)</label>
                <input type="number" value={w} min={1} onChange={(e) => onW(+e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Height (px)</label>
                <input type="number" value={h} min={1} onChange={(e) => onH(+e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="accent-neon" />
              Lock aspect ratio (original: {origW}×{origH})
            </label>
            <div className="flex gap-3 flex-wrap">
              <ToolBtn onClick={resize} disabled={!w || !h}>Resize Image</ToolBtn>
              {result && <ToolBtn variant="outline" onClick={download}><Download className="w-4 h-4" /> Download PNG</ToolBtn>}
            </div>
            {result && (
              <div>
                <p className="text-xs text-text-muted mb-2">Preview ({w}×{h})</p>
                <img src={result} alt="resized" className="max-w-full max-h-72 rounded-xl border border-border object-contain" />
              </div>
            )}
          </>
        )}
        <p className="text-xs text-text-muted">✓ No upload — processed in your browser. ✓ Free.</p>
      </div>
    </ToolLayout>
  );
}
