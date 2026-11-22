import { Fragment, useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, CreditCard, Download, Loader2, Upload, Clock, AlertTriangle, PartyPopper } from "lucide-react";
import { lkr } from "@/data/mirra";
import { MirraShell, MirraButton, StatusPill, fileToBase64, mirraApi, goToPayHere } from "@/components/mirra/MirraUi";

export const Route = createFileRoute("/mirra/order")({
  validateSearch: (s: Record<string, unknown>) => ({ id: String(s.id ?? ""), t: String(s.t ?? "") }),
  head: () => ({ meta: [{ title: "Your MIRRA order | ESYSTEMLK" }, { name: "robots", content: "noindex" }] }),
  component: OrderPage,
});

type Order = {
  id: string; planName: string; amount: number; currency: string; name: string; email: string;
  method: string; status: string; hasSlip: boolean; note: string | null; key: string | null; createdAt: string;
  bank: { bankName: string; accountName: string; accountNumber: string; branch: string } | null;
  payhere: { action: string; fields: Record<string, string> } | null;
};

function OrderPage() {
  const { id, t } = Route.useSearch();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => mirraApi<Order>(`order?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}`).then(setOrder).catch((e) => setError(e.message)), [id, t]);

  useEffect(() => { load(); }, [load]);
  // Keep checking while we wait for PayHere's confirmation or for the slip review.
  useEffect(() => {
    if (!order || order.status === "paid") return;
    const timer = setInterval(load, order.status === "awaiting_payment" ? 4000 : 15000);
    return () => clearInterval(timer);
  }, [order, load]);

  return (
    <MirraShell>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {error && <p className="rounded-xl bg-red-50 p-5 text-red-700">{error}</p>}
        {!order && !error && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Loading your order…</p>}
        {order && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Order {order.id}</p>
                <h1 className="font-display text-3xl font-black">{order.planName}</h1>
              </div>
              <StatusPill status={order.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{lkr(order.amount)} · {order.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Bookmark this page — it's how you get back to your order.</p>

            <div className="mt-8">
              {order.status === "paid" && order.key && <Paid keyText={order.key} />}
              {order.status === "pending_review" && (
                <Box icon={<Clock className="text-blue-600" />} title="We're checking your bank slip">
                  We usually confirm within a few hours (9am–9pm). Your key will appear here and be emailed to {order.email}. You can close this page.
                </Box>
              )}
              {order.status === "rejected" && (
                <Box icon={<AlertTriangle className="text-red-600" />} title="We couldn't confirm your payment">
                  {order.note} Please upload a clearer slip below, or contact us.
                </Box>
              )}
              {order.status !== "paid" && order.status !== "pending_review" && (
                <div className="space-y-6">
                  {order.payhere && (
                    <div className="rounded-2xl border border-border p-6">
                      <h2 className="font-semibold">Pay by card / online</h2>
                      <p className="mt-1 text-sm text-muted-foreground">If you already paid with PayHere, this page updates by itself in a few seconds.</p>
                      <MirraButton className="mt-4" onClick={() => goToPayHere(order.payhere!)}><CreditCard size={18} /> Pay {lkr(order.amount)} with PayHere</MirraButton>
                    </div>
                  )}
                  {order.bank && <BankTransfer order={order} t={t} onDone={setOrder} />}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MirraShell>
  );
}

function Box({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex gap-4 rounded-2xl border border-border p-6">
      <div className="shrink-0">{icon}</div>
      <div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{children}</p></div>
    </div>
  );
}

function Paid({ keyText }: { keyText: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl bg-[#0b0b0d] p-8 text-white">
      <PartyPopper className="text-[#E10600]" />
      <h2 className="mt-3 font-display text-2xl font-black">Your Premium key</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <code className="rounded-lg bg-white/10 px-4 py-3 font-mono text-lg tracking-wider sm:text-xl">{keyText}</code>
        <MirraButton variant="light" onClick={() => { navigator.clipboard.writeText(keyText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Copied" : "Copy"}
        </MirraButton>
      </div>
      <ol className="mt-6 list-decimal space-y-1 pl-5 text-sm text-white/70">
        <li>Install MIRRA if you haven't yet.</li>
        <li>Open MIRRA → <b>Licence</b>.</li>
        <li>Paste the key and click <b>Activate</b>. Premium unlocks straight away.</li>
      </ol>
      <MirraButton href="/api/mirra/download" className="mt-6"><Download size={18} /> Download MIRRA</MirraButton>
    </div>
  );
}

function BankTransfer({ order, t, onDone }: { order: Order; t: string; onDone: (o: Order) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const b = order.bank!;

  async function upload() {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setError("The slip must be smaller than 3 MB. Take a screenshot or a smaller photo."); return; }
    setBusy(true); setError("");
    try {
      const data = await fileToBase64(file);
      onDone(await mirraApi<Order>("order/slip", { body: { id: order.id, t, name: file.name, type: file.type, data } }));
    } catch (e: any) { setError(e.message); }
    setBusy(false);
  }

  const rows = [["Bank", b.bankName], ["Account name", b.accountName], ["Account number", b.accountNumber], ["Branch", b.branch], ["Amount", lkr(order.amount)], ["Reference", order.id]].filter(([, v]) => v);
  return (
    <div className="rounded-2xl border border-border p-6">
      <h2 className="font-semibold">Pay by bank transfer</h2>
      <p className="mt-1 text-sm text-muted-foreground">Transfer the exact amount and write <b>{order.id}</b> as the reference. Then upload a photo or screenshot of the slip.</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl bg-secondary/60 p-4 text-sm">
        {rows.map(([k, v]) => (<Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></Fragment>))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-dashed border-border px-4 py-3 text-sm hover:border-[#E10600]">
          <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file ? file.name : "Choose slip (JPG, PNG or PDF)"}
        </label>
        <MirraButton onClick={upload} disabled={!file || busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Upload slip</MirraButton>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
