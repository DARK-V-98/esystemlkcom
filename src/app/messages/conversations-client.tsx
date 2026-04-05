
'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/hooks/use-auth';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface ParticipantInfo {
    displayName: string;
    photoURL: string;
}

interface Conversation {
    id: string;
    participantInfo: { [key: string]: ParticipantInfo };
    lastMessage?: {
        text: string;
        senderId: string;
        createdAt: Timestamp;
    };
    updatedAt: Timestamp;
}

export default function ConversationsClient() {
    const { user, firestore, loading: authLoading } = useAuthContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            if (!authLoading) setIsLoading(false);
            return;
        }

        const conversationsRef = collection(firestore, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', user.uid),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Conversation));
            setConversations(convos);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching conversations:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, firestore, authLoading]);

    if (isLoading || authLoading) {
        return <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    }

    if (!user) {
         return (
            <div className="text-center py-16 bg-card border-border rounded-3xl">
                <h3 className="text-2xl font-bold">Please Sign In</h3>
                <p className="text-muted-foreground mt-2">You need to be logged in to view your messages.</p>
            </div>
        );
    }
    
    if (conversations.length === 0) {
        return (
            <div className="text-center py-16 bg-card border-border rounded-3xl">
                <h3 className="text-2xl font-bold">No Conversations Yet</h3>
                <p className="text-muted-foreground mt-2">Start a conversation from a user's profile page.</p>
            </div>
        );
    }

    const getOtherParticipant = (convo: Conversation) => {
        const otherId = Object.keys(convo.participantInfo).find(id => id !== user.uid);
        return otherId ? convo.participantInfo[otherId] : { displayName: 'Unknown', photoURL: '' };
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-2">
                {conversations.map(convo => {
                    const otherUser = getOtherParticipant(convo);
                    return (
                        <Link href={`/messages/${convo.id}`} key={convo.id} className="block">
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={otherUser.photoURL} />
                                    <AvatarFallback>{otherUser.displayName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-semibold truncate">{otherUser.displayName}</h4>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {convo.lastMessage ? (
                                            <>
                                                {convo.lastMessage.senderId === user.uid && 'You: '}
                                                {convo.lastMessage.text}
                                            </>
                                        ) : 'Conversation started.'}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground self-start">
                                    {formatDistanceToNow(convo.updatedAt.toDate(), { addSuffix: true })}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </CardContent>
        </Card>
    );
}
