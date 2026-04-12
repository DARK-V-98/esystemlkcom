
import { Metadata } from "next";
import PortfolioClient from './portfolio-client';
import { getPortfolioItems } from '../admin/portfolio/actions';
import { Sparkles, Code2, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: "Our Portfolio | ESystemLk",
  description: "Explore our past projects, custom software solutions, and successful digital transformations delivered by ESystemLk.",
};

export default async function PortfolioPage() {
  const projects = await getPortfolioItems();
  
  return (
    <main className="min-h-screen bg-white">
      {/* Cinematic Hero Section */}
      <section className="relative w-full py-24 md:py-40 overflow-hidden bg-black text-white">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <div className="container relative mx-auto px-4 md:px-6 z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary">Our Legacy</span>
          </div>
          
          <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            ENGINEERING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-purple-600">
              DIGITAL EXCELLENCE
            </span>
          </h1>
          
          <p className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-2xl font-medium leading-relaxed mb-12 px-4">
            A showcase of high-performance software, custom web applications, and strategic digital solutions built for the future.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/10 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-white mb-1">25+</span>
              <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">Projects Delivered</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-white mb-1">99%</span>
              <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">Client Success Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-white mb-1">6+</span>
              <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">Years Experience</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Portfolio Content */}
      <section className="w-full py-20 md:py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-3xl md:text-5xl font-black text-black mb-4 tracking-tight">SELECTED WORKS</h2>
              <p className="text-gray-500 text-lg font-medium">
                Explore our portfolio by category and discover how we've helped businesses transform through technology.
              </p>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
               <div className="flex items-center gap-2">
                 <Code2 className="w-5 h-5" />
                 <span className="text-sm font-bold uppercase tracking-widest">Innovation</span>
               </div>
               <div className="w-px h-4 bg-gray-200" />
               <div className="flex items-center gap-2">
                 <Rocket className="w-5 h-5" />
                 <span className="text-sm font-bold uppercase tracking-widest">Growth</span>
               </div>
            </div>
          </div>
          
          <PortfolioClient projects={projects} />
        </div>
      </section>
    </main>
  );
}





