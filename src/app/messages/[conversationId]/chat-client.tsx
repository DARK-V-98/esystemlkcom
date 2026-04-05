
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/hooks/use-auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    createdAt: any;
}

export default function ChatClient({ conversationId }: { conversationId: string }) {
    const { user, firestore, loading: authLoading } = useAuthContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!firestore) return;
        const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [firestore, conversationId]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || isSending) return;

        setIsSending(true);
        const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
        const conversationRef = doc(firestore, 'conversations', conversationId);

        try {
            const messageData = {
                senderId: user.uid,
                senderName: user.displayName,
                text: newMessage,
                createdAt: serverTimestamp(),
            };
            
            await addDoc(messagesRef, messageData);
            
            await updateDoc(conversationRef, {
                lastMessage: {
                    text: newMessage,
                    senderId: user.uid,
                    createdAt: serverTimestamp(),
                },
                updatedAt: serverTimestamp(),
            });

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === user?.uid;
                    const showDate = index === 0 || new Date(msg.createdAt?.toDate()).toDateString() !== new Date(messages[index-1].createdAt?.toDate()).toDateString();

                    return (
                        <div key={msg.id}>
                            {showDate && msg.createdAt && (
                                <div className="text-center text-xs text-muted-foreground my-4">
                                    {format(msg.createdAt.toDate(), 'MMMM d, yyyy')}
                                </div>
                            )}
                            <div className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                                <div
                                    className={cn(
                                        'max-w-md p-3 rounded-2xl',
                                        isCurrentUser
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-secondary rounded-bl-none'
                                    )}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    <p className={cn('text-xs mt-1', isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                                        {msg.createdAt ? format(msg.createdAt.toDate(), 'p') : 'sending...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex items-center gap-4 bg-background">
                <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="resize-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    rows={1}
                />
                <Button type="submit" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
            </form>
        </div>
    );
}
