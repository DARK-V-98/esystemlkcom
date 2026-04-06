
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Download, Eye, Calendar as CalendarIcon, ChevronsUpDown, Check, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types from pricing page
type Tier = { name: string; price: string };
type Addon = { name: string; price: string };
type Service = { name: string; tiers: Tier[]; addons?: Addon[]; enabled: boolean };
type PricingCategory = { id: string; category: string; services: Service[]; enabled: boolean };
type CommonAddons = { id: string; items: Addon[]; enabled: boolean };

interface IQuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface IQuotationForm {
  clientName: string;
  companyName: string;
  phoneNumber: string;
  emailAddress: string;
  clientAddress: string;
  quotationNumber: string;
  date: Date;
  expiryDate: Date;
  items: IQuotationItem[];
  optionalItems: IQuotationItem[];
  discount: number;
  tax: number;
  advancePaid: number;
  isFullyPaid: boolean;
}

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

function parsePrice(priceString: string): number {
    if (!priceString) return 0;
    // Removes "Rs.", commas, and any non-numeric characters except for the decimal point.
    const sanitizedString = priceString.replace(/Rs\.|,|\s/g, '').match(/[\d.]+/g)?.join('') || '0';
    return parseFloat(sanitizedString) || 0;
}

export default function QuotationClient() {
  const { firestore } = useAuthContext();
  const [isClient, setIsClient] = useState(false);
  const [pricingData, setPricingData] = useState<(PricingCategory | CommonAddons)[]>([]);
  const [isPricingLoading, setIsPricingLoading] = useState(true);
  const [isCommandPopoverOpen, setIsCommandPopoverOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const router = useRouter();

  const { register, control, handleSubmit, watch, setValue } = useForm<IQuotationForm>({
    defaultValues: {
      clientName: '',
      companyName: '',
      phoneNumber: '',
      emailAddress: '',
      clientAddress: '',
      date: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      optionalItems: [],
      discount: 0,
      tax: 0,
      advancePaid: 0,
      isFullyPaid: false,
    },
  });

  useEffect(() => {
    async function getPricing() {
        if (!firestore) {
            setIsPricingLoading(false);
            return;
        }
        const pricingCollection = collection(firestore, 'pricing');
        const q = query(pricingCollection, orderBy('order'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            setIsPricingLoading(false);
            return;
        }

        const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PricingCategory | CommonAddons)[];
        setPricingData(allData);
        setIsPricingLoading(false);
    }
    getPricing();
  }, [firestore]);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { fields: optionalFields, append: appendOptional, remove: removeOptional } = useFieldArray({ control, name: 'optionalItems' });

  const watchedItems = watch('items');
  const watchedOptionalItems = watch('optionalItems');
  const discount = watch('discount');
  const tax = watch('tax');
  const advancePaid = watch('advancePaid');
  const isFullyPaid = watch('isFullyPaid');

  const subtotal = watchedItems.reduce((acc, item) => (acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0);
  const discountAmount = (subtotal * (Number(discount) || 0)) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * (Number(tax) || 0)) / 100;
  const finalTotal = subtotalAfterDiscount + taxAmount;

  useEffect(() => {
    if (isFullyPaid) {
        setValue('advancePaid', finalTotal);
    }
  }, [isFullyPaid, finalTotal, setValue]);

  const balanceDue = finalTotal - (Number(advancePaid) || 0);

  useEffect(() => {
    setIsClient(true);
    setValue('quotationNumber', `QUO-${Date.now()}`);
  }, [setValue]);

  const onCommandSelect = (item: { name: string, price: string }) => {
    const price = parsePrice(item.price);
    append({ description: item.name, quantity: 1, unitPrice: price });
    setIsCommandPopoverOpen(false);
  }

  const generatePDF = (mode: 'download' | 'preview') => {
    const doc = new jsPDF();
    const formData = watch();
    const img = document.getElementById('logo-for-pdf') as HTMLImageElement;
    if (img) doc.addImage(img, 'PNG', 14, 12, 30, 30);
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('eSystemLK', 150, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Phone: +94 76 571 1396', 150, 26);
    doc.text('Website: www.esystemlk.xyz', 150, 31);
    doc.text('Email: esystemlk@gmail.com', 150, 36);

    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 14, 60);

    let yPos = 80;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.clientName, 14, yPos); yPos += 5;
    if(formData.companyName) { doc.text(formData.companyName, 14, yPos); yPos += 5; }
    if(formData.clientAddress) { doc.text(formData.clientAddress, 14, yPos); yPos += 5; }
    doc.text(formData.phoneNumber, 14, yPos); yPos += 5;
    if(formData.emailAddress) doc.text(formData.emailAddress, 14, yPos);

    doc.setFont('helvetica', 'bold');
    doc.text('Quotation #:', 130, 75);
    doc.text('Date:', 130, 80);
    doc.text('Expiry Date:', 130, 85);
    if(formData.isFullyPaid) doc.text('Status:', 130, 90);

    doc.setFont('helvetica', 'normal');
    doc.text(formData.quotationNumber, 160, 75);
    doc.text(format(formData.date, 'PPP'), 160, 80);
    doc.text(format(formData.expiryDate, 'PPP'), 160, 85);
    if (formData.isFullyPaid) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 150, 0);
        doc.text('Paid in Full', 160, 90);
        doc.setTextColor(0, 0, 0);
    }
    
    const tableColumn = ["#", "Description", "Qty", "Unit Price", "Total"];
    const tableRows = formData.items.map((item, index) => [index + 1, item.description, (Number(item.quantity) || 0).toString(), `Rs. ${(Number(item.unitPrice) || 0).toFixed(2)}`, `Rs. ${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}`]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 110, theme: 'striped', headStyles: { fillColor: [0, 87, 163] } });
    
    let finalY = (doc as any).lastAutoTable.finalY;
    const summaryX = 130;
    let summaryY = finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', summaryX, summaryY);
    doc.text(`Discount (${formData.discount}%):`, summaryX, summaryY + 7);
    doc.text(`Tax (${formData.tax}%):`, summaryX, summaryY + 14);
    doc.text('Total:', summaryX, summaryY + 21);
    const advancePaidAmount = Number(formData.advancePaid) || 0;
    if (advancePaidAmount > 0) {
        doc.text('Advance Paid:', summaryX, summaryY + 28);
        doc.setFontSize(14);
        doc.text('Balance Due:', summaryX, summaryY + 38);
    } else {
        doc.setFontSize(14);
        doc.text('Total Due:', summaryX, summaryY + 28);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 195, summaryY, { align: 'right' });
    doc.text(`- Rs. ${discountAmount.toFixed(2)}`, 195, summaryY + 7, { align: 'right' });
    doc.text(`+ Rs. ${taxAmount.toFixed(2)}`, 195, summaryY + 14, { align: 'right' });
    doc.text(`Rs. ${finalTotal.toFixed(2)}`, 195, summaryY + 21, { align: 'right' });
    doc.setFont('helvetica', 'bold');

    if (advancePaidAmount > 0) {
        doc.setFontSize(12);
        doc.text(`- Rs. ${advancePaidAmount.toFixed(2)}`, 195, summaryY + 28, { align: 'right' });
        doc.setFontSize(14);
        doc.text(`Rs. ${balanceDue.toFixed(2)}`, 195, summaryY + 38, { align: 'right' });
        finalY = summaryY + 38;
    } else {
        doc.setFontSize(14);
        doc.text(`Rs. ${finalTotal.toFixed(2)}`, 195, summaryY + 28, { align: 'right' });
        finalY = summaryY + 28;
    }

    if (formData.optionalItems.length > 0 && formData.optionalItems[0].description) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Optional Services / Add-ons', 14, finalY + 15);
        const optionalTableRows = formData.optionalItems.map((item, index) => [index + 1, item.description, (Number(item.quantity) || 0).toString(), `Rs. ${(Number(item.unitPrice) || 0).toFixed(2)}`, `Rs. ${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}`]);
        doc.autoTable({ head: [tableColumn], body: optionalTableRows, startY: finalY + 20, theme: 'striped', headStyles: { fillColor: [80, 80, 80] } });
    }

    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, 280);
    doc.text("eSystemLK - Clarity in Code. Power in Design.", 105, 290, { align: 'center' });

    if (mode === 'preview') {
      doc.output('dataurlnewwindow');
    } else {
      doc.save(`Quotation-${formData.quotationNumber}.pdf`);
    }
  };

  const createOrder = async () => {
    if (!firestore) {
        toast.error('Connection to database failed. Please try again.');
        return;
    }

    const formData = watch();
    if (!formData.clientName || !formData.emailAddress) {
        toast.error('Client name and email are required to create a live order.');
        return;
    }

    setIsCreatingOrder(true);
    try {
        const accessKey = `ESL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        const orderData = {
            clientName: formData.clientName,
            companyName: formData.companyName || '',
            email: formData.emailAddress,
            phone: formData.phoneNumber,
            orderNumber: formData.quotationNumber,
            projectName: `${formData.clientName}'s Project`,
            accessKey: accessKey,
            status: 'pending',
            progress: 10,
            currentStage: 'Planning & Requirements',
            stages: [
                { name: 'Planning & Requirements', status: 'active', description: 'Defining project scope and features.' },
                { name: 'UI/UX Design', status: 'pending', description: 'Creating visual mockups and user flow.' },
                { name: 'Core Development', status: 'pending', description: 'Building the backend and frontend systems.' },
                { name: 'Testing & Optimization', status: 'pending', description: 'Quality assurance and performance tuning.' },
                { name: 'Deployment & Launch', status: 'pending', description: 'Going live on production servers.' }
            ],
            devLink: '',
            images: [],
            totalAmount: Number(finalTotal) || 0,
            advancePaid: Number(formData.advancePaid) || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(firestore, 'orders'), orderData);
        toast.success('Order created successfully!');
        toast.info(`Access Key: ${accessKey}`, { duration: 10000 });
        router.push(`/admin/orders/${docRef.id}`);
    } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Failed to create order. Please check console for details.');
    } finally {
        setIsCreatingOrder(false);
    }
  };

  if (!isClient) return null;

  return (
    <form onSubmit={handleSubmit((data) => generatePDF('download'))}>
        <div style={{ display: 'none' }}>
            <Image id="logo-for-pdf" src="/logo.png" alt="logo" width={100} height={100} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border border-border rounded-2xl shadow-lg">
                    <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Client Full Name" {...register('clientName')} required />
                        <Input placeholder="Company Name (Optional)" {...register('companyName')} />
                        <Input placeholder="Phone Number" {...register('phoneNumber')} required />
                        <Input type="email" placeholder="Email Address" {...register('emailAddress')} required />
                        <Textarea placeholder="Client Address (Optional)" {...register('clientAddress')} className="md:col-span-2" />
                    </CardContent>
                </Card>
                <Card className="bg-card border border-border rounded-2xl shadow-lg">
                    <CardHeader><CardTitle>Quotation Details</CardTitle></CardHeader>
                    <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                         <Input readOnly placeholder="Quotation Number" {...register('quotationNumber')} />
                         <Controller control={control} name="date" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />
                         <Controller control={control} name="expiryDate" render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick an expiry date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card className="bg-card border border-border rounded-2xl shadow-lg">
                    <CardHeader><CardTitle>Summary & Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Discount Amount</span><span className="font-semibold">- Rs. {discountAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Tax Amount</span><span className="font-semibold">+ Rs. {taxAmount.toFixed(2)}</span></div>
                        <div className="border-t border-border my-2"></div>
                        <div className="flex justify-between items-center text-lg"><span className="font-bold">Total</span><span className="font-bold">Rs. {finalTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Advance Paid</span><span className="font-semibold">- Rs. {(Number(advancePaid) || 0).toFixed(2)}</span></div>
                        <div className="border-t border-border my-2"></div>
                        <div className={cn("flex justify-between items-center text-xl", isFullyPaid && "text-green-500")}>
                           <span className="font-bold">Balance Due</span>
                           <span className="font-bold">Rs. {balanceDue.toFixed(2)}</span>
                        </div>
                         <div className="pt-4 space-y-2">
                           <Button id="btn-preview-pdf" type="button" variant="outline" className="w-full" onClick={() => generatePDF('preview')}><Eye className="mr-2 h-4 w-4" /> Preview PDF</Button>
                           <Button id="btn-download-pdf" type="submit" className="w-full"><Download className="mr-2 h-4 w-4" /> Generate & Download PDF</Button>
                           <div className="pt-2 border-t border-border mt-2">
                                <Button 
                                    id="btn-create-live-order"
                                    type="button" 
                                    onClick={createOrder} 
                                    disabled={isCreatingOrder}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                                >
                                    {isCreatingOrder ? 'Creating Order...' : (
                                        <><LayoutDashboard className="mr-2 h-4 w-4" /> CREATE LIVE ORDER</>
                                    )}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-2 italic px-4">
                                    Converts this quotation into a live project that the client can track in real-time.
                                </p>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="mt-8">
            <Card className="bg-card border border-border rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Products / Services</CardTitle>
                    <CardDescription>Add items manually or select from your existing services list.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-2">Description</th>
                                    <th className="text-left p-2 w-28">Quantity</th>
                                    <th className="text-left p-2 w-40">Unit Price (Rs)</th>
                                    <th className="text-left p-2 w-40">Line Total (Rs)</th>
                                    <th className="w-12 p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((item, index) => (
                                    <tr key={item.id} className="border-b border-border">
                                        <td><Input type="text" placeholder="Item Description" {...register(`items.${index}.description`)} className="my-1" required /></td>
                                        <td><Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="my-1" min="1" required /></td>
                                        <td><Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="my-1" min="0" required /></td>
                                        <td><Input readOnly value={((Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.unitPrice) || 0)).toFixed(2)} className="my-1 bg-secondary" /></td>
                                        <td><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item Manually
                        </Button>
                        {isPricingLoading ? (
                             <Skeleton className="h-10 w-48" />
                        ) : (
                            <Popover open={isCommandPopoverOpen} onOpenChange={setIsCommandPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={isCommandPopoverOpen} className="w-[200px] justify-between">
                                        Add From Services
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search service..." />
                                        <CommandEmpty>No service found.</CommandEmpty>
                                        <CommandGroup>
                                            {pricingData.map((category) => (
                                                'services' in category && category.enabled && category.services.map(service => (
                                                    service.enabled && (
                                                        <React.Fragment key={service.name}>
                                                            {service.tiers.map(tier => (
                                                                <CommandItem key={tier.name} onSelect={() => onCommandSelect(tier)}>
                                                                    <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                                                                    {`${service.name} - ${tier.name}`}
                                                                </CommandItem>
                                                            ))}
                                                            {service.addons?.map(addon => (
                                                                 <CommandItem key={addon.name} onSelect={() => onCommandSelect(addon)}>
                                                                    <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                                                                    {`${service.name} - ${addon.name}`}
                                                                </CommandItem>
                                                            ))}
                                                        </React.Fragment>
                                                    )
                                                ))
                                            ))}
                                             {pricingData.filter(c => c.id === 'common-addons' && c.enabled).flatMap(c => 'items' in c ? c.items : []).map(item => (
                                                <CommandItem key={item.name} onSelect={() => onCommandSelect(item)}>
                                                    <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                                                    {item.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="mt-8">
            <Card className="bg-card border border-border rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Optional Services / Add-ons</CardTitle>
                    <CardDescription>Add any optional items for this quotation. These items do not affect the main total.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-2">Description</th>
                                    <th className="text-left p-2 w-28">Quantity</th>
                                    <th className="text-left p-2 w-40">Unit Price (Rs)</th>
                                    <th className="text-left p-2 w-40">Line Total (Rs)</th>
                                    <th className="w-12 p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {optionalFields.map((item, index) => (
                                    <tr key={item.id} className="border-b border-border">
                                        <td><Input type="text" placeholder="Optional Item Description" {...register(`optionalItems.${index}.description`)} className="my-1" /></td>
                                        <td><Input type="number" {...register(`optionalItems.${index}.quantity`, { valueAsNumber: true })} className="my-1" min="1" /></td>
                                        <td><Input type="number" step="0.01" {...register(`optionalItems.${index}.unitPrice`, { valueAsNumber: true })} className="my-1" min="0" /></td>
                                        <td><Input readOnly value={((Number(watchedOptionalItems[index]?.quantity) || 0) * (Number(watchedOptionalItems[index]?.unitPrice) || 0)).toFixed(2)} className="my-1 bg-secondary" /></td>
                                        <td><Button type="button" variant="ghost" size="icon" onClick={() => removeOptional(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button type="button" variant="outline" onClick={() => appendOptional({ description: '', quantity: 1, unitPrice: 0 })} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add Optional Item</Button>
                </CardContent>
            </Card>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card className="bg-card border border-border rounded-2xl shadow-lg lg:col-start-2 xl:col-start-3">
                 <CardHeader><CardTitle>Totals & Payment</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <div><Label className="text-sm font-medium">Discount (%)</Label><Input type="number" step="0.01" placeholder="e.g. 5" {...register('discount', { valueAsNumber: true })} min="0" /></div>
                    <div><Label className="text-sm font-medium">Tax (%)</Label><Input type="number" step="0.01" placeholder="e.g. 10" {...register('tax', { valueAsNumber: true })} min="0" /></div>
                    <div><Label className="text-sm font-medium">Advance Paid (Rs)</Label><Input type="number" step="0.01" placeholder="e.g. 10000" {...register('advancePaid', { valueAsNumber: true })} min="0" disabled={isFullyPaid} /></div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Controller control={control} name="isFullyPaid" render={({ field }) => (<Checkbox id="isFullyPaid" checked={field.value} onCheckedChange={field.onChange} />)} />
                        <Label htmlFor="isFullyPaid" className="text-sm font-medium">Mark as Fully Paid</Label>
                    </div>
                 </CardContent>
            </Card>
        </div>
    </form>
  );
}
