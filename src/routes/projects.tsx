import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";
import { ProjectCard } from "@/components/home/Sections";
import { PROJECTS } from "@/data/projects";
import { FadeIn } from "@/components/home/Section";

const LD_PORTFOLIO = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "ESYSTEMLK Portfolio — Projects Built",
  "description": "Websites and software systems built by ESYSTEMLK for businesses in Sri Lanka and globally.",
  "url": "https://www.esystemlk.com/projects",
  "itemListElement": PROJECTS.map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": p.name,
    "url": p.url
  }))
});

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Our Work — Projects by ESYSTEMLK | Sri Lanka Software Company" },
      { name: "description", content: "Browse websites, web apps and software systems built by ESYSTEMLK. Over 19 live projects for businesses across Sri Lanka — SmartLabs, BigCosta, Josh Tours, FlyCargo Lanka and more." },
      { name: "keywords", content: "ESYSTEMLK portfolio, web development projects Sri Lanka, websites built Sri Lanka, software projects Sri Lanka, web design portfolio Colombo, best websites Sri Lanka, Sri Lanka developer portfolio" },
      { property: "og:title", content: "Our Work — Projects by ESYSTEMLK" },
      { property: "og:description", content: "19 live websites and systems built for real Sri Lankan businesses. Browse our full portfolio." },
      { property: "og:url", content: "https://www.esystemlk.com/projects" },
      { property: "og:image", content: "https://www.esystemlk.com/og-image.png" },
      { name: "twitter:title", content: "Our Work — Projects by ESYSTEMLK" },
      { name: "twitter:description", content: "19 live websites and systems built for real Sri Lankan businesses." },
      { name: "twitter:image", content: "https://www.esystemlk.com/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.esystemlk.com/projects" },
    ],
    scripts: [
      { type: "application/ld+json", children: LD_PORTFOLIO },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f0f9ff] border border-neon/30 text-neon text-xs font-bold uppercase tracking-widest mb-4">
              Our Work
            </span>
            <h1 className="font-display font-black text-4xl lg:text-5xl tracking-tight text-foreground">
              A bit of our work
            </h1>
            <p className="mt-3 text-text-secondary max-w-xl">
              Not everything — just some of the sites and systems we've put out there.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PROJECTS.map((p) => (
              <FadeIn key={p.url}>
                <ProjectCard name={p.name} url={p.url} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href="/#contact"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold"
            >
              Start your project →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
