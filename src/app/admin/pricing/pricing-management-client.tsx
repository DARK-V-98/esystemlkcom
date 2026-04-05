"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { updatePricingDocStatus, uploadPricingData, deletePricingDoc, updateServiceStatus, deleteServiceFromCategory, updatePricingItem, addPricingItem, type PricingItemPath, type PricingItemData, type AddItemContext, type AddItemData } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as Icons from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/hooks/use-auth';

// Define types for better readability
type Tier = { name: string; price: string };
type Addon = { name: string; price: string };
type Service = { name: string; tiers: Tier[]; addons?: Addon[]; enabled: boolean };
type PricingCategory = {
    id: string;
    icon: keyof typeof Icons;
    category: string;
    services: Service[];
    enabled: boolean;
};
type CommonAddons = {
    id: string;
    icon: keyof typeof Icons;
    category: string;
    items: Addon[];
    enabled: boolean;
};

const editFormSchema = z.object({
    name: z.string().optional(),
    price: z.string().optional(),
    category: z.string().optional(),
    icon: z.string().optional(),
});

const addFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    price: z.string().optional(),
    icon: z.string().optional(),
});

// Generic Icon component
const Icon = ({ name, className }: { name: keyof typeof Icons; className?: string }) => {
    const LucideIcon = Icons[name] as React.ElementType;
    if (!LucideIcon) return <Icons.Package className={className} />;
    return <LucideIcon className={className} />;
};

