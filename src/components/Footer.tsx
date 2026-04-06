
'use client';

import { 
  Code, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Instagram,
  Heart,
  ArrowUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SEOKeywords from "@/components/SEOKeywords";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="currentColor"
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
    />
  </svg>
);


const socialLinks = [
  { Icon: Facebook, href: "https://web.facebook.com/esystemlk/" },
  { Icon: XIcon, href: "https://x.com/esystemlk" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/vishwa-vidarshana-6b2608394/" },
  { Icon: Instagram, href: "https://www.instagram.com/esystemlk" }
];


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-accent text-accent-foreground pt-20 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6 group">
              <Image src="/logo.png" alt="ESystemLk Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold">
                <span className="text-accent-foreground">esystem</span>
                <span className="text-primary">lk</span>
              </span>
            </a>
            <p className="text-accent-foreground/70 mb-6 max-w-md">
              We build stunning websites, powerful web applications, and comprehensive software systems 
              for businesses of all sizes. Your success is our mission.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-accent-foreground/5 border border-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Services", href: "#services" },
                { name: "Pricing", href: "#pricing" },
                { name: "Why Choose Us", href: "#why-us" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-accent-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:esystemlk@gmail.com"
                  className="flex items-center gap-3 text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  esystemlk@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+94765711396"
                  className="flex items-center gap-3 text-accent-foreground/70 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  +94 76 571 1396
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-accent-foreground/70">
                  <MapPin className="w-5 h-5 text-primary" />
                  Sri Lanka
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-accent-foreground/10 pt-8 mb-8">
          <div className="bg-accent-foreground/5 rounded-2xl p-6">
            <h4 className="font-bold mb-3">Terms & Conditions</h4>
            <ul className="text-sm text-accent-foreground/70 space-y-2">
              <li>• All prices mentioned are starting prices. Final cost depends on project complexity and requirements.</li>
              <li>• Lifetime maintenance includes bug fixes, security updates, and minor text changes. Major feature additions require additional payment.</li>
              <li>• 50% advance payment required to start any project. Remaining 50% upon completion.</li>
              <li>• Project timeline depends on complexity and client feedback turnaround time.</li>
              <li>• Domain and hosting costs are not included in the package prices unless otherwise specified.</li>
            </ul>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <SEOKeywords />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-accent-foreground/10">
          <p className="text-accent-foreground/70 text-sm text-center md:text-left">
            © 2020 - {new Date().getFullYear()} Developed and Powered by esystemlk
          </p>
          <div className="flex items-center gap-6 text-sm text-accent-foreground/70">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full gradient-primary shadow-red flex items-center justify-center hover:scale-110 transition-transform z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-primary-foreground" />
      </button>
    </footer>
  );
};

export default Footer;
