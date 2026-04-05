
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogManagementClient from './blog-management-client';
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    headerImageUrl?: string;
    createdAt: any;
    updatedAt?: any;
    authorId: string;
    authorName: string;
}

async function getPosts() {
    const firestore = getFirestoreAdmin();
    const postsCollection = collection(firestore, 'blog');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
             updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        } as Post;
    });
    return postList;
}


export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-card border border-border rounded-3xl py-8 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto">
          Create, edit, and manage your blog posts from here.
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

      <BlogManagementClient initialPosts={posts} />
    </div>
  );
}
