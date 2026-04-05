
import MessagesClient from './messages-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminMessagesPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-card border border-border rounded-3xl py-8 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto">
          Review and manage inquiries submitted through your website's contact form.
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

      <MessagesClient />
    </div>
  );
}
