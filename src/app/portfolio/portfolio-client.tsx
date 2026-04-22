
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowRight, Smartphone, GraduationCap, Globe, Users, Wallet, Bot, Code2, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface StaticPortfolioItem {
  id: string;
  name: string;
  link: string;
  category: string;
  tech: string[];
  imageUrl?: string;
  description?: string;
  icon?: React.ReactNode;
}

const staticProjects: StaticPortfolioItem[] = [
  {
    id: 'ebot-21',
    name: 'EBOT 2.1 WhatsApp Automation',
    link: '#',
    category: 'Automation',
    tech: ['Node.js', 'WhatsApp API', 'React', 'Tailwind'],
    description: 'Advanced WhatsApp automation for businesses with management dashboard and QR linking support.',
    icon: <Bot className="w-12 h-12 text-blue-500" />,
  },
  {
    id: 'expens-app',
    name: 'ExpenS - Expense Tracker',
    link: '#',
    category: 'Mobile Apps',
    tech: ['React Native', 'Firebase', 'Redux'],
    description: 'Powerful mobile application for personal and business expense tracking and financial management.',
    icon: <Wallet className="w-12 h-12 text-green-500" />,
  },
  {
    id: 'smrt-lms',
    name: 'SMRT LMS V1',
    link: '#',
    category: 'Education',
    tech: ['Next.js', 'Firebase', 'Stripe', 'Google Auth'],
    description: 'Advanced Learning Management System supporting recorded classes, unlimited courses, batches, and time slots. Includes timetables, course resources, automatic subscription expiration, email notifications, Google login, and payment gateway integration.',
    icon: <GraduationCap className="w-12 h-12 text-purple-500" />,
  },
  {
    id: 'web-manager-tool',
    name: 'Upcoming Website Manager',
    link: '#',
    category: 'Web Tools',
    tech: ['JavaScript', 'API', 'Mobile First'],
    description: 'Manage any website by simply adding a script. Control everything from your mobile device.',
    icon: <Globe className="w-12 h-12 text-orange-500" />,
  },
  {
    id: 'english-learning-app',
    name: 'English Learning App',
    link: '#',
    category: 'Education',
    tech: ['React Native', 'Speech API', 'Gamification'],
    description: 'Educational app designed for kids and youth under 20 to master English with interactive lessons.',
    icon: <Smartphone className="w-12 h-12 text-pink-500" />,
  },
  {
    id: 'election-staffing',
    name: 'Election Commission Staffing System',
    link: '#',
    category: 'Government',
    tech: ['PHP', 'MySQL', 'PDF Lib'],
    description: 'Automated staffing and appointment letter generation for the Colombo District Election Commission.',
    icon: <Users className="w-12 h-12 text-red-500" />,
  }
];

const CATEGORIES = ['All', 'Web Apps', 'Mobile Apps', 'Automation', 'Government', 'Education', 'Web Tools'];

export default function PortfolioClient({ projects }: { projects: any[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Map dynamic projects to include a category and tech if they don't have one
  const dynamicProjects = projects.map(p => ({
    ...p,
    category: p.category || 'Web Apps',
    tech: p.tech || ['Web Tech']
  }));

  const allProjects = [...staticProjects, ...dynamicProjects];
  
  const filteredProjects = activeCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === activeCategory);

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
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "hero" : "heroOutline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-6 transition-all duration-300 ${
              activeCategory === cat 
                ? "shadow-[0_0_15px_rgba(255,0,60,0.3)]" 
                : "border-gray-200 text-gray-600 hover:border-primary/30"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group"
            >
              <a 
                href={project.link} 
                target={project.link.startsWith('/') ? '_self' : '_blank'}
                rel="noopener noreferrer" 
                className="block h-full"
              >
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 bg-white border border-gray-100 group-hover:border-primary/20 rounded-[2.5rem] shadow-sm relative">
                  {project.imageUrl ? (
                    <div className="overflow-hidden relative h-64">
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                           <div className="flex items-center text-white font-medium">
                              Explore Project <ArrowUpRight className="ml-2 w-5 h-5" />
                           </div>
                        </div>
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/90 backdrop-blur-md text-black hover:bg-white border-none shadow-sm font-bold tracking-tight">
                              {project.category}
                           </Badge>
                        </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />
                      </div>
                      <div className="transform group-hover:scale-110 transition-transform duration-700 relative z-10">
                        {project.icon || <Smartphone className="w-16 h-16 text-primary/40" />}
                      </div>
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-primary/10 text-primary border-primary/20 font-bold tracking-tight">
                            {project.category}
                         </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-primary/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <ArrowUpRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-8 flex flex-col flex-grow text-black">
                    <div className="mb-6">
                      <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">{project.name}</h3>
                      {project.description && (
                          <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed font-medium">{project.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t: string) => (
                          <span key={t} className="text-[10px] font-black tracking-widest uppercase text-gray-400 border border-gray-100 px-2 py-1 rounded-md bg-gray-50/50">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 group/btn">
                         <span className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors flex items-center">
                            View Case Study <ArrowRight className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                         </span>
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


