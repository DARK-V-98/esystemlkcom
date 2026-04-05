
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Info, PlusCircle } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Icons from 'lucide-react';


// Define types for the props
type Tier = { name: string; price: string };
type Addon = { name: string; price: string };
type Service = { name: string; tiers: Tier[]; addons?: Addon[] };
type PricingCategory = {
    id: string;
    icon: string;
    category: string;
    services: Service[];
};
type CommonAddons = {
    icon: string;
    category: string;
    items: { name: string; price: string }[];
};

type PricingClientProps = {
    pricingData: PricingCategory[];
    commonAddons: CommonAddons | null;
};

// Generic Icon component
const Icon = ({ name, className }: { name: string; className?: string }) => {
    const LucideIcon = Icons[name as keyof typeof Icons] as React.ElementType;
    if (!LucideIcon) return <Icons.Package className={className} />;
    return <LucideIcon className={className} />;
};

export default function PricingClient({ pricingData, commonAddons }: PricingClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = ['All', ...pricingData.map(c => c.category)];

    const filteredPricingData = useMemo(() => {
        let data = [...pricingData];

        if (activeFilter !== 'All') {
            data = data.filter(category => category.category === activeFilter);
        }

        if (searchTerm.trim() !== '') {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            data = data
                .map(category => {
                    if (category.category.toLowerCase().includes(lowercasedSearchTerm)) {
                        return category;
                    }

                    const filteredServices = category.services
                        .map(service => {
                            if (service.name.toLowerCase().includes(lowercasedSearchTerm)) {
                                return service;
                            }
                            
                            const filteredTiers = service.tiers.filter(tier => 
                                tier.name.toLowerCase().includes(lowercasedSearchTerm)
                            );

                            if (filteredTiers.length > 0) {
                                return { ...service, tiers: filteredTiers };
                            }
                            return null;
                        })
                        .filter((service): service is Service => service !== null);

                    if (filteredServices.length > 0) {
                        return { ...category, services: filteredServices };
                    }
                    
                    return null;
                })
                .filter((category): category is PricingCategory => category !== null);
        }

        return data;
    }, [searchTerm, activeFilter, pricingData]);

    return (
        <div className="space-y-12">
            <div className="mb-12 p-6 md:p-8 bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
                    <Input
                        type="text"
                        placeholder="Search for a service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 text-base md:text-lg rounded-full bg-black/30 border-white/10 focus:border-white/50 focus:ring-0 transition-colors"
                    />
                    <Select onValueChange={setActiveFilter} defaultValue={activeFilter}>
                        <SelectTrigger className="h-12 text-base md:text-lg rounded-full bg-black/30 border-white/10 focus:border-white/50 focus:ring-0 transition-colors">
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

            <Card className="bg-primary/10 backdrop-blur-lg border border-primary/20 shadow-2xl rounded-3xl">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <Info className="w-10 h-10 text-primary shrink-0" />
                    <div>
                        <h3 className="font-headline text-xl font-bold mb-2 text-primary">Looking for a Custom or Budget-Friendly Package?</h3>
                        <p className="text-muted-foreground">
                            Our pricing is flexible. If you don't see a package that fits, or if you have specific budget requirements, please don't hesitate to reach out. We excel at crafting custom solutions.
                            <Link href="/contact" className="font-semibold text-primary hover:underline ml-1">Let's discuss your project!</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {filteredPricingData.length > 0 ? (
                filteredPricingData.map((categoryData) => (
                    <Card key={categoryData.id} className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 md:p-8">
                            <div className="flex items-center gap-4">
                                <Icon name={categoryData.icon} className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                                <CardTitle className="font-headline text-2xl md:text-3xl font-bold">{categoryData.category}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                            <div className="space-y-10">
                                {categoryData.services.map((service, sIndex) => (
                                    <div key={sIndex}>
                                        <h3 className="font-headline text-xl font-semibold mb-4 text-primary">{service.name}</h3>
                                        <ul className="space-y-3 mb-4">
                                            {service.tiers.map((tier, tIndex) => (
                                                <li key={tIndex} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-muted-foreground border-b border-white/10 pb-3">
                                                    <span>{tier.name}</span>
                                                    <span className="font-semibold text-foreground text-left sm:text-right">{tier.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {service.addons && service.addons.length > 0 && (
                                            <>
                                                <h4 className="text-md font-semibold mt-6 mb-3 flex items-center gap-2 text-primary/80"><PlusCircle className="w-4 h-4" /> Add-ons</h4>
                                                <ul className="space-y-2">
                                                    {service.addons.map((addon, aIndex) => (
                                                       <li key={aIndex} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-muted-foreground border-b border-dashed border-white/10 pb-2 text-sm">
                                                           <span>{addon.name}</span>
                                                           <span className="font-semibold text-foreground/80 text-left sm:text-right">{addon.price}</span>
                                                       </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {sIndex < categoryData.services.length - 1 && <Separator className="mt-10 bg-white/10" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-16 bg-black/30 backdrop-blur-lg border border-white/10 rounded-3xl">
                    <h3 className="font-headline text-2xl font-bold">No Pricing Found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}

            {commonAddons && (
                 <Card className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 md:p-8">
                        <div className="flex items-center gap-4">
                            <Icon name={commonAddons.icon} className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            <CardTitle className="font-headline text-2xl md:text-3xl font-bold">{commonAddons.category}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                         <ul className="space-y-3">
                            {commonAddons.items.map((item, iIndex) => (
                               <li key={iIndex} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-muted-foreground border-b border-white/10 pb-3">
                                   <span>{item.name}</span>
                                   <span className="font-semibold text-foreground text-left sm:text-right">{item.price}</span>
                               </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
