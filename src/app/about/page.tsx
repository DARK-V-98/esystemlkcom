
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ESYSTEMLK's mission, values, and the expert team behind our premium software solutions.",
};

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Twitter,
  Compass,
  Palette,
  CodeXml,
  ClipboardCheck,
  Rocket,
  LifeBuoy,
  MessageSquareQuote,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Lead Developer",
    avatar: "https://placehold.co/150x150.png",
    hint: "woman developer",
    bio: "Full-stack developer who's been building web systems for years. Writes clean code and doesn't leave messes for others to clean up.",
  },
  {
    name: "Michael Chen",
    role: "Head of Product",
    avatar: "https://placehold.co/150x150.png",
    hint: "man designer",
    bio: "Keeps projects on track and makes sure what we build actually solves the right problem. Bridges the gap between clients and the dev team.",
  },
  {
    name: "Emily Rodriguez",
    role: "UI/UX Design Lead",
    avatar: "https://placehold.co/150x150.png",
    hint: "creative artist",
    bio: "Designs interfaces that people find easy to use. Obsessed with the details that most people don't notice but everyone feels.",
  },
];

const values = [
  {
    title: "Innovation",
    description:
      "We keep up with what's new in tech so you don't have to. If there's a better way to build something, we'll find it.",
  },
  {
    title: "Integrity",
    description:
      "We tell you the truth — about timelines, costs, and what's realistic. No overselling, no hidden fees.",
  },
  {
    title: "Excellence",
    description:
      "We don't cut corners. Every line of code and every design decision gets proper thought.",
  },
  {
    title: "Collaboration",
    description:
      "We work with you, not just for you. You're part of the process from day one.",
  },
];

const processSteps = [
  {
    icon: Compass,
    title: "Discovery & Strategy",
    description:
      "We sit down and learn about your business, your users, and what you're trying to achieve before writing a single line.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "We design screens that make sense to real people. You review and give feedback until it feels right.",
  },
  {
    icon: CodeXml,
    title: "Agile Development",
    description:
      "We build in stages and keep you in the loop. No big reveals at the end — you see progress as it happens.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Assurance",
    description:
      "We test on real devices before anything goes live. If something's broken, we fix it here — not after launch.",
  },
  {
    icon: Rocket,
    title: "Deployment & Launch",
    description:
      "We handle the go-live from start to finish. Your site or app goes up clean, fast, and without drama.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description:
      "We don't disappear after launch. We're here for updates, fixes, and whatever comes next.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            About ESYSTEMLK
          </h1>
          <p className="max-w-[700px] mx-auto text-gray-700 md:text-xl mt-4">
            A team of developers, designers, and problem-solvers who care about building things that actually work.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-3xl bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl">
            <div className="order-2 md:order-1">
              <h2 className="font-headline text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4">
                We started ESYSTEMLK because we saw too many businesses stuck with bad software and no one to help them fix it. Our goal is simple — build things that work, keep them running, and be honest about what it costs.
              </p>
              <p className="text-gray-700">
                We work with businesses of all sizes across Sri Lanka and beyond. Whether you need a basic website or a full software system, we treat every project the same way — with care and attention to detail.
              </p>
            </div>
            <div className="order-1 md:order-2 overflow-hidden rounded-2xl">
              <Image
                src="/r.jpg"
                alt="Our team collaborating on a project in a modern office"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg transition-transform duration-500 hover:scale-110"
                data-ai-hint="team collaboration"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-24 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-8 md:p-12 rounded-3xl bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl text-center">
            <MessageSquareQuote className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-headline text-3xl font-bold mb-4">
              A Word From Our Founder
            </h2>
            <p className="text-gray-600 md:text-lg max-w-3xl mx-auto mb-8">
              "Knowledge is the ladder to growth. The more we learn, the further we can climb." Get to know the vision and driving force behind ESYSTEMLK.
            </p>
            <Button asChild size="lg">
              <Link href="/founder-message">Read the Founder's Message</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Our Approach to Digital Excellence
            </h2>
            <p className="text-muted-foreground md:text-lg mt-2 max-w-3xl mx-auto">
              Here's how we work — step by step, with you involved at every stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl transition-all duration-300 hover:border-primary hover:-translate-y-2 group text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-white text-black/20 border-2 border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-110">
                    <step.icon className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Our Core Values
            </h2>
            <p className="text-muted-foreground md:text-lg mt-2">
              The principles that guide our work and culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card
                key={value.title}
                className="text-center p-6 rounded-2xl shadow-lg bg-gray-100 border-gray-200  border border-gray-200"
              >
                <h3 className="font-headline text-xl font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}