export default function PricingManagementClient() {
    const { firestore } = useAuthContext();
    const [pricingData, setPricingData] = useState<(PricingCategory | CommonAddons)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'service'; categoryId: string; serviceName?: string } | null>(null);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<{ path: PricingItemPath, data: any } | null>(null);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addItemContext, setAddItemContext] = useState<AddItemContext | null>(null);

    const editForm = useForm<z.infer<typeof editFormSchema>>({
        resolver: zodResolver(editFormSchema),
        defaultValues: { name: "", price: "", category: "", icon: "" },
    });
    
    const addForm = useForm<z.infer<typeof addFormSchema>>({
        resolver: zodResolver(addFormSchema),
        defaultValues: { name: "", price: "", icon: "" },
    });

    useEffect(() => {
        const q = query(collection(firestore, 'pricing'), orderBy('order'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PricingCategory | CommonAddons)[];
            setPricingData(data);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching pricing data:", error);
            toast({ title: "Error", description: "Could not fetch pricing data.", variant: "destructive" });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [firestore, toast]);

    const handleUpload = () => {
        startTransition(() => {
            uploadPricingData(firestore).then(result => {
                toast({
                    title: result.success ? 'Success' : 'Error',
                    description: result.message,
                    variant: result.success ? 'default' : 'destructive',
                });
            });
        });
    };
    
    const handleStatusChange = (type: 'category' | 'service', id: string, status: boolean, serviceName?: string) => {
        startTransition(() => {
            let promise;
            if (type === 'category') {
                promise = updatePricingDocStatus(firestore, id, status);
            } else if (type === 'service' && serviceName) {
                promise = updateServiceStatus(firestore, id, serviceName, status);
            }
            promise?.then(result => {
                toast({
                    title: result?.success ? 'Success' : 'Error',
                    description: result?.message,
                    variant: result?.success ? 'default' : 'destructive',
                });
            });
        });
    };
    
    const handleDelete = () => {
        if (!itemToDelete) return;
        
        startTransition(() => {
            let promise;
            if (itemToDelete.type === 'category') {
                promise = deletePricingDoc(firestore, itemToDelete.categoryId);
            } else if (itemToDelete.type === 'service' && itemToDelete.serviceName) {
                promise = deleteServiceFromCategory(firestore, itemToDelete.categoryId, itemToDelete.serviceName);
            }
            promise?.then(result => {
                toast({
                    title: result?.success ? 'Success' : 'Error',
                    description: result?.message,
                    variant: result?.success ? 'default' : 'destructive',
                });
                setItemToDelete(null);
            });
        });
    };

    const handleEditClick = (path: PricingItemPath, data: any) => {
        setCurrentItem({ path, data });
        editForm.reset({
            name: data.name,
            price: data.price,
            category: data.category,
            icon: data.icon
        });
        setIsEditDialogOpen(true);
    };
    
    const handleAddClick = (context: AddItemContext) => {
        setAddItemContext(context);
        addForm.reset();
        setIsAddDialogOpen(true);
    };

    const onEditSubmit = (values: z.infer<typeof editFormSchema>) => {
        if (!currentItem) return;

        startTransition(() => {
            const dataToUpdate: PricingItemData = {};
            const isCategory = !currentItem.path.serviceName && !currentItem.path.isCommonAddon;

            if (isCategory) {
                dataToUpdate.category = values.category;
                dataToUpdate.icon = values.icon;
            } else {
                dataToUpdate.name = values.name;
                if (values.price !== undefined) {
                    dataToUpdate.price = values.price;
                }
            }

            updatePricingItem(firestore, currentItem.path, dataToUpdate).then(result => {
                toast({
                    title: result.success ? 'Success' : 'Error',
                    description: result.message,
                    variant: result.success ? 'default' : 'destructive',
                });

                if (result.success) {
                    setIsEditDialogOpen(false);
                    setCurrentItem(null);
                }
            });
        });
    };

    const onAddSubmit = (values: z.infer<typeof addFormSchema>) => {
        if (!addItemContext) return;

        const priceRequired = ['tier', 'addon', 'commonAddon'].includes(addItemContext.type);
        if (priceRequired && (!values.price || values.price.trim() === '')) {
            addForm.setError('price', { type: 'manual', message: 'Price is required for this item type.' });
            return;
        }

        startTransition(() => {
            const data: AddItemData = { name: values.name! };
            if (priceRequired) data.price = values.price;
            if (addItemContext.type === 'category') data.icon = values.icon;
            
            addPricingItem(firestore, addItemContext, data).then(result => {
                toast({
                    title: result.success ? 'Success' : 'Error',
                    description: result.message,
                    variant: result.success ? 'default' : 'destructive',
                });

                if (result.success) {
                    setIsAddDialogOpen(false);
                    setAddItemContext(null);
                }
            });
        });
    };

    const renderSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
    
    const getAddDialogTitle = () => {
        if (!addItemContext) return '';
        switch (addItemContext.type) {
            case 'category': return 'Add New Category';
            case 'service': return 'Add New Service';
            case 'tier': return 'Add New Tier';
            case 'addon': return 'Add New Addon';
            case 'commonAddon': return 'Add New Common Addon';
            default: return 'Add New Item';
        }
    }

    return (
        <AlertDialog>
             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Make changes to the pricing item. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            {currentItem && (!currentItem.path.serviceName && !currentItem.path.isCommonAddon) ? (
                                <>
                                    <FormField control={editForm.control} name="category" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={editForm.control} name="icon" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon Name</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., ShoppingCart" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            ) : (
                                <>
                                    <FormField control={editForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {currentItem?.data.price !== undefined && (
                                        <FormField control={editForm.control} name="price" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                                </>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Changes'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{getAddDialogTitle()}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new item.
                        </DialogDescription>
                    </DialogHeader>
                     <Form {...addForm}>
                        <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                            <FormField control={addForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                           {addItemContext?.type === 'category' && (
                                <FormField control={addForm.control} name="icon" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon Name</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g., ShoppingCart" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                           )}
                           {['tier', 'addon', 'commonAddon'].includes(addItemContext?.type || '') && (
                                <FormField control={addForm.control} name="price" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g., Rs. 10,000" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                           )}
                           <DialogFooter>
                                <Button type="submit" disabled={isPending}>{isPending ? 'Adding...' : 'Add Item'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>


            <div className="space-y-8">
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected item from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                            {isPending ? 'Deleting...' : 'Continue'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>

                <Card className="bg-card border border-border rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Database Management</CardTitle>
                        <CardDescription>
                            Initialize the database with default data or add new top-level categories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleUpload} disabled={isPending}>
                            {isPending ? 'Uploading...' : 'Initialize/Upload Pricing Data'}
                        </Button>
                        <Button variant="outline" onClick={() => handleAddClick({type: 'category'})} disabled={isPending}>
                             <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </CardContent>
                </Card>

                {isLoading ? renderSkeleton() : (
                    <div className="space-y-6">
                        {pricingData.map((category) => (
                            <Card key={category.id} className="bg-card border-border rounded-2xl shadow-lg overflow-hidden">
                                <CardHeader className="bg-secondary/50 p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Icon name={category.icon} className="w-8 h-8 text-primary" />
                                            <CardTitle className="text-2xl">{category.category}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2 self-end md:self-center">
                                            {'services' in category && (
                                                <Button variant="outline" size="sm" onClick={() => handleAddClick({ type: 'service', categoryId: category.id })} disabled={isPending}>
                                                    <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Service
                                                </Button>
                                            )}
                                            {'items' in category && (
                                                <Button variant="outline" size="sm" onClick={() => handleAddClick({ type: 'commonAddon', categoryId: category.id })} disabled={isPending}>
                                                    <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Item
                                                </Button>
                                            )}
                                            <Switch checked={category.enabled} onCheckedChange={(checked) => handleStatusChange('category', category.id, checked)} disabled={isPending} />
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setItemToDelete({ type: 'category', categoryId: category.id })} disabled={isPending}>
                                                    <Icons.Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick({ categoryId: category.id }, category)} disabled={isPending}>
                                                <Icons.FileEdit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {'services' in category ? (
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.services.map((service, index) => (
                                                <AccordionItem key={index} value={`item-${index}`}>
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                                                        <AccordionTrigger className="flex-1 hover:no-underline pr-4 w-full text-left">
                                                            <span className="font-semibold text-lg text-primary/90">{service.name}</span>
                                                        </AccordionTrigger>
                                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                                            <Switch checked={service.enabled} onCheckedChange={(checked) => handleStatusChange('service', category.id, checked, service.name)} disabled={isPending} />
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setItemToDelete({ type: 'service', categoryId: category.id, serviceName: service.name })} disabled={isPending}>
                                                                    <Icons.Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick({ categoryId: category.id, serviceName: service.name }, service)} disabled={isPending}>
                                                                <Icons.FileEdit className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <AccordionContent className="pl-4 border-l-2 border-primary/20 ml-2">
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold mt-2">Tiers</h4>
                                                            {service.tiers.map((tier, tIndex) => (
                                                                <div key={tIndex} className="flex justify-between items-center text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary">
                                                                    <span>{tier.name}</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="font-mono text-foreground">{tier.price}</span>
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick({ categoryId: category.id, serviceName: service.name, tierName: tier.name }, tier)} disabled={isPending}><Icons.FileEdit className="w-3 h-3" /></Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {service.addons && service.addons.length > 0 && (
                                                                <>
                                                                    <h4 className="font-semibold mt-4">Add-ons</h4>
                                                                    {service.addons.map((addon, aIndex) => (
                                                                        <div key={aIndex} className="flex justify-between items-center text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary">
                                                                            <span>{addon.name}</span>
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-mono text-foreground">{addon.price}</span>
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick({ categoryId: category.id, serviceName: service.name, addonName: addon.name }, addon)} disabled={isPending}><Icons.FileEdit className="w-3 h-3" /></Button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            )}
                                                            <div className="flex gap-2 pt-4">
                                                                <Button size="sm" variant="outline" onClick={() => handleAddClick({type: 'tier', categoryId: category.id, serviceName: service.name})} disabled={isPending}>
                                                                    <Icons.Plus className="mr-1 h-4 w-4" /> Add Tier
                                                                </Button>
                                                                <Button size="sm" variant="outline" onClick={() => handleAddClick({type: 'addon', categoryId: category.id, serviceName: service.name})} disabled={isPending}>
                                                                     <Icons.Plus className="mr-1 h-4 w-4" /> Add Addon
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <div className="space-y-3">
                                            {(category as CommonAddons).items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary">
                                                    <span>{item.name}</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-mono text-foreground">{item.price}</span>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick({ categoryId: category.id, isCommonAddon: true, itemName: item.name }, item)} disabled={isPending}>
                                                            <Icons.FileEdit className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AlertDialog>
    );
}
