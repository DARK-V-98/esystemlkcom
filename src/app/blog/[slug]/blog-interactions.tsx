
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Loader2,
  Bookmark,
  MessageSquarePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/hooks/use-auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, deleteDoc, getDoc, getDocs, where, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import badgeData from '@/app/lib/badges.json';

interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorPhotoUrl: string;
    content: string;
    createdAt: any;
}

interface BlogPostInfo {
    title: string;
    slug: string;
}

export default function BlogInteractions({ postId, postInfo }: { postId: string, postInfo: BlogPostInfo }) {
  const { firestore, user } = useAuthContext();
  const { toast } = useToast();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useTransition();
  const [isCommenting, setIsCommenting] = useTransition();
  const [isBookmarking, setIsBookmarking] = useTransition();


  // Fetch likes and check if user has liked
  useEffect(() => {
    if (!firestore) return;
    const likesRef = collection(firestore, 'blog', postId, 'likes');

    const unsubscribe = onSnapshot(likesRef, async (snapshot) => {
        setLikes(snapshot.size);
        if (user) {
            const userLikeDoc = doc(likesRef, user.uid);
            const docSnap = await getDoc(userLikeDoc);
            setHasLiked(docSnap.exists());
        }
    });

    return () => unsubscribe();
  }, [firestore, postId, user]);

  // Fetch comments
  useEffect(() => {
    if (!firestore) return;
    const commentsRef = collection(firestore, 'blog', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [firestore, postId]);

  // Check if post is bookmarked
   useEffect(() => {
    if (!user || !firestore) return;
    const bookmarkRef = doc(firestore, 'users', user.uid, 'bookmarks', postId);
    const unsubscribe = onSnapshot(bookmarkRef, (doc) => {
      setIsBookmarked(doc.exists());
    });
    return () => unsubscribe();
  }, [firestore, postId, user]);
  
  const handleLike = () => {
    if (!user) {
        toast({ title: 'Please sign in to like posts.', variant: 'destructive'});
        return;
    }
    setIsLiking(async () => {
        const likeRef = doc(firestore, 'blog', postId, 'likes', user.uid);
        if (hasLiked) {
            await deleteDoc(likeRef);
        } else {
            await setDoc(likeRef, { userId: user.uid });
        }
    });
  }
  
  const handleBookmark = () => {
    if (!user) {
        toast({ title: 'Please sign in to bookmark posts.', variant: 'destructive'});
        return;
    }
    setIsBookmarking(async () => {
        const bookmarkRef = doc(firestore, 'users', user.uid, 'bookmarks', postId);
        if (isBookmarked) {
            await deleteDoc(bookmarkRef);
            toast({ title: "Bookmark removed." });
        } else {
            await setDoc(bookmarkRef, { 
                postId: postId,
                title: postInfo.title,
                slug: postInfo.slug,
                createdAt: serverTimestamp() 
            });
            toast({ title: "Post bookmarked!" });
        }
    });
  }

  const handleComment = async () => {
      if (!user || !firestore) {
        toast({ title: 'Please sign in to comment.', variant: 'destructive'});
        return;
      }
      if (newComment.trim().length < 3) {
          toast({ title: 'Comment is too short.', variant: 'destructive' });
          return;
      }
      
      setIsCommenting(async () => {
          const commentsRef = collection(firestore, 'blog', postId, 'comments');
          await addDoc(commentsRef, {
              authorId: user.uid,
              authorName: user.displayName,
              authorPhotoUrl: user.photoURL,
              content: newComment,
              createdAt: serverTimestamp(),
          });
          setNewComment('');
          
          // Check for and award "First Commenter" badge
          const allCommentsQuery = query(collection(firestore, 'blog'), where('authorId', '==', user.uid));
          const userCommentsSnapshot = await getDocs(allCommentsQuery);
          
          if(userCommentsSnapshot.size === 1) { // This is their first comment ever
            const badgeId = 'first-commenter';
            const badgeRef = doc(firestore, 'users', user.uid, 'badges', badgeId);
            const badgeSnap = await getDoc(badgeRef);
            if (!badgeSnap.exists()) {
                const firstCommenterBadge = (badgeData as any)[badgeId];
                await setDoc(badgeRef, {
                    name: firstCommenterBadge.name,
                    description: firstCommenterBadge.description,
                    icon: firstCommenterBadge.icon,
                    awardedAt: serverTimestamp(),
                });
                toast({
                    title: "Badge Unlocked!",
                    description: `You've earned the "${firstCommenterBadge.name}" badge.`,
                });
            }
          }
      });
  }
  
  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
      const url = window.location.href;
      const text = document.title;
      let shareUrl = '';
      
      switch(platform) {
          case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
              break;
          case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
              break;
          case 'linkedin':
              shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
              break;
      }
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-12">
        {/* Interaction Bar */}
        <div className="flex items-center justify-between border-t border-b border-border py-4">
            <div className="flex items-center gap-6">
                <Button variant="ghost" onClick={handleLike} disabled={isLiking} className="flex items-center gap-2 text-muted-foreground">
                    <Heart className={`w-5 h-5 ${hasLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span>{likes} Like{likes !== 1 && 's'}</span>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    <span>{comments.length} Comment{comments.length !== 1 && 's'}</span>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleBookmark} disabled={isBookmarking} className="flex items-center gap-2 text-muted-foreground">
                    {isBookmarking ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-primary fill-current' : ''}`} />
                    )}
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground">
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleShare('facebook')}>Facebook</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('twitter')}>Twitter</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('linkedin')}>LinkedIn</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        {/* Comments Section */}
        <Card className="bg-card border-border rounded-2xl">
            <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
            <CardContent className="space-y-8">
                {user ? (
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                             <Textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..." 
                                className="w-full bg-secondary"
                            />
                            <Button onClick={handleComment} disabled={isCommenting}>
                                {isCommenting ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Send className="w-4 h-4 mr-2" />}
                                Post Comment
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-secondary rounded-lg">
                        <p className="text-muted-foreground">
                            <Link href="/login" className="text-primary hover:underline">Sign in</Link> to post a comment.
                        </p>
                    </div>
                )}
                
                <div className="space-y-6">
                    {comments.map(comment => (
                         <div key={comment.id} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={comment.authorPhotoUrl} />
                                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-secondary p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-sm">{comment.authorName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                         </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
