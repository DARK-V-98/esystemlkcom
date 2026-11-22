import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Cable, Wifi, MonitorPlay, Gamepad2, Video, Crown, ShieldCheck, ArrowRight } from "lucide-react";
import {
  MIRRA_PLANS, MIRRA_FREE_FEATURES, MIRRA_PREMIUM_FEATURES, MIRRA_SETUP_STEPS, MIRRA_VERSION, lkr,
} from "@/data/mirra";
import { MirraShell, MirraMark, MirraWordmark, MirraButton, MIRRA_RED } from "@/components/mirra/MirraUi";

const TITLE = "MIRRA — Android Screen Mirroring for Streamers | ESYSTEMLK";
const DESC = "Mirror your Android phone to your PC over USB or Wi-Fi in up to 4K and 144 fps. Built for streamers: OBS output window, recording, key mapping. Free download, Premium keys from Rs 1,500.";

export const Route = createFileRoute("/mirra/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "https://www.esystemlk.com/mirra" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/mirra" }],
  }),
  component: MirraPage,
});

const HIGHLIGHTS = [
  { icon: Cable, title: "USB or Wi-Fi", body: "Plug in for the lowest delay, or go wireless on the same Wi-Fi." },
  { icon: MonitorPlay, title: "Up to 4K · 144 fps", body: "Crisp, smooth video with hardware decoding on your PC." },
  { icon: Video, title: "Made for OBS", body: "A clean stream output window with green-screen and frame options." },
  { icon: Gamepad2, title: "Key mapping", body: "Play mobile games with your keyboard: taps, WASD stick and more." },
];

const FAQ = [
  { q: "Do I need to install anything else?", a: "No. The MIRRA installer includes everything. You only turn on USB debugging on the phone once." },
  { q: "Which phones work?", a: "Android 5 or newer, including Android 16 and 17. iPhones are not supported." },
  { q: "How do I get my key after paying?", a: "Card payments: the key appears instantly on your order page and in your email. Bank transfer: upload the slip and we send the key after checking it, usually within a few hours." },
  { q: "Can I move my key to a new PC?", a: "Yes. In MIRRA open Licence → Deactivate on the old PC, then activate on the new one. Contact us if the old PC is gone." },
  { q: "What happens when a monthly or yearly key ends?", a: "MIRRA goes back to the Free plan. Buy a new key any time to get Premium again." },
];

function MirraPage() {
  return (
    <MirraShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#050506] text-white">
        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 80% at 80% 20%, ${MIRRA_RED}55, transparent 60%)` }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="flex items-center gap-3">
              <MirraMark size={52} />
              <MirraWordmark className="text-3xl" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight sm:text-5xl">
              Your phone on your PC.<br /><span style={{ color: MIRRA_RED }}>Stream-ready.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">{DESC.split(". ").slice(0, 2).join(". ")}.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MirraButton href="/api/mirra/download"><Download size={18} /> Download free · v{MIRRA_VERSION}</MirraButton>
              <MirraButton href="#pricing" variant="light"><Crown size={18} /> Get Premium</MirraButton>
            </div>
            <p className="mt-4 text-sm text-white/50">Windows 10 / 11 · 64-bit · Developed in Sri Lanka</p>
          </div>
          <div className="relative mx-auto aspect-[16/10] w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d0d10] p-4 shadow-2xl">
            <div className="flex h-full gap-4">
              <div className="hidden w-14 flex-col gap-2 rounded-lg bg-white/5 p-2 sm:flex">
                {[0, 1, 2, 3, 4].map((i) => <div key={i} className={`h-8 rounded ${i === 0 ? "bg-[#E10600]" : "bg-white/10"}`} />)}
              </div>
              <div className="flex flex-1 items-center justify-center rounded-lg bg-black">
                <div className="flex aspect-[9/19] h-[88%] items-center justify-center rounded-[18px] border-4 border-white/80 bg-gradient-to-b from-[#1a1a1f] to-[#2a0000]">
                  <div className="h-0 w-0 border-y-[16px] border-l-[26px] border-y-transparent border-l-[#E10600]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border p-6">
              <Icon style={{ color: MIRRA_RED }} />
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Premium */}
      <section className="bg-secondary/60">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-8">
            <h2 className="font-display text-2xl font-black">Free</h2>
            <p className="mt-1 text-sm text-muted-foreground">Everything you need to start.</p>
            <ul className="mt-6 space-y-3 text-sm">{MIRRA_FREE_FEATURES.map((f) => <li key={f} className="flex gap-2"><Check size={18} className="shrink-0 text-green-600" />{f}</li>)}</ul>
            <MirraButton href="/api/mirra/download" variant="dark" className="mt-8 w-full"><Download size={18} /> Download free</MirraButton>
          </div>
          <div className="rounded-2xl bg-[#0b0b0d] p-8 text-white ring-2 ring-[#E10600]">
            <h2 className="font-display text-2xl font-black">Premium <Crown className="inline" size={22} style={{ color: MIRRA_RED }} /></h2>
            <p className="mt-1 text-sm text-white/60">Everything in Free, plus:</p>
            <ul className="mt-6 space-y-3 text-sm">{MIRRA_PREMIUM_FEATURES.map((f) => <li key={f} className="flex gap-2"><Check size={18} className="shrink-0" style={{ color: MIRRA_RED }} />{f}</li>)}</ul>
            <MirraButton href="#pricing" className="mt-8 w-full">See Premium prices <ArrowRight size={18} /></MirraButton>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-black">Premium keys</h2>
        <p className="mt-2 text-center text-muted-foreground">Pay by card (PayHere) or bank transfer. One key unlocks MIRRA Premium on your PC.</p>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {MIRRA_PLANS.map((p) => (
            <div key={p.id} className={`flex flex-col rounded-2xl border p-7 ${p.featured ? "border-[#E10600] shadow-[0_10px_40px_rgba(225,6,0,0.15)]" : "border-border"}`}>
              {p.featured && <span className="mb-3 w-fit rounded-full bg-[#E10600] px-3 py-1 text-xs font-bold text-white">Most popular</span>}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-5 font-display text-4xl font-black">{lkr(p.price)}</p>
              <p className="text-sm text-muted-foreground">{p.days ? `${p.days} days from activation` : "One-time payment"} · {p.devices} PC{p.devices > 1 ? "s" : ""}</p>
              <MirraButton href={`/mirra/buy?plan=${p.id}`} variant={p.featured ? "red" : "dark"} className="mt-6 w-full">Buy {p.name.replace("Premium ", "")}</MirraButton>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck size={16} /> Secure card payments by PayHere. Keys are emailed to you.</p>
      </section>

      {/* Setup */}
      <section className="bg-[#050506] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-black">Set up in 2 minutes</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {MIRRA_SETUP_STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-white/10 p-6">
                <span className="font-display text-3xl font-black" style={{ color: MIRRA_RED }}>{i + 1}</span>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-white/60"><Wifi size={16} /> Tip: use a USB cable for the lowest delay while gaming. For Wi-Fi, keep the PC and phone on 5 GHz.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-black">Questions</h2>
        <div className="mt-8 divide-y divide-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </MirraShell>
  );
}
