
"use client";

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addPortfolioItem, deletePortfolioItem, type PortfolioItem } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Plus, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const portfolioSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  link: z.string().url('Please enter a valid URL'),
  image: z.instanceof(File).refine(file => file.size > 0, 'An image is required.'),
});

export default function PortfolioManagementClient({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const form = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: '',
      link: '',
      image: new File([], ''),
    },
  });

  const imageFile = form.watch('image');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile && imageFile.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (values: z.infer<typeof portfolioSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('link', values.link);
    formData.append('image', values.image);

    startTransition(async () => {
      const result = await addPortfolioItem(formData);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        form.reset();
        setPreview(null);
        // We can't call getPortfolioItems here directly, so we'll just optimistically update UI
        // For a full refresh, a page reload or revalidation would be needed
        // For now, this just clears the form. Re-fetching will be handled by Next.js revalidation.
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
        const result = await deletePortfolioItem(itemToDelete.id, itemToDelete.imageUrl);
         if (result.success) {
            toast({ title: 'Success', description: result.message });
            setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
        setItemToDelete(null);
    });
  };

  return (
    <AlertDialog>
    <div className="space-y-8">
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Fill out the form to add a new project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl><Input placeholder="e.g., E-commerce Platform" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <img src={preview} alt="Image preview" width={200} height={150} className="rounded-lg border border-border" />
                </div>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : <><Plus className="mr-2 h-4 w-4" /> Add Project</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
          <CardDescription>The projects currently displayed on your portfolio page.</CardDescription>
        </CardHeader>
        <CardContent>
           {items.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No projects added yet.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                       <img src={item.imageUrl} alt={item.name} width={400} height={300} className="w-full h-40 object-cover" />
                       <CardContent className="p-4">
                           <h3 className="font-semibold truncate">{item.name}</h3>
                           <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all flex items-center gap-1">
                               <LinkIcon size={12}/>{item.link}
                           </a>
                           <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm" className="w-full mt-4" onClick={() => setItemToDelete(item)}>
                                 <Trash2 className="mr-2 h-4 w-4" /> Delete
                             </Button>
                           </AlertDialogTrigger>
                       </CardContent>
                    </Card>
                ))}
             </div>
           )}
        </CardContent>
      </Card>
    </div>
     <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project from your portfolio.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  );
}
