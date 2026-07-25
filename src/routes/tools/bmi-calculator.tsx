import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free BMI Calculator Online",
  "description": "Calculate your Body Mass Index (BMI) in metric or imperial units. Free, runs in your browser.",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/bmi-calculator",
});

export const Route = createFileRoute("/tools/bmi-calculator")({
  head: () => ({
    meta: [
      { title: "Free BMI Calculator — Body Mass Index (Metric & Imperial) | ESYSTEMLK Tools" },
      { name: "description", content: "Calculate your Body Mass Index (BMI) from your height and weight in metric or imperial units, and see your category. Free online BMI calculator, runs in your browser." },
      { name: "keywords", content: "bmi calculator, body mass index calculator, calculate bmi, bmi metric imperial, healthy weight calculator, bmi chart, bmi categories" },
      { property: "og:title", content: "Free BMI Calculator Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/bmi-calculator" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/bmi-calculator" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["bmi-calculator"].faq) },
    ],
  }),
  component: BmiCalculatorPage,
});

function category(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
  if (bmi < 25) return { label: "Normal weight", color: "#22c55e" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
  return { label: "Obese", color: "#ef4444" };
}

function BmiCalculatorPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("65");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("7");
  const [lb, setLb] = useState("145");

  let bmi = 0;
  if (unit === "metric") {
    const h = Number(cm) / 100;
    bmi = h > 0 ? Number(kg) / (h * h) : 0;
  } else {
    const totalIn = Number(ft) * 12 + Number(inch);
    bmi = totalIn > 0 ? (Number(lb) / (totalIn * totalIn)) * 703 : 0;
  }
  const valid = Number.isFinite(bmi) && bmi > 0 && bmi < 200;
  const cat = valid ? category(bmi) : null;

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index in metric or imperial units and see your category."
      article={<ToolArticle title="BMI Calculator" data={TOOL_ARTICLES["bmi-calculator"]} />}
    >
      <div className="space-y-6">
        <div className="flex gap-3">
          {([["metric", "Metric (cm / kg)"], ["imperial", "Imperial (ft / lb)"]] as const).map(([u, label]) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                unit === u ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {unit === "metric" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Height (cm)" value={cm} onChange={setCm} />
            <Field label="Weight (kg)" value={kg} onChange={setKg} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Height (ft)" value={ft} onChange={setFt} />
            <Field label="Height (in)" value={inch} onChange={setInch} />
            <Field label="Weight (lb)" value={lb} onChange={setLb} />
          </div>
        )}

        {cat && (
          <div className="bg-bg-blue/40 rounded-2xl p-6 text-center">
            <div className="font-display font-black text-5xl text-neon">{bmi.toFixed(1)}</div>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: cat.color }}>
              {cat.label}
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted">
          ⚠ BMI is a general screening tool, not a medical diagnosis. It doesn't account for muscle mass or body composition.
          Consult a healthcare professional for personal advice.
        </p>
        <p className="text-xs text-text-muted">✓ Calculated in your browser. ✓ Nothing uploaded.</p>
      </div>
    </ToolLayout>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-text-secondary block mb-1">{label}</label>
      <input
        type="number" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon"
      />
    </div>
  );
}
