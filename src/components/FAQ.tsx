
'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How long does it take to build a website?",
    answer: "A basic website typically takes 1-2 weeks, while more complex projects like web applications can take 4-8 weeks. We'll provide a detailed timeline during the consultation based on your specific requirements.",
  },
  {
    question: "What's included in the lifetime free maintenance?",
    answer: "Our lifetime maintenance includes security updates, bug fixes, minor text/content changes, server monitoring, and basic troubleshooting. Major feature additions or redesigns are quoted separately.",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer: "We can help you set up hosting and domain, but these costs are separate from our development packages. We recommend reliable providers and can manage everything for you if needed.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, PayPal, and major credit cards. We typically require 50% upfront to begin work, with the remaining 50% due upon project completion.",
  },
  {
    question: "Can I update the website content myself?",
    answer: "Absolutely! We can build you a custom admin panel or use a content management system (CMS) that allows you to easily update text, images, and other content without any coding knowledge.",
  },
  {
    question: "Do you offer e-commerce solutions?",
    answer: "Yes! We build complete e-commerce solutions with payment gateway integration (Stripe, PayPal, local banks), inventory management, order tracking, and more. Starting from $300.",
  },
  {
    question: "What if I'm not satisfied with the design?",
    answer: "We provide unlimited design revisions during the design phase. We work closely with you until you're 100% satisfied with the design before moving to development.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer: "Yes! Apart from free lifetime maintenance, we offer optional premium support packages with faster response times, regular updates, and dedicated account management.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden animate-fade-in opacity-0">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6 animate-fade-in opacity-0">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in opacity-0 animation-delay-100">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in opacity-0 animation-delay-200">
            Got questions? We've got answers. If you don't find what you're looking for, feel free to contact us.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-fade-in opacity-0 animation-delay-300">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 data-[state=open]:border-primary/50 data-[state=open]:shadow-red transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6 [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center animate-fade-in opacity-0 animation-delay-500">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-card border border-border">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-foreground mb-1">Still have questions?</h3>
              <p className="text-sm text-muted-foreground">Can't find what you're looking for? Let's chat!</p>
            </div>
            <Button variant="hero" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
