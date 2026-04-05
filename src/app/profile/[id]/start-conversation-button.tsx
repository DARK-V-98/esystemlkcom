
'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TargetUser {
    uid: string;
    displayName: string;
    photoURL: string;
}

export function StartConversationButton({ targetUser }: { targetUser: TargetUser }) {
    const { user, firestore } = useAuthContext();
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleStartConversation = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.uid === targetUser.uid) return;

        startTransition(async () => {
            const conversationId = [user.uid, targetUser.uid].sort().join('_');
            const conversationRef = doc(firestore, 'conversations', conversationId);

            try {
                const docSnap = await getDoc(conversationRef);
                if (!docSnap.exists()) {
                    await setDoc(conversationRef, {
                        participants: [user.uid, targetUser.uid],
                        participantInfo: {
                            [user.uid]: {
                                displayName: user.displayName,
                                photoURL: user.photoURL,
                            },
                            [targetUser.uid]: {
                                displayName: targetUser.displayName,
                                photoURL: targetUser.photoURL,
                            },
                        },
                        updatedAt: serverTimestamp(),
                        lastMessage: null,
                    });
                }
                router.push(`/messages/${conversationId}`);
            } catch (error) {
                console.error("Error starting conversation:", error);
                toast({ title: 'Error', description: 'Could not start conversation.', variant: 'destructive'});
            }
        });
    };
    
    if (!user || user.uid === targetUser.uid) return null;

    return (
        <Button onClick={handleStartConversation} disabled={isPending} className="mt-6 w-full">
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Message
        </Button>
    );
}
