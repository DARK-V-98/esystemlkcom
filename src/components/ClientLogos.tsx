
'use client';
import { Building2 } from "lucide-react";

const clients = [
  "bigcosta constructions",
  "joshtours",
  "aaryahardware",
  "Ceylon Export & Tourism Hub",
  "flycargolanka",
  "smartlabs",
  "colombo district election department of sri lanka",
  "blindbless",
  "skillhub",
  "Pixel Pulse",
  "Code Catalyst",
  "Byte Brigade",
  "Cloud Nexus",
  "Data Dynamo",
  "Quantum Leap",
];

const ClientLogos = () => {
  return (
    <section className="py-16 bg-background border-y border-border overflow-hidden animate-fade-in opacity-0">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted By</span>
          </div>
          <p className="text-muted-foreground">
            Businesses and government departments across Sri Lanka and globally trust us with their digital presence
          </p>
        </div>
      </div>

      {/* Infinite scroll logos */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="flex animate-scroll">
          {/* First set */}
          <div className="flex shrink-0 gap-8 pr-8">
            {clients.map((client, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center px-8 py-4 bg-secondary/50 border border-border rounded-xl min-w-[180px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
              >
                <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap uppercase">
                  {client}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex shrink-0 gap-8 pr-8">
            {clients.map((client, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center px-8 py-4 bg-secondary/50 border border-border rounded-xl min-w-[180px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
              >
                <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap uppercase">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
