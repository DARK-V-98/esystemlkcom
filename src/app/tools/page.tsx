
import ToolsClient from './tools-client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

export default function ToolsPage() {
  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium mb-4">
                Productivity Suite
            </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Tools Suite</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            A suite of fast, free, and secure tools that run 100% inside your browser. No uploads, no waiting.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
            <Alert className="mb-12 bg-primary/5 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="font-bold text-primary">Constant Improvement!</AlertTitle>
                <AlertDescription className="text-gray-600">
                    Heads up! We're busy upgrading some of our tools to bring you even better versions in the future. While we work our magic, you might notice some features are simplified for now. Thanks for your patience—we're excited to give you the best experience possible, completely free!
                </AlertDescription>
            </Alert>
          <ToolsClient />
        </div>
      </section>
    </>
  );
}





