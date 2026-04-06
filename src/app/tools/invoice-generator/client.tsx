
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Download, Eye, Image as ImageIcon, Receipt, Building, User, Calendar, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface IInvoiceForm {
  yourCompanyName: string;
  yourCompanyAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: IInvoiceItem[];
  notes: string;
  tax: number;
  currency: string;
}

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export default function InvoiceGeneratorClient() {
  const [logo, setLogo] = useState<string | null>(null);
  const { register, control, handleSubmit, watch } = useForm<IInvoiceForm>({
    defaultValues: {
      yourCompanyName: 'ESystemLk Solutions',
      yourCompanyAddress: 'Colombo, Sri Lanka',
      clientName: 'Future Partner',
      clientAddress: '123 Tech Avenue, Silicon Valley',
      invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
      items: [{ description: 'Premium Software Development', quantity: 1, unitPrice: 2500 }],
      notes: 'Please make payment within 14 days of receiving this invoice.',
      tax: 15,
      currency: '$',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = watch('items');
  const tax = watch('tax');
  const currency = watch('currency');
  const subtotal = watchedItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        toast.success('Logo uploaded!');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const generatePDF = (mode: 'download' | 'preview') => {
    const doc = new jsPDF();
    const formData = watch();

    // Invoice Styling & Fonts
    const primaryColor = [79, 70, 229]; // Indigo-600
    
    // Header
    if (logo) {
       doc.addImage(logo, 'PNG', 14, 15, 25, 25);
    }
    
    doc.setFontSize(22);
    doc.setTextColor(0,0,0);
    doc.setFont("helvetica", "bold");
    doc.text(formData.yourCompanyName, 195, 25, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(formData.yourCompanyAddress, 195, 31, { align: 'right' });
    
    // Horizontal Line
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 45, 195, 45);

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.setFont("helvetica", "bold");
    doc.text('BILL TO', 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(formData.clientName, 14, 61);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(formData.clientAddress, 14, 66, { maxWidth: 60 });
    
    // Invoice Metadata
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0,0,0);
    doc.text('INVOICE DETAILS', 130, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${formData.invoiceNumber}`, 130, 61);
    doc.text(`Date: ${formData.date}`, 130, 66);
    doc.text(`Due Date: ${formData.dueDate}`, 130, 71);

    // Line Items Table
    const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
    const tableRows = formData.items.map((item) => [
        item.description, 
        item.quantity, 
        `${currency}${item.unitPrice.toLocaleString()}`, 
        `${currency}${(item.quantity * item.unitPrice).toLocaleString()}`
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
        }
    });
    
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Calculation Summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${currency}${subtotal.toLocaleString()}`, 195, finalY, { align: 'right' });
    
    doc.text(`Tax (${formData.tax}%):`, 140, finalY + 7);
    doc.text(`${currency}${taxAmount.toLocaleString()}`, 195, finalY + 7, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('TOTAL AMOUNT:', 140, finalY + 18);
    doc.text(`${currency}${total.toLocaleString()}`, 195, finalY + 18, { align: 'right' });
    
    // Notes
    if (formData.notes) {
       doc.setFontSize(10);
       doc.setTextColor(0,0,0);
       doc.setFont("helvetica", "bold");
       doc.text('Notes:', 14, finalY + 10);
       doc.setFont("helvetica", "normal");
       doc.setFontSize(9);
       doc.setTextColor(100, 100, 100);
       doc.text(formData.notes, 14, finalY + 16, { maxWidth: 100 });
    }

    // Secondary Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by ESystemLk Invoice Tool - https://esystemlk.com', 105, 285, { align: 'center' });

    if (mode === 'preview') {
      window.open(doc.output('bloburl'), '_blank');
      toast.info('Generating preview in new tab...');
    } else {
      doc.save(`Invoice-${formData.invoiceNumber}.pdf`);
      toast.success('Invoice PDF saved!');
    }
  };

  return (
    <ToolLayout 
      title="Advanced Invoice Builder" 
      description="Create professional, client-ready invoices in seconds. Customize every detail from line items to company branding and export high-quality PDF documents for your business."
      category="Business Tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Column */}
        <div className="lg:col-span-8 space-y-8">
           {/* Section 1: Parties */}
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
              <CardHeader className="border-b border-white/5 py-6">
                 <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="w-5 h-5 text-primary" />
                    Sender & Recipient
                 </CardTitle>
                 <CardDescription>Branding and contact details for both parties.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Your Business</label>
                       <Input placeholder="Company Name" {...register('yourCompanyName')} className="h-12 bg-black/20 border-white/5 font-bold" />
                       <Textarea placeholder="Company Address / Tax ID" {...register('yourCompanyAddress')} className="bg-black/20 border-white/5 min-h-[100px]" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 px-1">Bill To (Client)</label>
                       <Input placeholder="Client Name" {...register('clientName')} className="h-12 bg-black/20 border-white/5 font-bold" />
                       <Textarea placeholder="Client Address / Contact" {...register('clientAddress')} className="bg-black/20 border-white/5 min-h-[100px]" />
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Section 2: Line Items */}
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
              <CardHeader className="border-b border-white/5 py-6 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                       <Receipt className="w-5 h-5 text-primary" />
                       Service & Line Items
                    </CardTitle>
                    <CardDescription>List your products or services provided.</CardDescription>
                 </div>
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="h-10 bg-white/5 border-white/10 hover:bg-white/10 gap-2 font-bold px-4">
                    <Plus className="w-4 h-4" /> Add Line
                 </Button>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/50 border-b border-white/5">
                          <tr>
                             <th className="px-8 py-4 text-left">Description</th>
                             <th className="px-4 py-4 text-center w-24">Qty</th>
                             <th className="px-4 py-4 text-right w-40">Price ({currency})</th>
                             <th className="px-8 py-4 w-12 text-center"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {fields.map((item, index) => (
                             <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group/row">
                                <td className="px-8 py-4">
                                   <Input type="text" placeholder="Description of service..." {...register(`items.${index}.description`)} className="bg-transparent border-none focus:ring-0 px-0 text-sm font-medium" />
                                </td>
                                <td className="px-4 py-4">
                                   <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="bg-black/20 border-white/5 text-center h-9 text-xs" />
                                </td>
                                <td className="px-4 py-4">
                                   <Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="bg-black/20 border-white/5 text-right h-9 text-xs font-mono" />
                                </td>
                                <td className="px-8 py-4 text-center">
                                   <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-white/20 hover:text-red-500 hover:bg-black/40">
                                      <Trash2 className="w-4 h-4" />
                                   </Button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 {fields.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground italic text-sm">
                       Click "Add Line" to start building your invoice.
                    </div>
                 )}
              </CardContent>
           </Card>

           {/* Section 3: Notes */}
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl group hover:border-primary/20 transition-all">
              <CardContent className="p-8">
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1 mb-3 block">Additional Notes / Terms</label>
                 <Textarea placeholder="Payment terms, bank details, or thank you message..." {...register('notes')} className="bg-black/20 border-white/5 min-h-[120px] text-sm leading-relaxed" />
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
           {/* Section 4: Branding */}
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-primary" />
              <CardHeader className="pb-4">
                 <CardTitle className="text-lg">Metadata & Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/30">Invoice #</label>
                          <Input {...register('invoiceNumber')} className="bg-black/20 border-white/5 text-xs font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/30">Currency Symbol</label>
                          <Input {...register('currency')} className="bg-black/20 border-white/5 text-xs font-bold text-center" maxLength={3} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/30">Issue Date</label>
                       <Input type="date" {...register('date')} className="bg-black/20 border-white/5 text-xs h-10" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-white/30">Due Date</label>
                       <Input type="date" {...register('dueDate')} className="bg-black/20 border-white/5 text-xs h-10" />
                    </div>
                 </div>

                 <div className="pt-2">
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer bg-black/20 hover:bg-black/30 hover:border-primary/50 transition-all overflow-hidden group">
                       {logo ? (
                         <div className="relative w-full h-full flex items-center justify-center p-4 bg-white/5">
                            <img src={logo} alt="logo" className="max-h-full max-w-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <p className="text-[10px] font-black text-white px-3 py-1 bg-primary rounded-full">CHANGE LOGO</p>
                            </div>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-white/10 group-hover:text-primary transition-colors" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Brand Logo</p>
                         </div>
                       )}
                       <Input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                   </label>
                 </div>
              </CardContent>
           </Card>

           {/* Section 5: Summary */}
           <Card className="bg-black/40 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <CardHeader>
                 <CardTitle className="text-xl">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-sm text-white/50">
                       <span>Subtotal</span>
                       <span>{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm gap-4">
                       <span className="text-white/50">Tax / VAT (%)</span>
                       <div className="flex items-center gap-2">
                          <Input type="number" {...register('tax', { valueAsNumber: true })} className="w-16 h-8 text-center bg-black/20 border-white/5 text-xs" />
                          <span className="text-white/30 text-xs">%</span>
                       </div>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-400/80">
                       <span>Tax Amount</span>
                       <span>{currency}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                       <span className="text-xs font-black uppercase tracking-widest text-white/30 mb-1">Total Due</span>
                       <span className="text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(79,70,229,0.3)] tracking-tighter">
                          {currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => generatePDF('preview')} className="h-14 border-white/10 hover:bg-white/5 text-sm font-bold gap-2">
                       <Eye className="w-4 h-4" /> PREVIEW
                    </Button>
                    <Button onClick={() => generatePDF('download')} className="h-14 bg-primary hover:bg-primary/90 text-sm font-black shadow-lg shadow-primary/20 gap-2">
                       <Download className="w-4 h-4" /> EXPORT PDF
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Privacy Note */}
           <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl text-center">
              <div className="flex justify-center gap-3 mb-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase text-emerald-300/60 leading-relaxed tracking-wider">
                 Your financial data never leaves your browser. PDF generation happens entirely on your device.
              </p>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}
