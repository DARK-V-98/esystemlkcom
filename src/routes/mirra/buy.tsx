import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Landmark, Loader2, Lock } from "lucide-react";
import { MIRRA_PLANS, lkr, mirraPlan } from "@/data/mirra";
import { MirraShell, MirraButton, inputCls, mirraApi, goToPayHere } from "@/components/mirra/MirraUi";

export const Route = createFileRoute("/mirra/buy")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: typeof s.plan === "string" ? s.plan : "yearly" }),
  head: () => ({
    meta: [{ title: "Buy MIRRA Premium | ESYSTEMLK" }, { name: "robots", content: "noindex" }],
  }),
  component: BuyPage,
});

function BuyPage() {
  const search = Route.useSearch();
  const [plan, setPlan] = useState(mirraPlan(search.plan) ? search.plan : "yearly");
  const [method, setMethod] = useState<"payhere" | "bank">("payhere");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const chosen = mirraPlan(plan)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await mirraApi<any>("order", { body: { plan, method, ...form } });
      if (method === "payhere" && r.order.payhere) goToPayHere(r.order.payhere);
      else window.location.href = r.url;
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <MirraShell>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <form onSubmit={submit} className="space-y-8">
          <div>
            <h1 className="font-display text-3xl font-black">Buy MIRRA Premium</h1>
            <p className="mt-1 text-muted-foreground">Your key is sent to your email and shown on your order page.</p>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold">1. Choose a plan</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {MIRRA_PLANS.map((p) => (
                <label key={p.id} className={`cursor-pointer rounded-xl border p-4 transition ${plan === p.id ? "border-[#E10600] ring-2 ring-[#E10600]/15" : "border-border hover:border-foreground/30"}`}>
                  <input type="radio" name="plan" value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} className="sr-only" />
                  <span className="block font-semibold">{p.name.replace("Premium ", "")}</span>
                  <span className="block font-display text-xl font-black">{lkr(p.price)}</span>
                  <span className="block text-xs text-muted-foreground">{p.days ? `${p.days} days` : "Lifetime"} · {p.devices} PC{p.devices > 1 ? "s" : ""}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-semibold">2. Your details</legend>
            <input className={inputCls} placeholder="Full name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            <input className={inputCls} placeholder="Email (your key is sent here)" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            <input className={inputCls} placeholder="Mobile number (optional)" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold">3. How do you want to pay?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { id: "payhere", icon: CreditCard, title: "Card / online", body: "Visa, Mastercard, Amex, eZ Cash, mCash via PayHere. Key appears instantly." },
                { id: "bank", icon: Landmark, title: "Bank transfer", body: "Transfer to our account and upload the slip. Key sent after we check it." },
              ] as const).map(({ id, icon: Icon, title, body }) => (
                <label key={id} className={`cursor-pointer rounded-xl border p-4 transition ${method === id ? "border-[#E10600] ring-2 ring-[#E10600]/15" : "border-border hover:border-foreground/30"}`}>
                  <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="sr-only" />
                  <Icon size={20} className="text-[#E10600]" />
                  <span className="mt-2 block font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{body}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <MirraButton type="submit" disabled={busy} className="w-full sm:w-auto">
            {busy ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {method === "payhere" ? `Pay ${lkr(chosen.price)}` : "Continue to bank details"}
          </MirraButton>
          <p className="text-xs text-muted-foreground">By buying you agree to our <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/refund-policy">Refund Policy</a>.</p>
        </form>

        <aside className="h-fit rounded-2xl bg-[#0b0b0d] p-6 text-white">
          <p className="text-sm text-white/60">Order summary</p>
          <p className="mt-2 font-display text-xl font-bold">{chosen.name}</p>
          <p className="text-sm text-white/60">{chosen.days ? `${chosen.days} days from activation` : "Never expires"} · {chosen.devices} PC{chosen.devices > 1 ? "s" : ""}</p>
          <div className="my-5 h-px bg-white/10" />
          <div className="flex items-baseline justify-between"><span>Total</span><span className="font-display text-3xl font-black">{lkr(chosen.price)}</span></div>
        </aside>
      </div>
    </MirraShell>
  );
}
