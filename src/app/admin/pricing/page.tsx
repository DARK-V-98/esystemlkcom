
import PricingManagementClient from './pricing-management-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminPricingPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-card border border-border rounded-3xl py-8 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pricing Management</h1>
        <p className="text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto">
            Manage your service pricing, packages, and add-ons. Initialize, update, or disable pricing tiers from this central hub.
        </p>
      </div>

      <div className="mb-8">
        <Button asChild variant="outline">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
      </div>

      <PricingManagementClient />
    </div>
  );
}
