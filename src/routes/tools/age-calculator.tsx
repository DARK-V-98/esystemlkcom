import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Age Calculator Online",
  "description": "Calculate exact age in years, months and days from a date of birth. Free, runs in your browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/age-calculator",
});

export const Route = createFileRoute("/tools/age-calculator")({
  head: () => ({
    meta: [
      { title: "Free Age Calculator — Exact Age in Years, Months, Days | ESYSTEMLK Tools" },
      { name: "description", content: "Calculate exact age in years, months and days from any date of birth, plus total days lived. Free online age calculator that runs entirely in your browser." },
      { name: "keywords", content: "age calculator, calculate age, age in years months days, date of birth calculator, exact age calculator, how old am i, age difference calculator" },
      { property: "og:title", content: "Free Age Calculator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/age-calculator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/age-calculator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["age-calculator"].faq) },
    ],
  }),
  component: AgeCalculatorPage,
});

function pad(n: number) { return n.toString().padStart(2, "0"); }
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function diff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months--;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
  return { years, months, days, totalDays };
}

function AgeCalculatorPage() {
  const [dob, setDob] = useState("2000-01-01");
  const [at, setAt] = useState(today());

  const from = new Date(dob);
  const to = new Date(at);
  const valid = !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to >= from;
  const r = valid ? diff(from, to) : null;

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate exact age in years, months and days — plus total days lived."
      article={<ToolArticle title="Age Calculator" data={TOOL_ARTICLES["age-calculator"]} />}
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Date of birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Age at date</label>
            <input type="date" value={at} onChange={(e) => setAt(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
          </div>
        </div>

        {r ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[["Years", r.years], ["Months", r.months], ["Days", r.days]].map(([label, val]) => (
                <div key={label} className="bg-bg-blue/40 rounded-xl py-5 text-center">
                  <div className="font-display font-black text-3xl text-neon">{val as number}</div>
                  <div className="text-xs text-text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              That's a total of <strong className="text-foreground">{r.totalDays.toLocaleString()}</strong> days.
            </p>
          </div>
        ) : (
          <p className="text-sm text-red-500">Please enter a valid date of birth on or before the second date.</p>
        )}

        <p className="text-xs text-text-muted">✓ Calculated in your browser. ✓ Your dates are never uploaded.</p>
      </div>
    </ToolLayout>
  );
}
