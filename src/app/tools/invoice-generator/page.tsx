
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Trash2, Plus, Download, Eye, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

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
}

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export default function InvoiceGeneratorPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const { register, control, handleSubmit, watch } = useForm<IInvoiceForm>({
    defaultValues: {
      yourCompanyName: 'Your Company LLC',
      yourCompanyAddress: '123 Business Rd, Business City',
      clientName: 'Client Name',
      clientAddress: '456 Client Ave, Client Town',
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      items: [{ description: 'Website Development', quantity: 1, unitPrice: 1500 }],
      notes: 'Thank you for your business.',
      tax: 10,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedItems = watch('items');
  const tax = watch('tax');
  const subtotal = watchedItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const generatePDF = (mode: 'download' | 'preview') => {
    const doc = new jsPDF();
    const formData = watch();

    // Header
    if (logo) doc.addImage(logo, 'PNG', 14, 12, 30, 30);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(formData.yourCompanyName, 195, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(formData.yourCompanyAddress, 195, 26, { align: 'right' });
    
    // Invoice Info
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text('INVOICE', 14, 60);

    doc.setFontSize(11);
    doc.text('Bill To:', 14, 75);
    doc.setFont("helvetica", "normal");
    doc.text(formData.clientName, 14, 80);
    doc.text(formData.clientAddress, 14, 85);
    
    doc.setFont("helvetica", "bold");
    doc.text('Invoice #:', 130, 75);
    doc.text('Date:', 130, 80);
    doc.text('Due Date:', 130, 85);
    doc.setFont("helvetica", "normal");
    doc.text(formData.invoiceNumber, 160, 75);
    doc.text(formData.date, 160, 80);
    doc.text(formData.dueDate, 160, 85);

    // Table
    const tableColumn = ["#", "Description", "Qty", "Unit Price", "Total"];
    const tableRows = formData.items.map((item, index) => [index + 1, item.description, item.quantity, `$${item.unitPrice.toFixed(2)}`, `$${(item.quantity * item.unitPrice).toFixed(2)}`]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 100, theme: 'striped', headStyles: { fillColor: [0,0,0] } });
    
    let finalY = (doc as any).lastAutoTable.finalY;
    
    // Totals
    const summaryX = 130;
    let summaryY = finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', summaryX, summaryY);
    doc.text(`Tax (${formData.tax}%):`, summaryX, summaryY + 7);
    doc.setFontSize(14);
    doc.text('Total:', summaryX, summaryY + 16);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`$${subtotal.toFixed(2)}`, 195, summaryY, { align: 'right' });
    doc.text(`$${taxAmount.toFixed(2)}`, 195, summaryY + 7, { align: 'right' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${total.toFixed(2)}`, 195, summaryY + 16, { align: 'right' });

    // Notes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Notes:', 14, finalY + 15);
    doc.text(formData.notes, 14, finalY + 20, { maxWidth: 100 });

    if (mode === 'preview') {
      doc.output('dataurlnewwindow');
    } else {
      doc.save(`Invoice-${formData.invoiceNumber}.pdf`);
    }
  };


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl py-8 text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Invoice Generator</h1>
        <p className="text-white/80 md:text-xl mt-4 max-w-3xl mx-auto">
          Create and download professional invoices as PDF files.
        </p>
      </div>

      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(() => generatePDF('download'))} className="lg:col-span-2 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Company & Client Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Your Company Name" {...register('yourCompanyName')} />
              <Input placeholder="Client Name" {...register('clientName')} />
              <Textarea placeholder="Your Company Address" {...register('yourCompanyAddress')} />
              <Textarea placeholder="Client Address" {...register('clientAddress')} />
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Invoice Line Items</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Description</th>
                            <th className="text-left p-2 w-24">Qty</th>
                            <th className="text-left p-2 w-32">Price</th>
                            <th className="w-10 p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((item, index) => (
                            <tr key={item.id}>
                                <td><Input type="text" placeholder="Item Description" {...register(`items.${index}.description`)} className="my-1"/></td>
                                <td><Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="my-1" /></td>
                                <td><Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} className="my-1" /></td>
                                <td><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              <Button type="button" variant="outline" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Invoice Number" {...register('invoiceNumber')} />
              <Input type="date" {...register('date')} />
              <Input type="date" {...register('dueDate')} />
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Tax %" {...register('tax', { valueAsNumber: true })} />
                <span>%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
             <CardHeader><CardTitle>Logo & Notes</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-black/30">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {logo ? <img src={logo} alt="logo" className="h-20 object-contain"/> : <><ImageIcon className="w-8 h-8 mb-2 text-muted-foreground"/>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload logo</span></p></>}
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                <Textarea placeholder="Notes or payment instructions..." {...register('notes')} />
             </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader><CardTitle>Totals</CardTitle></CardHeader>
            <CardContent className="space-y-2 font-mono">
              <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax ({tax}%):</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total:</span><span>${total.toFixed(2)}</span></div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => generatePDF('preview')}><Eye className="mr-2 h-4 w-4" /> Preview</Button>
            <Button onClick={() => generatePDF('download')}><Download className="mr-2 h-4 w-4" /> Download</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

