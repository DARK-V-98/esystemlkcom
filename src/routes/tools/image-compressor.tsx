import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { Download } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Image Compressor Online",
  "description": "Compress and reduce image file size online for free. No upload needed — runs in your browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/image-compressor",
});

export const Route = createFileRoute("/tools/image-compressor")({
  head: () => ({
    meta: [
      { title: "Free Image Compressor Online — Reduce Image Size | ESYSTEMLK Tools" },
      { name: "description", content: "Compress and reduce image file size online for free. Adjust quality slider, preview before downloading. Works in browser — your images are never uploaded." },
      { name: "keywords", content: "image compressor online free, reduce image size, compress photo online, image size reducer, jpg compressor, png compressor free" },
      { property: "og:title", content: "Free Image Compressor — Reduce File Size Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/image-compressor" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/image-compressor" }],
    scripts: [{ type: "application/ld+json", children: LD }],
  }),
  component: ImageCompressorPage,
});

function fmt(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [preview, setPreview] = useState("");
  const [compressed, setCompressed] = useState<{ blob: Blob; url: string } | null>(null);

  const onFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setCompressed(null);
  }, []);

  const compress = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressed({ blob, url: URL.createObjectURL(blob) });
        },
        "image/jpeg",
        quality / 100,
      );
    };
    img.src = preview;
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement("a");
    a.href = compressed.url;
    a.download = `compressed-${file?.name ?? "image"}.jpg`;
    a.click();
  };

  const saved = file && compressed ? Math.round((1 - compressed.blob.size / file.size) * 100) : 0;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size by adjusting quality. Preview the result before downloading."
    >
      <div className="space-y-6">
        <UploadArea label="Click or drop an image (JPG, PNG, WebP)" accept="image/*" onChange={onFile} file={file} />

        {file && (
          <>
            <div>
              <div className="flex justify-between text-sm text-text-secondary mb-2">
                <span>Quality: <strong className="text-foreground">{quality}%</strong></span>
                <span className="text-text-muted">Lower = smaller file</span>
              </div>
              <input
                type="range" min={10} max={100} value={quality}
                onChange={(e) => { setQuality(+e.target.value); setCompressed(null); }}
                className="w-full accent-neon"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-bg-blue/40 rounded-xl p-4">
                <div className="text-text-muted mb-1">Original size</div>
                <div className="font-semibold text-foreground text-lg">{fmt(file.size)}</div>
              </div>
              {compressed && (
                <div className="bg-bg-blue/40 rounded-xl p-4 border border-neon/30">
                  <div className="text-text-muted mb-1">Compressed size</div>
                  <div className="font-semibold text-neon text-lg">{fmt(compressed.blob.size)}</div>
                  {saved > 0 && <div className="text-xs text-green-600 mt-1">Saved {saved}%</div>}
                </div>
              )}
            </div>

            {compressed && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-2">Original</p>
                  <img src={preview} alt="original" className="rounded-lg w-full object-contain max-h-48 border border-border" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-2">Compressed</p>
                  <img src={compressed.url} alt="compressed" className="rounded-lg w-full object-contain max-h-48 border border-neon/30" />
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <ToolBtn onClick={compress}>Compress Image</ToolBtn>
              {compressed && (
                <ToolBtn variant="outline" onClick={download}>
                  <Download className="w-4 h-4" /> Download
                </ToolBtn>
              )}
            </div>
          </>
        )}
        <p className="text-xs text-text-muted">✓ No upload — processed in your browser. ✓ Free.</p>
      </div>
    </ToolLayout>
  );
}
