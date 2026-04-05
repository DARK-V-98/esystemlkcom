
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Twitter, Linkedin, Bookmark, Award, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import * as Icons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StartConversationButton } from './start-conversation-button';


interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    role: string;
    bio?: string;
    photoURL?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
}

interface Bookmark {
    id: string;
    title: string;
    slug: string;
    createdAt: Timestamp;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: keyof typeof Icons;
    awardedAt: Timestamp;
}

// Generic Icon component
const Icon = ({ name, className }: { name: keyof typeof Icons, className?: string }) => {
    const LucideIcon = Icons[name] as React.ElementType;
    if (!LucideIcon) return <Award className={className} />; // Fallback icon
    return <LucideIcon className={className} />;
};


async function getUserProfile(id: string): Promise<UserProfile | null> {
    const firestore = getFirestoreAdmin();
    const userRef = doc(firestore, 'users', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null;
    }
    return { uid: userSnap.id, ...userSnap.data() } as UserProfile;
}

async function getBookmarks(userId: string): Promise<Bookmark[]> {
    const firestore = getFirestoreAdmin();
    const bookmarksRef = collection(firestore, 'users', userId, 'bookmarks');
    const q = query(bookmarksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Bookmark));
}

async function getBadges(userId: string): Promise<Badge[]> {
    const firestore = getFirestoreAdmin();
    const badgesRef = collection(firestore, 'users', userId, 'badges');
    const q = query(badgesRef, orderBy('awardedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Badge));
}


export default async function ProfilePage({ params }: { params: { id: string } }) {
    const user = await getUserProfile(params.id);
    const bookmarks = await getBookmarks(params.id);
    const badges = await getBadges(params.id);

    if (!user) {
        notFound();
    }
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-32 w-32 mb-4 border-4 border-primary">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName} />
                                <AvatarFallback className="text-4xl">{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-3xl font-bold">{user.displayName}</h1>
                            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                            
                            <div className="flex gap-4 mt-4">
                                {user.twitter && (
                                    <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Twitter />
                                    </a>
                                )}
                                {user.github && (
                                     <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Github />
                                    </a>
                                )}
                                {user.linkedin && (
                                     <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Linkedin />
                                    </a>
                                )}
                            </div>
                            <StartConversationButton targetUser={{uid: user.uid, displayName: user.displayName, photoURL: user.photoURL || ''}} />
                        </CardContent>
                    </Card>

                    {user.bio && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{user.bio}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Bookmark className="w-5 h-5 text-primary" /> Bookmarked Posts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookmarks.length > 0 ? (
                                <ul className="space-y-4">
                                    {bookmarks.map(bookmark => (
                                        <li key={bookmark.id}>
                                            <Link href={`/blog/${bookmark.slug}`} className="group block p-4 rounded-lg hover:bg-secondary">
                                                <h4 className="font-semibold group-hover:text-primary">{bookmark.title}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Saved {formatDistanceToNow(bookmark.createdAt.toDate(), { addSuffix: true })}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No bookmarked posts yet.</p>
                            )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="w-5 h-5 text-primary" /> Badges
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {badges.length > 0 ? (
                                <TooltipProvider>
                                    <div className="flex flex-wrap gap-4">
                                        {badges.map(badge => (
                                            <Tooltip key={badge.id}>
                                                <TooltipTrigger>
                                                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center border-2 border-transparent hover:border-primary transition-colors">
                                                        <Icon name={badge.icon} className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-bold">{badge.name}</p>
                                                    <p className="text-sm">{badge.description}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Awarded {formatDistanceToNow(badge.awardedAt.toDate(), { addSuffix: true })}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </TooltipProvider>
                            ) : (
                               <p className="text-muted-foreground text-center py-8">No badges earned yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
