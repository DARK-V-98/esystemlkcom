
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { getPortfolioItems } from "@/app/admin/portfolio/actions";
import { Skeleton } from "./ui/skeleton";

export interface PortfolioItem {
  id: string;
  name: string;
  link: string;
  imageUrl?: string;
  hint?: string;
  description?: string;
}

export default function PortfolioClient() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const items = await getPortfolioItems();
        const featuredProjects = items.map(item => ({
          id: item.id,
          name: item.name,
          link: item.link,
          imageUrl: item.imageUrl,
          hint: 'featured project',
        }));
        setProjects(featuredProjects);
      } catch (error) {
        console.error("Failed to fetch portfolio items", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
       <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null; // Don't render the section if there are no projects
  }

  return (
    <section className="w-full py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">Our Work</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
                Explore a selection of projects that showcase our technical expertise and commitment to quality.
            </p>
        </div>
        <div>
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
                            data-ai-hint={project.hint}
                        />
                        <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    )}
                    <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-semibold mb-2">{project.name}</h3>
                    {project.description && (
                        <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
                    )}
                    <p className="text-sm text-primary hover:underline break-all mt-auto">
                        {project.link.startsWith('/') ? "View Offering" : project.link.replace(/^https?:\/\//, '')}
                    </p>
                    </CardContent>
                </Card>
                </a>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}
