
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
    <div className="min-h-screen pb-20 bg-white text-black">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[hsl(200,100%,50%,0.06)] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[hsl(200,100%,50%,0.04)] blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[hsl(200,100%,40%)] transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-[hsl(200,100%,40%)] transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium">{title}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="relative bg-white border border-[hsl(200,100%,50%,0.3)] shadow-lg rounded-3xl p-8 md:p-12 text-center overflow-hidden" style={{boxShadow:'0 0 40px hsl(200,100%,50%,0.08)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(200,100%,50%,0.04)] to-transparent rounded-3xl" />
            {category && (
              <span className="relative inline-block px-3 py-1 rounded-full bg-[hsl(200,100%,50%,0.1)] text-[hsl(200,100%,35%)] text-xs font-bold uppercase tracking-wider mb-4 border border-[hsl(200,100%,50%,0.3)]">
                {category}
              </span>
            )}
            <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
              {title}
            </h1>
            <p className="relative text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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
          <Button asChild variant="ghost" className="text-gray-500 hover:text-[hsl(200,100%,40%)] hover:bg-[hsl(200,100%,50%,0.08)] transition-all group">
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
