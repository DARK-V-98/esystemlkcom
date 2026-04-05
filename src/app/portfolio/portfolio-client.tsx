
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioItem } from '../admin/portfolio/actions';


export default function PortfolioClient({ projects }: { projects: PortfolioItem[] }) {
  return (
    <div>
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl">
          <h3 className="font-headline text-2xl font-bold">Our work is coming soon!</h3>
          <p className="text-muted-foreground mt-2">Please check back later to see our amazing projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a 
              href={project.link} 
              key={project.id} 
              target={project.link.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer" 
              className="block group"
            >
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-white/30 rounded-2xl shadow-lg">
                {project.imageUrl && (
                  <div className="overflow-hidden relative">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        width={600}
                        height={400}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-primary hover:underline break-all mt-auto">
                    {project.link.startsWith('/') ? "View Offering" : project.link.replace(/^https?:\/\//, '')}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
