import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";

export function ToolLayout({
  title,
  description,
  children,
  article,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  /** Optional long-form content rendered below the tool (SEO / AdSense value). */
  article?: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-neon transition mb-5"
            >
              <ArrowLeft className="w-4 h-4" /> All Tools
            </a>
            <h1 className="font-display font-black text-3xl lg:text-4xl text-foreground tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-text-secondary max-w-2xl">{description}</p>
          </div>
          <div className="card-neon rounded-2xl p-6 lg:p-8">{children}</div>
          {article}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function ToolBtn({
  onClick,
  disabled,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const base = "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed";
  const cls =
    variant === "primary"
      ? `${base} btn-primary`
      : `${base} btn-outline-neon`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function UploadArea({
  label,
  accept,
  onChange,
  file,
}: {
  label: string;
  accept: string;
  onChange: (f: File) => void;
  file?: File | null;
}) {
  return (
    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-neon/40 rounded-xl cursor-pointer bg-bg-blue/30 hover:border-neon/70 transition">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
      <div className="text-neon text-3xl mb-2">↑</div>
      {file ? (
        <span className="text-sm text-foreground font-medium">{file.name}</span>
      ) : (
        <span className="text-sm text-text-secondary">{label}</span>
      )}
    </label>
  );
}
