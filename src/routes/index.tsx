import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import {
  CentralSystem, Ebot, Services, Process, FreeTools,
  Pricing, TechStack, Clients, WhyChoose, FAQ,
  OfferBanner, Contact, Footer, Portfolio,
} from "@/components/home/Sections";

const LD_FAQ = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How long does it take to build a website?", "acceptedAnswer": { "@type": "Answer", "text": "Most websites are delivered in 2–4 weeks. Larger systems take 6–10 weeks depending on scope." } },
    { "@type": "Question", "name": "What is included in lifetime free maintenance?", "acceptedAnswer": { "@type": "Answer", "text": "Bug fixes, security patches, small content updates, hosting checks and uptime monitoring — for as long as you stay with us." } },
    { "@type": "Question", "name": "Do you provide hosting and domain services?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We handle domain registration, SSL, and high-performance hosting end to end." } },
    { "@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": { "@type": "Answer", "text": "Bank transfer, card payments, PayPal and major LKR gateways. Flexible payment plans available." } },
    { "@type": "Question", "name": "Do you offer e-commerce solutions?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — full e-commerce with payment gateways, inventory and shipping integrations." } }
  ]
});

const LD_SERVICES = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "ESYSTEMLK Services",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Business Website Development", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 2, "name": "Web Application Development", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 3, "name": "Custom Software Systems", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 4, "name": "UI/UX Design", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 5, "name": "Logo & Brand Design", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 6, "name": "Cloud Hosting & SSL", "url": "https://www.esystemlk.com/#services" },
    { "@type": "ListItem", "position": 7, "name": "WhatsApp Automation (EBOT)", "url": "https://www.esystemlk.com/#ebot" },
    { "@type": "ListItem", "position": 8, "name": "SEO & Digital Analytics", "url": "https://www.esystemlk.com/#services" }
  ]
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ESYSTEMLK — Custom Software, Web Apps & Websites in Sri Lanka" },
      { name: "description", content: "ESYSTEMLK builds custom websites, web apps and software systems for businesses in Sri Lanka. Lifetime free maintenance, 24/7 support, based in Rajagiriya. Over 25 clients, 260+ projects delivered since 2018." },
      { name: "keywords", content: "web development Sri Lanka, custom software Sri Lanka, website design Sri Lanka, web app development Sri Lanka, software company Sri Lanka, business website Sri Lanka, e-commerce website Sri Lanka, WordPress Sri Lanka, React developer Sri Lanka, Node.js Sri Lanka, mobile app Sri Lanka, UI UX design Sri Lanka, logo design Sri Lanka, branding Sri Lanka, website maintenance Sri Lanka, cheap website Sri Lanka, affordable website Sri Lanka, best web developer Sri Lanka, software development company Colombo, web developer Colombo, web designer Rajagiriya, IT company Sri Lanka, digital agency Sri Lanka, software house Sri Lanka, web hosting Sri Lanka, domain registration Sri Lanka, WhatsApp automation Sri Lanka, chatbot Sri Lanka, SEO Sri Lanka, Google ranking Sri Lanka, online presence Sri Lanka, startup website Sri Lanka, restaurant website Sri Lanka, hotel website Sri Lanka, ecommerce Sri Lanka, online shop Sri Lanka, custom web application, enterprise software Sri Lanka, database development Sri Lanka, API development Sri Lanka, cloud hosting Sri Lanka, website redesign Sri Lanka, ESYSTEMLK, esystem, e system lk" },
      { property: "og:title", content: "ESYSTEMLK — Custom Software, Web Apps & Websites in Sri Lanka" },
      { property: "og:description", content: "We build real software for real businesses. Custom websites, web apps & software systems — maintained for free, for life. Based in Sri Lanka." },
      { property: "og:url", content: "https://www.esystemlk.com/" },
      { property: "og:image", content: "https://www.esystemlk.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ESYSTEMLK — Software & Web Development Sri Lanka" },
      { name: "twitter:title", content: "ESYSTEMLK — Custom Software, Web Apps & Websites in Sri Lanka" },
      { name: "twitter:description", content: "We build real software for real businesses. Lifetime free maintenance. Based in Sri Lanka." },
      { name: "twitter:image", content: "https://www.esystemlk.com/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.esystemlk.com/" },
    ],
    scripts: [
      { type: "application/ld+json", children: LD_FAQ },
      { type: "application/ld+json", children: LD_SERVICES },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Portfolio />
        <CentralSystem />
        <Ebot />
        <Services />
        <Process />
        <FreeTools />
        <Pricing />
        <TechStack />
        <Clients />
        <WhyChoose />
        <FAQ />
        <OfferBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
