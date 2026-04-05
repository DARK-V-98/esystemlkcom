
import { Suspense } from 'react';
import { getPortfolioItems } from './actions';
import PortfolioManagementClient from './portfolio-management-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function PortfolioManagementSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
    );
}

export default async function AdminPortfolioPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Portfolio Management</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Add, view, and remove projects from your portfolio showcase.
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
      
      <Suspense fallback={<PortfolioManagementSkeleton />}>
        <PortfolioManagementClient initialItems={portfolioItems} />
      </Suspense>
    </div>
  );
}
