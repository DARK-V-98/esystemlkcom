
import CTABanner from "@/components/CTABanner";
import ClientLogos from "@/components/ClientLogos";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import PortfolioClient from "@/components/PortfolioClient";
import Tools from "@/components/Tools";

export default function Home() {

  return (
    <>
        <Hero />
        <Services />
        <Process />
        <PortfolioClient />
        <Tools />
        <Pricing />
        <TechStack />
        <Testimonials />
        <ClientLogos />
        <WhyUs />
        <FAQ />
        <CTABanner />
        <Contact />
    </>
  );
}
