import type { ReactNode } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";

/** MIRRA brand colours (the app's red / white / black theme). */
export const MIRRA_RED = "#E10600";

export async function mirraApi<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/mirra/${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: opts.body ? { "content-type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
  return data as T;
}

export function MirraMark({ size = 40 }: { size?: number }) {
  return <img src="/mirra/icon.png" alt="MIRRA" width={size} height={size} className="rounded-xl" />;
}

export function MirraWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black tracking-[0.18em] ${className}`}>
      MIRR<span style={{ color: MIRRA_RED }}>A</span>
    </span>
  );
}

export function MirraShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export function MirraButton({ children, href, onClick, variant = "red", disabled, type = "button", className = "" }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: "red" | "dark" | "ghost" | "light";
  disabled?: boolean; type?: "button" | "submit"; className?: string;
}) {
  const styles = {
    red: "bg-[#E10600] text-white hover:bg-[#c10500] shadow-[0_8px_30px_rgba(225,6,0,0.35)]",
    dark: "bg-[#0b0b0d] text-white hover:bg-black",
    light: "bg-white text-[#0b0b0d] hover:bg-white/90",
    ghost: "border border-current/25 hover:bg-current/5",
  }[variant];
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none ${styles} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export const inputCls =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#E10600] focus:ring-2 focus:ring-[#E10600]/15";

export const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  awaiting_payment: { text: "Waiting for payment", cls: "bg-amber-100 text-amber-800" },
  pending_review: { text: "Checking your slip", cls: "bg-blue-100 text-blue-800" },
  paid: { text: "Paid", cls: "bg-green-100 text-green-800" },
  rejected: { text: "Payment not confirmed", cls: "bg-red-100 text-red-800" },
};

export function StatusPill({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { text: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.text}</span>;
}

/** Reads a File as base64 (without the data: prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(new Error("Couldn't read the file."));
    r.readAsDataURL(file);
  });
}

/** Sends the browser to PayHere's checkout with the signed fields from the server. */
export function goToPayHere(ph: { action: string; fields: Record<string, string> }) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = ph.action;
  for (const [k, v] of Object.entries(ph.fields)) {
    const input = document.createElement("input");
    input.type = "hidden"; input.name = k; input.value = v;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
