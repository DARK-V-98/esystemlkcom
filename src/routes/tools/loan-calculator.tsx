import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free Loan / EMI Calculator Online",
  "description": "Calculate monthly loan repayment (EMI), total interest and total cost. Free, runs in your browser.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/loan-calculator",
});

export const Route = createFileRoute("/tools/loan-calculator")({
  head: () => ({
    meta: [
      { title: "Free Loan & EMI Calculator — Monthly Repayment | ESYSTEMLK Tools" },
      { name: "description", content: "Calculate your monthly loan repayment (EMI), total interest and total cost from the amount, interest rate and term. Free online loan calculator that runs in your browser." },
      { name: "keywords", content: "loan calculator, emi calculator, monthly repayment calculator, mortgage calculator, interest calculator, car loan calculator, personal loan calculator" },
      { property: "og:title", content: "Free Loan / EMI Calculator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/loan-calculator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/loan-calculator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["loan-calculator"].faq) },
    ],
  }),
  component: LoanCalculatorPage,
});

const money = (n: number) => (Number.isFinite(n) ? n : 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function LoanCalculatorPage() {
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const P = Number(amount);
  const r = Number(rate) / 100 / 12;
  const n = Number(years) * 12;

  let emi = 0;
  if (P > 0 && n > 0) {
    emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  const total = emi * n;
  const interest = total - P;
  const valid = Number.isFinite(emi) && emi > 0;

  return (
    <ToolLayout
      title="Loan / EMI Calculator"
      description="Calculate your monthly repayment (EMI), total interest and total cost of a loan."
      article={<ToolArticle title="Loan / EMI Calculator" data={TOOL_ARTICLES["loan-calculator"]} />}
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Loan amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Interest rate (% / yr)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">Term (years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon" />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            <div className="bg-bg-blue/40 rounded-2xl p-6 text-center">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">Monthly payment (EMI)</div>
              <div className="font-display font-black text-4xl text-neon">{money(emi)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-border rounded-xl p-4 text-center">
                <div className="text-xs text-text-muted mb-1">Total interest</div>
                <div className="font-bold text-lg text-foreground">{money(interest)}</div>
              </div>
              <div className="bg-white border border-border rounded-xl p-4 text-center">
                <div className="text-xs text-text-muted mb-1">Total repayment</div>
                <div className="font-bold text-lg text-foreground">{money(total)}</div>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted">
          Estimate only — principal and interest, excluding fees, insurance and other charges. Not financial advice.
        </p>
        <p className="text-xs text-text-muted">✓ Calculated in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}
