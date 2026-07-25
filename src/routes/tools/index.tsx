import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";
import {
  Crop, FileImage, Minimize2, FileText, Lock, QrCode,
  KeyRound, Code2, AlignLeft, Hash, ArrowRight,
  Braces, Link2, Fingerprint, Clock,
  CaseSensitive, Pilcrow, Link, GitCompare,
  Percent, Cake, Scale, Landmark,
  Pipette, Blend, Palette, Contrast,
} from "lucide-react";

const TOOLS = [
  {
    icon: Crop, title: "Image Cropper", slug: "image-cropper",
    desc: "Crop images freely or into a perfect circle. Download as PNG.",
    tags: ["Image", "Free"],
  },
  {
    icon: Minimize2, title: "Image Compressor", slug: "image-compressor",
    desc: "Reduce image file size without losing quality.",
    tags: ["Image", "Free"],
  },
  {
    icon: FileImage, title: "Image Resizer", slug: "image-resizer",
    desc: "Resize any image to exact pixel dimensions.",
    tags: ["Image", "Free"],
  },
  {
    icon: FileText, title: "PDF Watermark", slug: "pdf-watermark",
    desc: "Add a custom text watermark to any PDF file.",
    tags: ["PDF", "Free"],
  },
  {
    icon: Lock, title: "File Encrypt / Decrypt", slug: "file-encrypt",
    desc: "AES-256 encrypt or decrypt any file with a password. Works offline.",
    tags: ["Security", "Free"],
  },
  {
    icon: QrCode, title: "QR Code Generator", slug: "qr-generator",
    desc: "Generate a QR code for any URL or text. Download as PNG.",
    tags: ["Utility", "Free"],
  },
  {
    icon: KeyRound, title: "Password Generator", slug: "password-generator",
    desc: "Generate strong, secure random passwords instantly.",
    tags: ["Security", "Free"],
  },
  {
    icon: Code2, title: "Base64 Encoder / Decoder", slug: "base64",
    desc: "Encode text or files to Base64, or decode Base64 back.",
    tags: ["Developer", "Free"],
  },
  {
    icon: AlignLeft, title: "Word Counter", slug: "word-counter",
    desc: "Count words, characters, sentences and reading time.",
    tags: ["Writing", "Free"],
  },
  {
    icon: Hash, title: "Hash Generator", slug: "hash-generator",
    desc: "Generate SHA-256 or SHA-512 hash of any text or file.",
    tags: ["Security", "Developer", "Free"],
  },
  {
    icon: Braces, title: "JSON Formatter / Validator", slug: "json-formatter",
    desc: "Beautify, minify and validate JSON. Find syntax errors instantly.",
    tags: ["Developer", "Free"],
  },
  {
    icon: Link2, title: "URL Encoder / Decoder", slug: "url-encoder",
    desc: "Percent-encode or decode URLs and query-string values.",
    tags: ["Developer", "Free"],
  },
  {
    icon: Fingerprint, title: "UUID Generator", slug: "uuid-generator",
    desc: "Generate secure random v4 UUIDs, one or many at a time.",
    tags: ["Developer", "Free"],
  },
  {
    icon: Clock, title: "Unix Timestamp Converter", slug: "timestamp-converter",
    desc: "Convert Unix timestamps to dates and back, in seconds or ms.",
    tags: ["Developer", "Free"],
  },
  {
    icon: CaseSensitive, title: "Case Converter", slug: "case-converter",
    desc: "Convert text to UPPER, lower, Title, camelCase, snake_case and more.",
    tags: ["Writing", "Free"],
  },
  {
    icon: Pilcrow, title: "Lorem Ipsum Generator", slug: "lorem-ipsum",
    desc: "Generate placeholder text by paragraphs, sentences or words.",
    tags: ["Writing", "Design", "Free"],
  },
  {
    icon: Link, title: "URL Slug Generator", slug: "slug-generator",
    desc: "Turn any title into a clean, SEO-friendly URL slug.",
    tags: ["Writing", "Developer", "Free"],
  },
  {
    icon: GitCompare, title: "Text Diff Checker", slug: "text-diff",
    desc: "Compare two texts and highlight what was added or removed.",
    tags: ["Writing", "Developer", "Free"],
  },
  {
    icon: Percent, title: "Percentage Calculator", slug: "percentage-calculator",
    desc: "Percentage of a number, percent change and more — calculated live.",
    tags: ["Calculator", "Free"],
  },
  {
    icon: Cake, title: "Age Calculator", slug: "age-calculator",
    desc: "Exact age in years, months and days, plus total days lived.",
    tags: ["Calculator", "Free"],
  },
  {
    icon: Scale, title: "BMI Calculator", slug: "bmi-calculator",
    desc: "Body Mass Index in metric or imperial units, with category.",
    tags: ["Calculator", "Health", "Free"],
  },
  {
    icon: Landmark, title: "Loan / EMI Calculator", slug: "loan-calculator",
    desc: "Monthly repayment, total interest and total cost of a loan.",
    tags: ["Calculator", "Finance", "Free"],
  },
  {
    icon: Pipette, title: "Color Converter", slug: "color-converter",
    desc: "Convert colors between HEX, RGB and HSL, and pick visually.",
    tags: ["Design", "Developer", "Free"],
  },
  {
    icon: Blend, title: "CSS Gradient Generator", slug: "gradient-generator",
    desc: "Design a linear gradient and copy the ready-to-use CSS.",
    tags: ["Design", "Developer", "Free"],
  },
  {
    icon: Palette, title: "Color Palette Generator", slug: "color-palette",
    desc: "Generate a harmonious palette from a base color.",
    tags: ["Design", "Free"],
  },
  {
    icon: Contrast, title: "Color Contrast Checker", slug: "contrast-checker",
    desc: "Check text/background contrast against WCAG AA and AAA.",
    tags: ["Design", "Accessibility", "Free"],
  },
];

