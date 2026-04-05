
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Transparent and competitive pricing for custom software, web development, and digital solutions at ESystemLk.",
};

import React from 'react';
import PricingClient from './pricing-client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirestoreAdmin } from '@/firebase/admin';

// Define types based on Firestore structure
type Tier = { name: string; price: string };
type Addon = { name: string; price: string };
type Service = { name: string; tiers: Tier[]; addons?: Addon[]; enabled: boolean };
type PricingCategory = {
    id: string;
    icon: string; // Will be string name from Firestore
    category: string;
    services: Service[];
    enabled: boolean;
};
type CommonAddons = {
    id: string;
    icon: string;
    category: string;
    items: Addon[];
    enabled: boolean;
};

async function getPricingData() {
    const firestore = getFirestoreAdmin();
    const pricingCollection = collection(firestore, 'pricing');
    const q = query(pricingCollection, orderBy('order'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return { pricingData: [], commonAddons: null };
    }

    const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PricingCategory | CommonAddons)[];
    
    const enabledData = allData.filter(category => category.enabled);

    const pricingData = enabledData
        .filter(d => d.id !== 'common-addons')
        .map(category => {
            if ('services' in category) {
                category.services = category.services.filter(service => service.enabled);
            }
            return category;
        })
        .filter(category => 'services' in category && category.services.length > 0) as PricingCategory[];

    const commonAddons = enabledData.find(d => d.id === 'common-addons') as CommonAddons | undefined;
    
    return { pricingData, commonAddons: commonAddons || null };
}

export default async function PricingPage() {
  const { pricingData, commonAddons } = await getPricingData();

  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Our Detailed Pricing</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Transparent, detailed pricing for every project scale. Find the perfect fit for your needs.
          </p>
        </div>
      </section>

      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <PricingClient pricingData={pricingData} commonAddons={commonAddons} />
        </div>
      </section>
    </>
  );
}
