
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
    answer: "A basic website usually takes 1–2 weeks. More complex projects like web apps can take 4–8 weeks. We'll give you a proper timeline after the first call once we know what you need.",
  },
  {
    question: "What's included in the lifetime free maintenance?",
    answer: "Security updates, bug fixes, small content changes, server monitoring, and basic troubleshooting — all free. If you want major new features or a full redesign, we'll quote that separately.",
  },
  {
    question: "Do you provide hosting and domain services?",
    answer: "We can help you set up hosting and a domain, but those costs are separate from our development work. We'll point you to good providers and can manage it all for you if you'd prefer.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Bank transfers, PayPal, and major credit cards. We ask for 50% upfront to get started, and the other 50% when the project is done.",
  },
  {
    question: "Can I update the website content myself?",
    answer: "Yes. We can build you a simple admin panel or hook up a CMS so you can update text, images, and other content on your own — no coding needed.",
  },
  {
    question: "Do you offer e-commerce solutions?",
    answer: "Yes. We build full online stores with payment gateways (Stripe, PayPal, local banks), inventory management, and order tracking. Starting from $300.",
  },
  {
    question: "What if I'm not satisfied with the design?",
    answer: "We keep revising until you're happy. During the design phase, there's no limit on changes. We move to development only when you give the green light.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer: "Yes — free maintenance is included for life. If you want faster response times or a dedicated account manager, we have optional premium support packages too.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-white text-black relative overflow-hidden animate-fade-in opacity-0">
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
          <p className="text-lg text-gray-600 animate-fade-in opacity-0 animation-delay-200">
            Common questions we get asked. If yours isn't here, just message us.
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
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
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
              <p className="text-sm text-gray-600">Can't find what you're looking for? Let's chat!</p>
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



