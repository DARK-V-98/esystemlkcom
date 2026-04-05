
import ConversationsClient from './conversations-client';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-card border border-border rounded-3xl py-8 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Conversations</h1>
        <p className="text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto">
          View and manage your private messages with other users.
        </p>
      </div>

      <ConversationsClient />
    </div>
  );
}
