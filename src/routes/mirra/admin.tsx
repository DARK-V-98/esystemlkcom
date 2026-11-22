import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Download, KeyRound, Loader2, LogOut, RefreshCw, Search, X, Ban, RotateCcw, Undo2, Eye } from "lucide-react";
import { MIRRA_PLANS, lkr, mirraPlan } from "@/data/mirra";
import { MirraMark, MirraWordmark, MirraButton, StatusPill, inputCls, mirraApi } from "@/components/mirra/MirraUi";

export const Route = createFileRoute("/mirra/admin")({
  head: () => ({ meta: [{ title: "MIRRA Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

type Tab = "orders" | "keys" | "generate";

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { mirraApi("admin/me").then(() => setAuthed(true)).catch(() => setAuthed(false)); }, []);
  if (authed === null) return <Center><Loader2 className="animate-spin" /></Center>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#050506] p-4 text-white">{children}</div>;
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Center>
      <form
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0d10] p-8"
        onSubmit={async (e) => {
          e.preventDefault(); setBusy(true); setError("");
          try { await mirraApi("admin/login", { body: { password } }); onDone(); } catch (err: any) { setError(err.message); }
          setBusy(false);
        }}
      >
        <div className="flex items-center gap-3"><MirraMark size={36} /><MirraWordmark className="text-xl" /><span className="text-sm text-white/50">Admin</span></div>
        <input type="password" autoFocus className={`${inputCls} mt-6 text-black`} placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <MirraButton type="submit" disabled={busy || !password} className="mt-4 w-full">{busy && <Loader2 className="animate-spin" size={16} />} Log in</MirraButton>
      </form>
    </Center>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("orders");
  const [stats, setStats] = useState<any>(null);
  const loadStats = useCallback(() => mirraApi("admin/stats").then(setStats).catch(() => {}), []);
  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      <header className="bg-[#050506] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3"><MirraMark size={32} /><MirraWordmark className="text-lg" /><span className="text-sm text-white/50">Key engine</span></div>
          <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white" onClick={async () => { await mirraApi("admin/logout", { body: {} }); onLogout(); }}><LogOut size={16} /> Log out</button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {stats && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {[
              ["Slips to check", stats.pending, stats.pending > 0],
              ["Paid orders", stats.paid],
              ["Revenue", lkr(stats.revenue)],
              ["Last 30 days", lkr(stats.revenue30)],
              ["Active keys", stats.keys],
              ["PCs used (7 days)", `${stats.active7} / ${stats.activations}`],
            ].map(([label, value, hot]) => (
              <div key={String(label)} className={`rounded-xl bg-white p-4 shadow-sm ${hot ? "ring-2 ring-[#E10600]" : ""}`}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-xl font-black">{value}</p>
              </div>
            ))}
          </div>
        )}
        <nav className="mt-8 flex gap-2">
          {([["orders", "Orders"], ["keys", "Keys"], ["generate", "Create keys"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === id ? "bg-[#0b0b0d] text-white" : "bg-white text-foreground hover:bg-white/70"}`}>{label}</button>
          ))}
        </nav>
        <div className="mt-4">
          {tab === "orders" && <Orders onChange={loadStats} />}
          {tab === "keys" && <Keys onChange={loadStats} />}
          {tab === "generate" && <Generate onChange={loadStats} />}
        </div>
      </div>
    </div>
  );
}

function useList(path: string) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => mirraApi<any[]>(path).then((r) => { setRows(r); setError(""); }).catch((e) => setError(e.message)), [path]);
  useEffect(() => { load(); }, [load]);
  return { rows, error, load };
}

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" }) : "—");

function Orders({ onChange }: { onChange: () => void }) {
  const [status, setStatus] = useState("pending_review");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { rows, error, load } = useList(`admin/orders?status=${status}&q=${encodeURIComponent(query)}`);
  const [busy, setBusy] = useState("");

  async function act(path: string, body: any) {
    setBusy(body.id);
    try { await mirraApi(path, { body }); await load(); onChange(); } catch (e: any) { alert(e.message); }
    setBusy("");
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {[["pending_review", "Slips to check"], ["awaiting_payment", "Not paid yet"], ["paid", "Paid"], ["rejected", "Rejected"], ["", "All"]].map(([id, label]) => (
          <button key={id} onClick={() => setStatus(id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === id ? "bg-[#E10600] text-white" : "bg-secondary"}`}>{label}</button>
        ))}
        <form className="ml-auto flex gap-2" onSubmit={(e) => { e.preventDefault(); setQuery(search); }}>
          <input className={`${inputCls} w-56 py-1.5`} placeholder="Order, name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="rounded-lg bg-secondary px-3"><Search size={16} /></button>
          <button type="button" className="rounded-lg bg-secondary px-3" onClick={load}><RefreshCw size={16} /></button>
        </form>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {rows && !rows.length && <p className="py-10 text-center text-sm text-muted-foreground">No orders here.</p>}
      <div className="mt-4 divide-y divide-border">
        {rows?.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-4 py-4">
            <div className="min-w-[220px] flex-1">
              <div className="flex items-center gap-2"><b>{o.id}</b><StatusPill status={o.status} /><span className="text-xs text-muted-foreground">{o.method === "payhere" ? "Card" : "Bank"}</span></div>
              <p className="text-sm">{o.name} · {o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
              <p className="text-xs text-muted-foreground">{mirraPlan(o.plan)?.name ?? o.plan} · {lkr(o.amount)} · {fmt(o.created_at)}</p>
              {o.license_key && <p className="mt-1 font-mono text-xs">{o.license_key}</p>}
              {o.admin_note && <p className="mt-1 text-xs text-red-600">{o.admin_note}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {o.has_slip && <a href={`/api/mirra/admin/slip?id=${o.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-sm"><Eye size={16} /> Slip</a>}
              {o.status !== "paid" && (
                <>
                  <button disabled={busy === o.id} onClick={() => confirm(`Approve ${o.id} and send a ${mirraPlan(o.plan)?.name} key to ${o.email}?`) && act("admin/orders/approve", { id: o.id })} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check size={16} /> Approve</button>
                  <button disabled={busy === o.id} onClick={() => { const note = prompt("Reason (the customer sees this):", "The amount or reference on the slip doesn't match."); if (note) act("admin/orders/reject", { id: o.id, note }); }} className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-sm"><X size={16} /> Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Keys({ onChange }: { onChange: () => void }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { rows, error, load } = useList(`admin/keys?q=${encodeURIComponent(query)}`);

  async function act(path: string, key: string, question: string) {
    if (!confirm(question)) return;
    try { await mirraApi(path, { body: { key } }); await load(); onChange(); } catch (e: any) { alert(e.message); }
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setQuery(search); }}>
          <input className={`${inputCls} w-72 py-1.5`} placeholder="Key, note or customer email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="rounded-lg bg-secondary px-3"><Search size={16} /></button>
        </form>
        <a href="/api/mirra/admin/keys.csv" className="ml-auto inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-sm"><Download size={16} /> Export CSV</a>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr><th className="py-2">Key</th><th>Plan</th><th>PCs</th><th>Expires</th><th>Customer / note</th><th>Last seen</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows?.map((k) => (
              <tr key={k.key} className={k.status !== "active" ? "opacity-50" : ""}>
                <td className="py-2.5 font-mono text-xs">{k.key}{k.status !== "active" && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 font-sans text-red-700">disabled</span>}</td>
                <td>{mirraPlan(k.plan)?.name.replace("Premium ", "") ?? k.plan}</td>
                <td>{k.used} / {k.max_devices}</td>
                <td>{k.activated_at ? (k.expires_at ? fmt(k.expires_at) : "Never") : <span className="text-muted-foreground">Not activated</span>}</td>
                <td className="max-w-[220px] truncate">{k.email || k.note || "—"}</td>
                <td>{fmt(k.last_seen)}</td>
                <td className="whitespace-nowrap text-right">
                  <IconBtn title="Copy key" onClick={() => navigator.clipboard.writeText(k.key)}><Copy size={15} /></IconBtn>
                  {k.used > 0 && <IconBtn title="Remove all PCs (customer can activate again)" onClick={() => act("admin/keys/reset", k.key, `Remove all PCs from ${k.key}? The customer can activate again.`)}><RotateCcw size={15} /></IconBtn>}
                  {k.status === "active"
                    ? <IconBtn title="Disable key" onClick={() => act("admin/keys/revoke", k.key, `Disable ${k.key}? MIRRA goes back to Free on its PCs.`)}><Ban size={15} /></IconBtn>
                    : <IconBtn title="Enable key" onClick={() => act("admin/keys/restore", k.key, `Enable ${k.key} again?`)}><Undo2 size={15} /></IconBtn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows && !rows.length && <p className="py-10 text-center text-sm text-muted-foreground">No keys yet.</p>}
      </div>
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return <button title={title} aria-label={title} onClick={onClick} className="ml-1 rounded-md p-1.5 hover:bg-secondary">{children}</button>;
}

function Generate({ onChange }: { onChange: () => void }) {
  const [form, setForm] = useState({ plan: "yearly", count: 1, note: "", devices: "", days: "" });
  const [keys, setKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const plan = mirraPlan(form.plan)!;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault(); setBusy(true); setError("");
          try {
            const r = await mirraApi<{ keys: string[] }>("admin/keys/generate", { body: { ...form, devices: form.devices || undefined } });
            setKeys(r.keys); onChange();
          } catch (err: any) { setError(err.message); }
          setBusy(false);
        }}
      >
        <h2 className="flex items-center gap-2 font-semibold"><KeyRound size={18} className="text-[#E10600]" /> Create keys</h2>
        <p className="text-sm text-muted-foreground">For cash sales, resellers, giveaways or replacing a key. Keys start counting days when first activated.</p>
        <label className="block text-sm">Plan
          <select className={`${inputCls} mt-1`} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
            {MIRRA_PLANS.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.days ? `${p.days} days` : "lifetime"}, {p.devices} PC</option>)}
          </select>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="block text-sm">How many<input type="number" min={1} max={100} className={`${inputCls} mt-1`} value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} /></label>
          <label className="block text-sm">PCs per key<input type="number" min={1} max={10} placeholder={String(plan.devices)} className={`${inputCls} mt-1`} value={form.devices} onChange={(e) => setForm({ ...form, devices: e.target.value })} /></label>
          <label className="block text-sm">Days<input placeholder={plan.days ? String(plan.days) : "lifetime"} className={`${inputCls} mt-1`} value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} /></label>
        </div>
        <label className="block text-sm">Note (who it's for)<input className={`${inputCls} mt-1`} placeholder="e.g. Cash sale — Kasun, 077…" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <MirraButton type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin" size={16} />} Create {form.count} key{form.count > 1 ? "s" : ""}</MirraButton>
      </form>
      <div className="rounded-xl bg-[#0b0b0d] p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">New keys</h2>
          {keys.length > 0 && <button className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white" onClick={() => navigator.clipboard.writeText(keys.join("\n"))}><Copy size={15} /> Copy all</button>}
        </div>
        {!keys.length && <p className="mt-4 text-sm text-white/50">Created keys appear here.</p>}
        <ul className="mt-4 space-y-2 font-mono text-sm">{keys.map((k) => <li key={k} className="rounded bg-white/10 px-3 py-2">{k}</li>)}</ul>
      </div>
    </div>
  );
}
