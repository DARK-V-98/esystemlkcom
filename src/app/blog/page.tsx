
import Link from 'next/link';
import { getFirestoreAdmin } from '@/firebase/admin';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    headerImageUrl?: string;
    createdAt: Timestamp;
    authorName: string;
}

async function getPosts() {
    const firestore = getFirestoreAdmin();
    const postsCollection = collection(firestore, 'blog');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Post));
    return postList;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="w-full py-20 md:py-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6 text-center bg-gray-100 border-gray-200  border border-gray-200 shadow-2xl rounded-3xl py-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Our Blog</h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Insights, tutorials, and updates from the eSystemLK team.
          </p>
        </div>
      </section>
      
      <section className="w-full pb-20 md:pb-28 bg-white text-black">
        <div className="container mx-auto px-4 md:px-6">
           {posts.length === 0 ? (
                <div className="text-center py-16 bg-card border-border rounded-3xl">
                    <h3 className="text-2xl font-bold">No Posts Yet</h3>
                    <p className="text-muted-foreground mt-2">Check back soon for our latest articles!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                           <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card border-border hover:border-primary rounded-2xl shadow-lg">
                                {post.headerImageUrl && (
                                    <div className="overflow-hidden">
                                        <img
                                            src={post.headerImageUrl}
                                            alt={post.title}
                                            width={600}
                                            height={400}
                                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-headline text-xl font-semibold mb-2 group-hover:text-primary">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                        {post.content.substring(0, 100)}...
                                    </p>
                                    <div className="text-xs text-muted-foreground mt-auto">
                                        <span>By {post.authorName}</span> • <span>{formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}</span>
                                    </div>
                                </CardContent>
                           </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </section>
    </>
  );
}




