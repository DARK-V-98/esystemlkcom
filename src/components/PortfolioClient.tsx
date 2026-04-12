
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Smartphone, GraduationCap, Globe, Users, Wallet, Bot, Code2, Rocket } from 'lucide-react';
import { useEffect, useState } from "react";
import { getPortfolioItems } from "@/app/admin/portfolio/actions";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface PortfolioItem {
  id: string;
  name: string;
  link: string;
  category: string;
  tech: string[];
  imageUrl?: string;
  hint?: string;
  description?: string;
  icon?: React.ReactNode;
}

const staticProjects: PortfolioItem[] = [
  {
    id: 'ebot-21',
    name: 'EBOT 2.1 WhatsApp Automation',
    link: '#',
    category: 'Automation',
    tech: ['Node.js', 'React'],
    description: 'Advanced WhatsApp automation for businesses with management dashboard and QR linking support.',
    icon: <Bot className="w-12 h-12 text-blue-500" />,
    hint: 'WhatsApp Automation Bot',
  },
  {
    id: 'expens-app',
    name: 'ExpenS - Expense Tracker',
    link: '#',
    category: 'Mobile Apps',
    tech: ['React Native', 'Firebase'],
    description: 'Powerful mobile application for personal and business expense tracking and financial management.',
    icon: <Wallet className="w-12 h-12 text-green-500" />,
    hint: 'Mobile Expense Tracker',
  },
  {
    id: 'smrt-lms',
    name: 'SMRT LMS V1',
    link: '#',
    category: 'Education',
    tech: ['Next.js', 'Stripe'],
    description: 'Advanced Learning Management System supporting recorded classes, unlimited courses, batches, and time slots. Includes timetables, course resources, automatic subscription expiration, email notifications, Google login, and payment gateway integration.',
    icon: <GraduationCap className="w-12 h-12 text-purple-500" />,
    hint: 'Learning Management System',
  }
];

export default function PortfolioClient() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const items = await getPortfolioItems();
        const dynamicProjects = items.map(item => ({
          id: item.id,
          name: item.name,
          link: item.link,
          imageUrl: item.imageUrl,
          category: 'Web Apps',
          tech: ['Next.js'],
          hint: 'featured project',
        }));
        
        // Take only first few for the home page to keep it clean
        setProjects([...staticProjects, ...dynamicProjects].slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch portfolio items", error);
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

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

  return (
    <section className="w-full py-24 md:py-32 overflow-hidden bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-4 py-1 rounded-full">Our Work</Badge>
              <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tight text-black leading-[1.1]">
                PROJECTS THAT <br />
                <span className="text-primary italic">DEFINE US.</span>
              </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-gray-400"
          >
             <div className="flex items-center gap-2">
               <Code2 className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Advanced UI</span>
             </div>
             <div className="w-px h-4 bg-gray-200" />
             <div className="flex items-center gap-2">
               <Rocket className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Scale</span>
             </div>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <a 
                  href={project.link} 
                  target={project.link.startsWith('/') ? '_self' : '_blank'}
                  rel="noopener noreferrer" 
                  className="block group h-full"
                  >
                  <Card className="overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 bg-white border border-gray-100 group-hover:border-primary/20 rounded-[2.5rem] shadow-sm relative">
                      {project.imageUrl ? (
                      <div className="overflow-hidden relative h-56 md:h-64">
                          <img
                              src={project.imageUrl}
                              alt={project.name}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              data-ai-hint={project.hint}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-4 left-4">
                             <Badge className="bg-white/90 backdrop-blur-md text-black border-none font-bold tracking-tight">
                                {project.category}
                             </Badge>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <ArrowUpRight className="w-5 h-5 text-primary" />
                          </div>
                      </div>
                      ) : (
                        <div className="h-56 md:h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                          </div>
                          <div className="transform group-hover:scale-110 transition-transform duration-700">
                            {project.icon || <Smartphone className="w-12 h-12 text-primary/40" />}
                          </div>
                          <div className="absolute top-4 left-4">
                             <Badge className="bg-primary/10 text-primary border-primary/20 font-bold tracking-tight">
                                {project.category}
                             </Badge>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-primary/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                              <ArrowUpRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      )}
                      <CardContent className="p-8 flex flex-col flex-grow text-black">
                        <div className="mb-4">
                          <h3 className="font-headline text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{project.name}</h3>
                          {project.description && (
                              <p className="text-gray-500 mb-4 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50">
                           <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech?.slice(0, 3).map((t) => (
                                 <span key={t} className="text-[10px] font-black tracking-widest uppercase text-gray-400">
                                    {t}
                                 </span>
                              ))}
                           </div>
                           <div className="flex items-center text-sm font-bold text-primary hover:underline">
                             <span>View Details</span>
                             <ArrowUpRight className="ml-1 w-4 h-4" />
                           </div>
                        </div>
                      </CardContent>
                  </Card>
                  </a>
                </motion.div>
            ))}
            </div>
        </motion.div>
      </div>
    </section>
  );
}


