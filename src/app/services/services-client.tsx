"use client";

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ServiceCategory = {
    icon: React.ReactNode;
    title: string;
    items: string[];
};

type ServicesClientProps = {
    serviceCategories: ServiceCategory[];
};

export default function ServicesClient({ serviceCategories }: ServicesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = ['All', ...serviceCategories.map(c => c.title)];

    const filteredServices = useMemo(() => {
        let services = [...serviceCategories];

        if (activeFilter !== 'All') {
            services = services.filter(category => category.title === activeFilter);
        }

        if (searchTerm.trim() !== '') {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            services = services
                .map(category => {
                    const filteredItems = category.items.filter(item =>
                        item.toLowerCase().includes(lowercasedSearchTerm)
                    );

                    if (filteredItems.length > 0 || category.title.toLowerCase().includes(lowercasedSearchTerm)) {
                        const itemsToShow = category.title.toLowerCase().includes(lowercasedSearchTerm) ? category.items : filteredItems;
                        return { ...category, items: itemsToShow };
                    }
                    return null;
                })
                .filter((category): category is ServiceCategory => category !== null);
        }

        return services;
    }, [searchTerm, activeFilter, serviceCategories]);

    return (
        <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 p-8 bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <Input
                        type="text"
                        placeholder="Search for a service (e.g., 'e-commerce', 'LMS')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 text-lg rounded-full bg-black/30 border-white/10 focus:border-white/50 focus:ring-0 transition-colors"
                    />
                    <Select onValueChange={setActiveFilter} defaultValue={activeFilter}>
                        <SelectTrigger className="h-12 text-lg rounded-full bg-black/30 border-white/10 focus:border-white/50 focus:ring-0 transition-colors">
                            <SelectValue placeholder="Filter by category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <Card className="mb-12 bg-primary/10 backdrop-blur-lg border border-primary/20 shadow-2xl rounded-3xl">
                <CardContent className="p-8 flex items-center gap-6">
                    <Info className="w-10 h-10 text-primary shrink-0" />
                    <div>
                        <h3 className="font-headline text-xl font-bold mb-2 text-primary">Need a Custom Package?</h3>
                        <p className="text-muted-foreground">
                            The services listed are just a starting point. We specialize in creating custom solutions tailored to your specific needs and budget. 
                            <Link href="/contact" className="font-semibold text-primary hover:underline ml-1">Contact us</Link> to discuss your project!
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-12">
                {filteredServices.length > 0 ? (
                    filteredServices.map((category, index) => (
                        <div key={index} className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
                            <div className="flex items-center gap-6 mb-8">
                                {category.icon}
                                <h2 className="font-headline text-3xl font-bold">{category.title}</h2>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                {category.items.map(item => (
                                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl">
                        <h3 className="font-headline text-2xl font-bold">No Services Found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
