
import { getDemoDesigns } from '../admin/demo-designs/actions';
import DemoDesignsClient from './demo-designs-client';
import { Layers } from 'lucide-react';

export default async function DemoDesignsPage() {
  const designs = await getDemoDesigns();
  
  return (
    <>
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 text-center bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-12">
           <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium mb-4">
                <Layers className="inline-block w-4 h-4 mr-2" />
                Website Templates
            </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Demo Designs</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Explore our collection of pre-made website designs. Choose a template that fits your vision, and we'll customize it for you.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <DemoDesignsClient initialDesigns={designs} />
        </div>
      </section>
    </>
  );
}
