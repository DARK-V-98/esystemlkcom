
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
    bio: "Expert full-stack architect specializing in high-performance, resilient architectures and clean, test-driven development practices.",
  },
  {
    name: "Michael Chen",
    role: "Head of Product",
    avatar: "https://placehold.co/150x150.png",
    hint: "man designer",
    bio: "Data-driven product strategist focused on bridging user needs and business objectives to create impactful, market-leading solutions.",
  },
  {
    name: "Emily Rodriguez",
    role: "UI/UX Design Lead",
    avatar: "https://placehold.co/150x150.png",
    hint: "creative artist",
    bio: "Creative designer with a passion for human-centered design, crafting beautiful, intuitive, and accessible user experiences that delight and convert.",
  },
];

const values = [
  {
    title: "Innovation",
    description:
      "We constantly explore new technologies to deliver cutting-edge solutions that provide a competitive edge.",
  },
  {
    title: "Integrity",
    description:
      "We believe in transparent, honest, and ethical collaboration with our clients, building partnerships based on trust.",
  },
  {
    title: "Excellence",
    description:
      "We are committed to the highest standards of quality, precision, and craftsmanship in everything we create.",
  },
  {
    title: "Collaboration",
    description:
      "We work as a unified team with our clients, fostering open communication to achieve shared goals and exceptional results.",
  },
];

const processSteps = [
  {
    icon: Compass,
    title: "Discovery & Strategy",
    description:
      "We dive deep into your business goals and audience to create a comprehensive project blueprint and a roadmap for success.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Our team crafts intuitive and beautiful user interfaces. We create wireframes and prototypes to perfect the user experience.",
  },
  {
    icon: CodeXml,
    title: "Agile Development",
    description:
      "Using cutting-edge tech, our developers bring designs to life with clean, scalable code, keeping you in the loop.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Assurance",
    description:
      "We conduct rigorous testing to ensure your application is bug-free, performant, and secure across all devices.",
  },
  {
    icon: Rocket,
    title: "Deployment & Launch",
    description:
      "We handle the entire deployment process, ensuring a smooth launch on a reliable, scalable, and secure cloud infrastructure.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description:
      "Our partnership doesn't end at launch. We offer ongoing maintenance and support to ensure your digital asset evolves with you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            About ESystemLk
          </h1>
          <p className="max-w-[700px] mx-auto text-white/80 md:text-xl mt-4">
            We are a collective of passionate developers, designers, and
            strategists dedicated to architecting the future of digital
            technology.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-3xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl">
            <div className="order-2 md:order-1">
              <h2 className="font-headline text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-white/80 mb-4">
                Our mission is to empower businesses with transformative
                technology solutions that drive growth, efficiency, and
                innovation. We strive to be a trusted partner, turning complex
                challenges into elegant, scalable, and user-centric digital
                experiences.
              </p>
              <p className="text-white/80">
                We are committed to pushing the boundaries of what's possible,
                fostering a culture of continuous learning and collaboration to
                deliver exceptional value to our clients worldwide.
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
      
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-8 md:p-12 rounded-3xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl text-center">
            <MessageSquareQuote className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-headline text-3xl font-bold mb-4">
              A Word From Our Founder
            </h2>
            <p className="text-white/80 md:text-lg max-w-3xl mx-auto mb-8">
              "Knowledge is the ladder to growth. The more we learn, the further we can climb." Get to know the vision and driving force behind ESystemLk.
            </p>
            <Button asChild size="lg">
              <Link href="/founder-message">Read the Founder's Message</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Our Approach to Digital Excellence
            </h2>
            <p className="text-muted-foreground md:text-lg mt-2 max-w-3xl mx-auto">
              We follow a structured and collaborative process to ensure every
              project is a masterpiece of strategy, design, and technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:border-primary hover:-translate-y-2 group text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-black/20 border-2 border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-110">
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

      <section className="py-20 md:py-24">
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
                className="text-center p-6 rounded-2xl shadow-lg bg-black/30 backdrop-blur-lg border border-white/10"
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
