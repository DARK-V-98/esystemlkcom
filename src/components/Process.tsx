
'use client'
import { 
  MessageSquare, 
  FileSearch, 
  Palette, 
  Code2, 
  TestTube, 
  Rocket,
  CheckCircle2
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Discovery Call",
    description: "We discuss your vision, goals, and requirements. Free consultation to understand your needs.",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Planning & Proposal",
    description: "Detailed project plan with timeline, features, and transparent pricing. No hidden costs.",
  },
  {
    icon: Palette,
    number: "03",
    title: "Design Phase",
    description: "Beautiful mockups and prototypes. We iterate until you're 100% satisfied with the design.",
  },
  {
    icon: Code2,
    number: "04",
    title: "Development",
    description: "Clean, scalable code using modern technologies. Regular updates on progress.",
  },
  {
    icon: TestTube,
    number: "05",
    title: "Testing & QA",
    description: "Rigorous testing on all devices and browsers. Bug-free delivery guaranteed.",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Launch & Support",
    description: "Smooth deployment and lifetime free maintenance. We're always here for you.",
  },
];

const Process = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden animate-fade-in opacity-0">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6 animate-fade-in opacity-0">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Process</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in opacity-0 animation-delay-100">
            How We Build Your Project
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in opacity-0 animation-delay-200">
            A transparent, collaborative process that ensures your project is delivered on time and exceeds expectations.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`group relative animate-fade-in opacity-0`}
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-8 h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}

                <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-red h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-red">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in opacity-0 animation-delay-800">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-foreground">No Upfront Fees for Consultation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-foreground">Flexible Payment Plans</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-foreground">100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
