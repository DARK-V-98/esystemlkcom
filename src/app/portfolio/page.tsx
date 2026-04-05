
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio",
  description: "Explore our past projects, custom software solutions, and successful digital transformations delivered by ESystemLk.",
};

import PortfolioClient from './portfolio-client';
import { getPortfolioItems } from '../admin/portfolio/actions';

export default async function PortfolioPage() {
  const projects = await getPortfolioItems();
  
  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Our Work</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Explore a selection of projects and services that showcase our technical expertise and commitment to quality.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <PortfolioClient projects={projects} />
        </div>
      </section>
    </>
  );
}
