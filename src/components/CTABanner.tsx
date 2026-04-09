
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  Phone,
  CalendarCheck,
  Lock,
  Zap,
  FileText,
} from "lucide-react";
import Link from "next/link";

const CTABanner = () => {
  return (
    <section className="py-20 bg-accent relative overflow-hidden animate-fade-in opacity-0">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        {/* Neon blue accent orb */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px]" style={{background:'hsl(200,100%,50%,0.1)'}} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 animate-float hidden lg:block">
        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-10 right-10 animate-float animation-delay-300 hidden lg:block">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-red">
          <Rocket className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(200,100%,50%,0.5)] bg-[hsl(200,100%,50%,0.08)] mb-8 animate-fade-in opacity-0" style={{boxShadow:'0 0 16px hsl(200,100%,50%,0.2)'}}>
            <Sparkles className="w-4 h-4 text-[hsl(200,100%,60%)] animate-bounce-subtle" />
            <span className="text-sm font-medium text-[hsl(200,100%,70%)]">
              Limited Time Offer
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-accent-foreground mb-6 animate-fade-in opacity-0 animation-delay-100">
            Ready to Transform Your{" "}
            <span className="text-primary">Digital Presence?</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-accent-foreground/90 mb-10 max-w-2xl mx-auto animate-fade-in opacity-0 animation-delay-200">
            Book a free call this month and get 10% off your first project. Spots fill up fast — we only take on a limited number of new clients each month.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0 animation-delay-300">
            <Button asChild variant="hero" size="xl" className="gap-2 group">
              <Link href="#contact">
                Start Your Project
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="heroOutline"
              size="xl"
              className="gap-2 border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground hover:text-accent"
            >
              <a href="tel:+94765711396">
                <Phone className="w-5 h-5" />
                Schedule a Call
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-accent-foreground/60 text-sm animate-fade-in opacity-0 animation-delay-400">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <span>Available Now</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Fast Response</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Free Quote</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
