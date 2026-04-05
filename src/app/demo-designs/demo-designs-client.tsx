
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Search } from 'lucide-react';
import type { DemoDesign } from '../admin/demo-designs/actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DemoDesignsClient({ initialDesigns }: { initialDesigns: DemoDesign[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const allCategories = initialDesigns.map(d => d.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [initialDesigns]);

  const filteredDesigns = useMemo(() => {
    return initialDesigns.filter(design => {
      const matchesCategory = activeCategory === 'All' || design.category === activeCategory;
      const matchesSearch = searchTerm.trim() === '' || 
                            design.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            design.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialDesigns, activeCategory, searchTerm]);

  return (
    <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center sticky top-24 z-20 p-4 bg-background/80 backdrop-blur-md rounded-full border border-border max-w-3xl mx-auto">
            <div className="relative w-full md:w-auto md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search designs..."
                    className="pl-10 h-11 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-shrink-0 flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                    <Button 
                        key={category} 
                        variant={activeCategory === category ? 'default' : 'outline'}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>

      {filteredDesigns.length === 0 ? (
        <div className="text-center py-16 bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl">
          <h3 className="font-headline text-2xl font-bold">No Designs Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => (
            <a 
              href={design.demoUrl} 
              key={design.id} 
              target="_blank"
              rel="noopener noreferrer" 
              className="block group"
            >
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-white/30 rounded-2xl shadow-lg">
                <div className="overflow-hidden relative">
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      width={600}
                      height={400}
                      className="w-full h-56 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <p className="text-sm font-medium text-primary mb-1">{design.category}</p>
                  <h3 className="font-headline text-xl font-semibold mb-3">{design.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                    {design.technologies.map(tech => (
                        <Badge key={tech} variant="secondary" className="font-normal">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
