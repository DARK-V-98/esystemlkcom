import { HelpCircle, ListChecks, Lightbulb, Sparkles } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolArticleData {
  /** One or more intro paragraphs explaining what the tool is and how it works. */
  intro: string[];
  /** Numbered "How to use" steps. */
  howTo: string[];
  /** Real-world use cases / examples. */
  useCases: string[];
  /** Optional practical tips. */
  tips?: string[];
  /** Short FAQ — also emitted as FAQPage structured data. */
  faq: FaqItem[];
}

/**
 * Builds a FAQPage JSON-LD string from an article's FAQ so each tool page
 * ships genuine, structured editorial content (not just the widget).
 */
export function toolFaqLd(faq: FaqItem[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 font-display font-bold text-xl lg:text-2xl text-foreground">
      <Icon className="w-5 h-5 text-neon" />
      {children}
    </h2>
  );
}

export function ToolArticle({
  title,
  data,
}: {
  title: string;
  data: ToolArticleData;
}) {
  return (
    <article className="mt-12 space-y-12">
      {/* About */}
      <section className="space-y-4">
        <SectionHeading icon={Sparkles}>About the {title}</SectionHeading>
        <div className="space-y-4 text-text-secondary leading-relaxed max-w-3xl">
          {data.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="space-y-4">
        <SectionHeading icon={ListChecks}>How to use it</SectionHeading>
        <ol className="space-y-3 max-w-3xl">
          {data.howTo.map((step, i) => (
            <li key={i} className="flex gap-3 text-text-secondary leading-relaxed">
              <span className="flex-none w-6 h-6 rounded-full bg-bg-blue text-neon text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Use cases */}
      <section className="space-y-4">
        <SectionHeading icon={Sparkles}>Common uses</SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
          {data.useCases.map((u, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-text-secondary leading-relaxed bg-white border border-border rounded-xl p-4"
            >
              <span className="text-neon font-bold">→</span>
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
        <section className="space-y-4">
          <SectionHeading icon={Lightbulb}>Tips &amp; good to know</SectionHeading>
          <ul className="space-y-2.5 max-w-3xl">
            {data.tips.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-text-secondary leading-relaxed">
                <Lightbulb className="w-4 h-4 text-neon flex-none mt-1" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      <section className="space-y-4">
        <SectionHeading icon={HelpCircle}>Frequently asked questions</SectionHeading>
        <dl className="space-y-4 max-w-3xl">
          {data.faq.map((f, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5">
              <dt className="font-semibold text-foreground">{f.q}</dt>
              <dd className="mt-2 text-text-secondary leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
