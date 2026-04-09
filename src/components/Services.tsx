
'use client';
import { 
  Globe, 
  Smartphone, 
  Code2, 
  Database, 
  Shield, 
  Palette, 
  Rocket, 
  Headphones,
  Settings,
  Cloud,
  Lock,
  BarChart
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Business Websites",
      description: "Clean, fast websites that look great and actually bring in customers — not just pretty pages.",
      features: ["SEO Optimized", "Mobile Responsive", "Fast Loading"],
    },
    {
      icon: Smartphone,
      title: "Web Applications",
      description: "Custom web apps built around how your team works, not the other way around.",
      features: ["Custom Features", "User-Friendly", "Scalable"],
    },
    {
      icon: Code2,
      title: "Software Systems",
      description: "Solid software built for your business — no bloat, no shortcuts, just what you need.",
      features: ["Full Integration", "Secure", "Automated"],
    },
    {
      icon: Database,
      title: "Database Solutions",
      description: "Well-structured databases that keep your data safe, fast, and easy to work with.",
      features: ["Optimized Queries", "Backup Systems", "Data Security"],
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Designs people actually enjoy using — simple, clean, and built around real users.",
      features: ["Modern Design", "User Research", "Prototyping"],
    },
    {
      icon: Cloud,
      title: "Cloud Hosting",
      description: "Reliable hosting that stays up. We handle the servers so you don't have to think about them.",
      features: ["Fast Servers", "Auto Scaling", "SSL Included"],
    },
    {
      icon: Shield,
      title: "Security Solutions",
      description: "We lock things down properly — firewalls, encryption, and ongoing monitoring included.",
      features: ["Firewall", "Encryption", "Monitoring"],
    },
    {
      icon: Settings,
      title: "Maintenance & Support",
      description: "We keep your site running after launch — for free, for life. No catch.",
      features: ["24/7 Support", "Regular Updates", "Bug Fixes"],
    },
    {
      icon: Rocket,
      title: "Performance Optimization",
      description: "Slow sites lose customers. We speed things up so yours doesn't.",
      features: ["Code Optimization", "CDN Setup", "Caching"],
    },
    {
      icon: BarChart,
      title: "Analytics & SEO",
      description: "Real data, real rankings. We help you show up on Google and understand what's working.",
      features: ["Keyword Research", "Traffic Analysis", "Reporting"],
    },
    {
      icon: Lock,
      title: "API Development",
      description: "Clean, documented APIs that connect your systems without headaches.",
      features: ["RESTful APIs", "Documentation", "Authentication"],
    },
    {
      icon: Headphones,
      title: "Consulting",
      description: "Not sure what you need? We'll sit down with you and figure it out together.",
      features: ["Strategy Planning", "Tech Audit", "Roadmap"],
    },
  ];

  return (
    <section id="services" className="py-24 bg-white text-black relative overflow-hidden animate-fade-in opacity-0">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6 animate-fade-in opacity-0">
            <Settings className="w-4 h-4 text-primary animate-spin-slow" />
            <span className="text-sm font-medium text-primary">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Complete <span className="text-gradient">Digital Solutions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From small business sites to full enterprise systems — we get it done right, every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;



