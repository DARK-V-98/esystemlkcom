import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";

// Inlined react-image-crop CSS to avoid Rollup CSS resolution issues on Vercel
const CROP_CSS = `@keyframes marching-ants{0%{background-position:0 0,0 100%,0 0,100% 0}to{background-position:20px 0,-20px 100%,0 -20px,100% 20px}}:root{--rc-drag-handle-size: 12px;--rc-drag-handle-mobile-size: 24px;--rc-drag-handle-bg-colour: rgba(0, 0, 0, .2);--rc-drag-bar-size: 6px;--rc-border-color: rgba(255, 255, 255, .7);--rc-focus-color: #0088ff}.ReactCrop{position:relative;display:inline-block;cursor:crosshair;max-width:100%}.ReactCrop *,.ReactCrop *:before,.ReactCrop *:after{box-sizing:border-box}.ReactCrop--disabled,.ReactCrop--locked{cursor:inherit}.ReactCrop__child-wrapper{overflow:hidden;max-height:inherit}.ReactCrop__child-wrapper>img,.ReactCrop__child-wrapper>video{display:block;max-width:100%;max-height:inherit}.ReactCrop:not(.ReactCrop--disabled) .ReactCrop__child-wrapper>img,.ReactCrop:not(.ReactCrop--disabled) .ReactCrop__child-wrapper>video{touch-action:none}.ReactCrop:not(.ReactCrop--disabled) .ReactCrop__crop-selection{touch-action:none}.ReactCrop__crop-mask{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;width:calc(100% + .5px);height:calc(100% + .5px)}.ReactCrop__crop-selection{position:absolute;top:0;left:0;transform:translateZ(0);cursor:move}.ReactCrop--disabled .ReactCrop__crop-selection{cursor:inherit}.ReactCrop--circular-crop .ReactCrop__crop-selection{border-radius:50%}.ReactCrop--circular-crop .ReactCrop__crop-selection:after{pointer-events:none;content:"";position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;border:1px solid var(--rc-border-color);opacity:.3}.ReactCrop--no-animate .ReactCrop__crop-selection{outline:1px dashed white}.ReactCrop__crop-selection:not(.ReactCrop--no-animate .ReactCrop__crop-selection){animation:marching-ants 1s;background-image:linear-gradient(to right,#fff 50%,#444 50%),linear-gradient(to right,#fff 50%,#444 50%),linear-gradient(to bottom,#fff 50%,#444 50%),linear-gradient(to bottom,#fff 50%,#444 50%);background-size:10px 1px,10px 1px,1px 10px,1px 10px;background-position:0 0,0 100%,0 0,100% 0;background-repeat:repeat-x,repeat-x,repeat-y,repeat-y;color:#fff;animation-play-state:running;animation-timing-function:linear;animation-iteration-count:infinite}.ReactCrop__crop-selection:focus{outline:2px solid var(--rc-focus-color);outline-offset:-1px}.ReactCrop--invisible-crop .ReactCrop__crop-mask,.ReactCrop--invisible-crop .ReactCrop__crop-selection{display:none}.ReactCrop__rule-of-thirds-vt:before,.ReactCrop__rule-of-thirds-vt:after,.ReactCrop__rule-of-thirds-hz:before,.ReactCrop__rule-of-thirds-hz:after{content:"";display:block;position:absolute;background-color:#fff6}.ReactCrop__rule-of-thirds-vt:before,.ReactCrop__rule-of-thirds-vt:after{width:1px;height:100%}.ReactCrop__rule-of-thirds-vt:before{left:33.3333333333%}.ReactCrop__rule-of-thirds-vt:after{left:66.6666666667%}.ReactCrop__rule-of-thirds-hz:before,.ReactCrop__rule-of-thirds-hz:after{width:100%;height:1px}.ReactCrop__rule-of-thirds-hz:before{top:33.3333333333%}.ReactCrop__rule-of-thirds-hz:after{top:66.6666666667%}.ReactCrop__drag-handle{position:absolute;width:var(--rc-drag-handle-size);height:var(--rc-drag-handle-size);background-color:var(--rc-drag-handle-bg-colour);border:1px solid var(--rc-border-color)}.ReactCrop__drag-handle:focus{background:var(--rc-focus-color)}.ReactCrop .ord-nw{top:0;left:0;transform:translate(-50%,-50%);cursor:nw-resize}.ReactCrop .ord-n{top:0;left:50%;transform:translate(-50%,-50%);cursor:n-resize}.ReactCrop .ord-ne{top:0;right:0;transform:translate(50%,-50%);cursor:ne-resize}.ReactCrop .ord-e{top:50%;right:0;transform:translate(50%,-50%);cursor:e-resize}.ReactCrop .ord-se{bottom:0;right:0;transform:translate(50%,50%);cursor:se-resize}.ReactCrop .ord-s{bottom:0;left:50%;transform:translate(-50%,50%);cursor:s-resize}.ReactCrop .ord-sw{bottom:0;left:0;transform:translate(-50%,50%);cursor:sw-resize}.ReactCrop .ord-w{top:50%;left:0;transform:translate(-50%,-50%);cursor:w-resize}.ReactCrop__disabled .ReactCrop__drag-handle{cursor:inherit}.ReactCrop__drag-bar{position:absolute}.ReactCrop__drag-bar.ord-n{top:0;left:0;width:100%;height:var(--rc-drag-bar-size);transform:translateY(-50%)}.ReactCrop__drag-bar.ord-e{right:0;top:0;width:var(--rc-drag-bar-size);height:100%;transform:translate(50%)}.ReactCrop__drag-bar.ord-s{bottom:0;left:0;width:100%;height:var(--rc-drag-bar-size);transform:translateY(50%)}.ReactCrop__drag-bar.ord-w{top:0;left:0;width:var(--rc-drag-bar-size);height:100%;transform:translate(-50%)}.ReactCrop--new-crop .ReactCrop__drag-bar,.ReactCrop--new-crop .ReactCrop__drag-handle,.ReactCrop--fixed-aspect .ReactCrop__drag-bar,.ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-n,.ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-e,.ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-s,.ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-w{display:none}@media (pointer: coarse){.ReactCrop .ord-n,.ReactCrop .ord-e,.ReactCrop .ord-s,.ReactCrop .ord-w{display:none}.ReactCrop__drag-handle{width:var(--rc-drag-handle-mobile-size);height:var(--rc-drag-handle-mobile-size)}}`;
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
      <style dangerouslySetInnerHTML={{ __html: CROP_CSS }} />
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
