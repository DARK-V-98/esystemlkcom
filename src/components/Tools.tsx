
'use client';
import {
  FileSignature,
  CandlestickChart,
  Server,
  FileImage,
  ShieldCheck,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const featuredTools = [
  {
    icon: FileSignature,
    title: "Invoice Generator",
    description: "Create and download professional PDF invoices for your clients.",
    link: "/tools/invoice-generator",
  },
  {
    icon: CandlestickChart,
    title: "Currency Converter",
    description: "Convert between major currencies using live exchange rates.",
    link: "/tools/currency-converter",
  },
  {
    icon: Server,
    title: "API Tester",
    description: "A lightweight, browser-based client to test your API endpoints.",
    link: "/tools/api-tester",
  },
  {
    icon: FileImage,
    title: "Image Compressor",
    description: "Reduce image file size with adjustable quality settings.",
    link: "/tools/image-compressor",
  },
  {
    icon: ShieldCheck,
    title: "SSL Checker",
    description: "Check a domain's SSL certificate for expiry and issuer details.",
    link: "/tools/ssl-checker",
  },
];

const Tools = () => {
  return (
    <section id="tools" className="py-24 bg-background relative overflow-hidden animate-fade-in opacity-0">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Free Developer Tools</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            A Suite of Powerful, Secure Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our collection of free, browser-based utilities designed to make your development workflow faster and more efficient. No uploads, no waiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool, index) => (
            <Card key={index} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow">{tool.description}</p>
                <Button asChild variant="ghost" className="w-fit p-0 h-auto text-primary justify-start mt-4">
                    <Link href={tool.link}>
                        Use Tool <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
            <Button asChild variant="hero" size="xl">
                <Link href="/tools">
                    Explore All Tools ({'>'}25)
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default Tools;
