import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { Download } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Online Image Cropper",
  "description": "Crop images to any shape — rectangle or perfect circle. Free, no upload, works in browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/image-cropper",
});

export const Route = createFileRoute("/tools/image-cropper")({
  head: () => ({
    meta: [
      { title: "Free Image Cropper Online — Crop & Round Crop | ESYSTEMLK Tools" },
      { name: "description", content: "Free online image cropper — crop images to any size or create perfect circular crops. No upload, works in your browser. Download as PNG instantly." },
      { name: "keywords", content: "image cropper online free, crop image online, round image crop, circle crop image, crop photo online, free image crop tool" },
      { property: "og:title", content: "Free Image Cropper — Crop & Circle Crop Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/image-cropper" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/image-cropper" }],
    scripts: [{ type: "application/ld+json", children: LD }],
  }),
  component: ImageCropperPage,
});

function centerAspectCrop(w: number, h: number) {
  return centerCrop(makeAspectCrop({ unit: "%", width: 80 }, 1, w, h), w, h);
}

function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [mode, setMode] = useState<"rect" | "round">("rect");
  const imgRef = useRef<HTMLImageElement>(null);

  const onFile = useCallback((f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(f);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  };

  const download = () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d")!;

    if (mode === "round") {
      const r = Math.min(canvas.width, canvas.height) / 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.clip();
    }

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height,
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `cropped-${mode}.png`;
      a.click();
    }, "image/png");
  };

  return (
    <ToolLayout
      title="Image Cropper"
      description="Crop images to any size, or make a perfect circular crop. Works entirely in your browser."
    >
      <div className="space-y-6">
        {/* Mode selector */}
        <div className="flex gap-3">
          {(["rect", "round"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                mode === m
                  ? "bg-neon text-white border-neon"
                  : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}
            >
              {m === "rect" ? "Rectangle Crop" : "⭕ Round / Circle Crop"}
            </button>
          ))}
        </div>

        {!imgSrc && <UploadArea label="Click or drop an image here" accept="image/*" onChange={onFile} file={file} />}

        {imgSrc && (
          <div className="space-y-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={mode === "round" ? 1 : undefined}
              circularCrop={mode === "round"}
              className="max-w-full rounded-xl overflow-hidden"
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="To crop"
                onLoad={onImageLoad}
                className="max-w-full max-h-[500px] object-contain"
              />
            </ReactCrop>
            <div className="flex gap-3 flex-wrap">
              <ToolBtn onClick={download} disabled={!completedCrop?.width}>
                <Download className="w-4 h-4" /> Download Cropped PNG
              </ToolBtn>
              <ToolBtn variant="outline" onClick={() => { setImgSrc(""); setFile(null); }}>
                Change Image
              </ToolBtn>
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted">
          ✓ No upload — image never leaves your device. ✓ Free, no account needed.
        </p>
      </div>
    </ToolLayout>
  );
}
