
"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, Youtube } from 'lucide-react';
import { addPost, updatePost, deletePost, type Post } from './actions';
import { useAuthContext } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  headerImage: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BlogManagementClient({ initialPosts }: { initialPosts: Post[] }) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: '', title: '', content: '' },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to create a post.', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    if (values.headerImage) {
      formData.append('headerImage', values.headerImage);
    }
    
    startTransition(async () => {
      let result;
      if (isEditing && values.id) {
        formData.append('id', values.id);
        result = await updatePost(formData);
      } else {
        result = await addPost(formData);
      }
      
      toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
      
      if (result.success && result.posts) {
        setPosts(result.posts);
        form.reset({ id: '', title: '', content: '' });
        setIsEditing(false);
      }
    });
  };

  const handleEdit = (post: Post) => {
    setIsEditing(true);
    form.reset({
      id: post.id,
      title: post.title,
      content: post.content,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteConfirm = () => {
    if (!postToDelete) return;

    startTransition(async () => {
        const result = await deletePost(postToDelete.id, postToDelete.headerImageUrl);
        toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
        
        if (result.success && result.posts) {
            setPosts(result.posts);
        }
        setPostToDelete(null);
    });
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset({ id: '', title: '', content: '' });
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Blog Post' : 'Create New Post'}</CardTitle>
          <CardDescription>{isEditing ? 'Modify the details of your blog post.' : 'Fill out the form to add a new post to your blog.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your amazing blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Image (Optional)</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Markdown Supported)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your post content here..." {...field} rows={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Update Post' : 'Add Post'}
                  </Button>
                  {isEditing && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
          <CardDescription>Manage your existing blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
            {posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No posts published yet.</div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <Card key={post.id} className="flex flex-col md:flex-row items-start gap-6 p-4">
                           {post.headerImageUrl && (
                                <img src={post.headerImageUrl} alt={post.title} width={200} height={120} className="rounded-lg object-cover w-full md:w-48 h-auto"/>
                           )}
                           <div className="flex-1">
                               <Link href={`/blog/${post.slug}`} target="_blank">
                                <h3 className="font-bold text-lg hover:text-primary transition-colors">{post.title}</h3>
                               </Link>
                               <p className="text-sm text-muted-foreground mt-1">
                                By {post.authorName} • Published {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                               </p>
                           </div>
                           <div className="flex gap-2 self-start md:self-center">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(post)}><Edit className="w-4 h-4"/></Button>
                                <Button variant="destructive" size="icon" onClick={() => setPostToDelete(post)}><Trash2 className="w-4 h-4"/></Button>
                           </div>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the blog post.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
