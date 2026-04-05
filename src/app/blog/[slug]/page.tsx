
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, User } from 'lucide-react';
import BlogInteractions from './blog-interactions';
import Link from 'next/link';


export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    headerImageUrl?: string;
    createdAt: Timestamp;
    authorName: string;
    authorId: string;
}

async function getPost(slug: string): Promise<Post | null> {
    const firestore = getFirestoreAdmin();
    const postsCollection = collection(firestore, 'blog');
    const q = query(postsCollection, where('slug', '==', slug));
    const postSnapshot = await getDocs(q);
    
    if (postSnapshot.empty) {
        return null;
    }

    const postDoc = postSnapshot.docs[0];
    return {
        id: postDoc.id,
        ...postDoc.data()
    } as Post;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const postInfo = {
        title: post.title,
        slug: post.slug,
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
            <article className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm space-x-4">
                        <Link href={`/profile/${post.authorId}`} className="flex items-center gap-2 hover:text-primary">
                            <User className="w-4 h-4" />
                            <span>{post.authorName}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <time dateTime={post.createdAt.toDate().toISOString()}>
                                {format(post.createdAt.toDate(), 'MMMM d, yyyy')}
                            </time>
                        </div>
                    </div>
                </header>

                {post.headerImageUrl && (
                    <div className="mb-12">
                        <img
                            src={post.headerImageUrl}
                            alt={post.title}
                            width={1200}
                            height={630}
                            className="w-full h-auto rounded-2xl shadow-lg"
                        />
                    </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none mx-auto mb-16">
                   <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                
                <BlogInteractions postId={post.id} postInfo={postInfo} />
                
            </article>
        </div>
    );
}

// Generate static paths for blog posts
export async function generateStaticParams() {
  const firestore = getFirestoreAdmin();
  const postsCollection = collection(firestore, 'blog');
  const postSnapshot = await getDocs(postsCollection);
  return postSnapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}
