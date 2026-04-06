
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  category?: string;
}

export function ToolLayout({ title, description, children, category }: ToolLayoutProps) {
  return (
    <div className="min-h-screen pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-primary transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity rounded-3xl" />
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 text-center overflow-hidden">
            {category && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                {category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6">
              {title}
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Tool Content */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>

        {/* Footer Actions */}
        <div className="mt-16 flex justify-center">
          <Button asChild variant="ghost" className="hover:bg-white/5 text-muted-foreground hover:text-white transition-all group">
            <Link href="/tools">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Explore More Tools
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