const LD_TOOLS = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Online Tools by ESYSTEMLK",
  "description": "Free browser-based tools for images, PDFs, security, and productivity.",
  "url": "https://www.esystemlk.com/tools",
  "itemListElement": TOOLS.map((t, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": t.title,
    "url": `https://www.esystemlk.com/tools/${t.slug}`,
  })),
});

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Free Online Tools — ESYSTEMLK | Image, PDF & Security Tools" },
      { name: "description", content: "Free browser-based tools by ESYSTEMLK: crop images, compress images, add PDF watermarks, encrypt files, generate QR codes, passwords and more. No upload, 100% private." },
      { name: "keywords", content: "free online tools, image cropper online, image compressor, PDF watermark, file encryptor, QR code generator, password generator, base64 encoder, word counter, hash generator, free tools Sri Lanka" },
      { property: "og:title", content: "Free Online Tools — ESYSTEMLK" },
      { property: "og:description", content: "Free browser-based tools for images, PDFs, security & productivity. No signup, no upload limits, 100% private." },
      { property: "og:url", content: "https://www.esystemlk.com/tools" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools" }],
    scripts: [{ type: "application/ld+json", children: LD_TOOLS }],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f0f9ff] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest mb-4">
              Free Tools
            </span>
            <h1 className="font-display font-black text-4xl lg:text-5xl tracking-tight text-foreground">
              Tools that actually{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#00bfff,#0077ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                save you time
              </span>
            </h1>
            <p className="mt-4 text-text-secondary max-w-xl mx-auto">
              All tools run in your browser — nothing is uploaded to any server.
              Free, private, no account needed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <a
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="card-neon rounded-2xl p-6 flex flex-col group hover:-translate-y-1 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,191,255,0.15)]"
                >
                  <span className="icon-circle">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h2 className="mt-4 font-display font-bold text-foreground group-hover:text-neon transition">
                    {t.title}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed flex-1">
                    {t.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-blue text-neon font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-neon text-sm font-semibold">
                    Open tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
