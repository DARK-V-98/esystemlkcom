
import ChatClient from './chat-client';
import { getFirestoreAdmin } from '@/firebase/admin';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin-app';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Conversation {
    id: string;
    participants: string[];
    participantInfo: {
        [key: string]: {
            displayName: string;
            photoURL: string;
        };
    };
}

async function getConversation(conversationId: string): Promise<Conversation | null> {
    const firestore = getFirestoreAdmin();
    const conversationRef = doc(firestore, 'conversations', conversationId);
    const snap = await getDoc(conversationRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Conversation;
}

async function getCurrentUserId() {
    const sessionCookie = cookies().get('session')?.value || '';
    if (!sessionCookie) return null;
    try {
        const decodedClaims = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
        return decodedClaims.uid;
    } catch {
        return null;
    }
}

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
    const conversation = await getConversation(params.conversationId);
    const currentUserId = await getCurrentUserId();
    
    if (!conversation || !currentUserId || !conversation.participants.includes(currentUserId)) {
        notFound();
    }
    
    const otherUserId = conversation.participants.find((p: string) => p !== currentUserId);
    if (!otherUserId) {
        notFound();
    }
    const otherUserInfo = conversation.participantInfo[otherUserId];

    return (
        <div className="container mx-auto h-[calc(100vh-5rem)] flex flex-col p-4">
           <Card className="flex-shrink-0 mb-4">
                <CardHeader className="flex flex-row items-center gap-4 p-3">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/messages">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Avatar>
                        <AvatarImage src={otherUserInfo.photoURL} />
                        <AvatarFallback>{otherUserInfo.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <h1 className="font-semibold text-lg">{otherUserInfo.displayName}</h1>
                </CardHeader>
           </Card>
           <ChatClient conversationId={params.conversationId} />
        </div>
    );
}
