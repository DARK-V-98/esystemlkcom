"use client";

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthContext } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Globe, 
  Image as ImageIcon,
  Key,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectStage {
  name: string;
  status: 'pending' | 'active' | 'completed';
  description: string;
}

interface OrderData {
  id: string;
  projectName: string;
  clientName: string;
  email: string;
  phone: string;
  status: 'pending' | 'in-progress' | 'review' | 'testing' | 'completed';
  progress: number;
  accessKey: string;
  orderNumber: string;
  currentStage: string;
  stages: ProjectStage[];
  devLink?: string;
  images: string[];
  totalAmount: number;
  advancePaid: number;
  createdAt: any;
  updatedAt: any;
}

export default function OrderDetailsClient({ id }: { id: string }) {
  const { firestore } = useAuthContext();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (!firestore || !id) return;

    const docRef = doc(firestore, 'orders', id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder({ id: snapshot.id, ...snapshot.data() } as OrderData);
      } else {
        toast.error("Order not found");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load project details");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, id]);

  const updateOrderField = async (field: string, value: any) => {
    if (!firestore || !id) return;
    try {
      await updateDoc(doc(firestore, 'orders', id), {
        [field]: value,
        updatedAt: serverTimestamp()
      });
      toast.success(`${field} updated`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleStageStatusChange = async (index: number, newStatus: ProjectStage['status']) => {
    if (!order) return;
    const updatedStages = [...order.stages];
    updatedStages[index].status = newStatus;
    
    // Auto-set the currentStage based on the most recent active stage
    const currentStageName = updatedStages.find(s => s.status === 'active')?.name || order.currentStage;
    
    await updateDoc(doc(firestore!, 'orders', id), {
      stages: updatedStages,
      currentStage: currentStageName,
      updatedAt: serverTimestamp()
    });
  };

  const addCustomStage = async () => {
    if (!newStageName.trim() || !order) return;
    const newStage: ProjectStage = {
      name: newStageName,
      status: 'pending',
      description: 'Custom added stage'
    };
    await updateDoc(doc(firestore!, 'orders', id), {
      stages: [...order.stages, newStage],
      updatedAt: serverTimestamp()
    });
    setNewStageName('');
    toast.success("New stage added");
  };

  const removeStage = async (index: number) => {
    if (!order) return;
    const updatedStages = order.stages.filter((_, i) => i !== index);
    await updateDoc(doc(firestore!, 'orders', id), {
        stages: updatedStages,
        updatedAt: serverTimestamp()
    });
    toast.success("Stage removed");
  };

  const addImage = async () => {
    if (!newImageUrl.trim() || !order) return;
    const updatedImages = [...(order.images || []), newImageUrl];
    await updateDoc(doc(firestore!, 'orders', id), {
      images: updatedImages,
      updatedAt: serverTimestamp()
    });
    setNewImageUrl('');
    toast.success("Progress image added");
  };

  const removeImage = async (index: number) => {
    if (!order) return;
    const updatedImages = order.images.filter((_, i) => i !== index);
    await updateDoc(doc(firestore!, 'orders', id), {
        images: updatedImages,
        updatedAt: serverTimestamp()
    });
    toast.success("Image removed");
  };

  const notifyClient = async () => {
    if (!order) return;
    toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)), // Mock API call
        {
            loading: 'Sending progress update to client email...',
            success: 'Notification sent successfully!',
            error: 'Failed to send notification email.'
        }
    );
    // In a real implementation: fetch('/api/notify-order-update', { method: 'POST', body: JSON.stringify(order) })
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh] opacity-50 space-y-4 flex-col">
       <Zap className="w-12 h-12 animate-pulse text-primary" />
       <p className="font-black uppercase tracking-widest text-xs">Accessing Project Stream...</p>
    </div>
  );
  
  if (!order) return null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
            <Link href="/admin/orders" className="text-primary hover:text-primary/70 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">{order.projectName}</h1>
                {order.status === 'completed' && <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50 uppercase font-black px-3 py-1">LIVE</Badge>}
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Project Type: Custom Web Development
            </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button onClick={notifyClient} variant="outline" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-black uppercase group">
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Notify Client
            </Button>
            <Button variant="outline" onClick={() => window.open(`/track/${order.accessKey}`, '_blank')} className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 font-black uppercase">
                <ExternalLink className="w-4 h-4 mr-2" /> Live Tracker View
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress & Core Settings */}
        <div className="lg:col-span-8 space-y-8">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <CardHeader className="pb-4">
                    <CardTitle className="uppercase tracking-widest text-xs font-black opacity-40">Core Project Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 relative z-10">
                    {/* Status & Dev Link */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Status</Label>
                            <Select value={order.status} onValueChange={(val: any) => updateOrderField('status', val)}>
                                <SelectTrigger className="bg-background/40 border-white/5 h-12 rounded-xl backdrop-blur-md">
                                    <SelectValue placeholder="Project Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover/90 backdrop-blur-xl border-white/10">
                                    <SelectItem value="pending">Pending Kickoff</SelectItem>
                                    <SelectItem value="in-progress">Actively Developing</SelectItem>
                                    <SelectItem value="review">Under Design Review</SelectItem>
                                    <SelectItem value="testing">Critical QA Phase</SelectItem>
                                    <SelectItem value="completed">Production Live</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Live Preview URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                <Input 
                                    className="pl-10 h-12 bg-background/40 border-white/5 rounded-xl placeholder:opacity-30" 
                                    placeholder="https://dev-site.esystemlk.com" 
                                    value={order.devLink || ''}
                                    onChange={(e) => updateDoc(doc(firestore!, 'orders', id), { devLink: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-6 pt-4">
                         <div className="flex justify-between items-end px-1">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completion Velocity</Label>
                                <p className="text-3xl font-black italic">{order.progress}%</p>
                            </div>
                            <div className="text-right">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Active Phase</Label>
                                <p className="text-sm font-bold opacity-70 truncate">{order.currentStage}</p>
                            </div>
                         </div>
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <Slider 
                                defaultValue={[order.progress]} 
                                max={100} 
                                step={1} 
                                onValueCommit={(vals) => updateOrderField('progress', vals[0])}
                                className="z-10"
                            />
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stages Management */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="uppercase tracking-widest text-xs font-black opacity-40">Roadmap / Lifecycle Phases</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Manage project milestones and their active status.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Custom Phase Name"
                            className="w-48 h-10 bg-background/20 border-white/5 rounded-lg text-xs"
                            value={newStageName}
                            onChange={(e) => setNewStageName(e.target.value)}
                        />
                        <Button size="sm" onClick={addCustomStage} className="h-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5 border-t border-white/5">
                        {order.stages.map((stage, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => {
                                            const nextStatus: any = stage.status === 'completed' ? 'pending' : stage.status === 'active' ? 'completed' : 'active';
                                            handleStageStatusChange(idx, nextStatus);
                                        }}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg",
                                            stage.status === 'completed' ? "bg-emerald-500/20 text-emerald-500" :
                                            stage.status === 'active' ? "bg-primary text-primary-foreground animate-pulse" :
                                            "bg-white/5 text-muted-foreground border border-white/5"
                                        )}
                                    >
                                        {stage.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : stage.status === 'active' ? <Zap className="w-5 h-5 fill-current" /> : <Circle className="w-5 h-5 opacity-20" />}
                                    </button>
                                    <div>
                                        <p className={cn("font-black uppercase tracking-tight text-sm", stage.status === 'completed' && "text-muted-foreground line-through opacity-50")}>{stage.name}</p>
                                        <p className="text-[10px] text-muted-foreground/60 font-medium">{stage.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => removeStage(idx)} className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Visual Progress & Client Access */}
        <div className="lg:col-span-4 space-y-8">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <CardHeader>
                    <CardTitle className="uppercase tracking-widest text-xs font-black opacity-40">Client Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase text-muted-foreground tracking-widest opacity-60">Customer Identity</p>
                            <p className="font-bold text-lg">{order.clientName}</p>
                            <p className="text-xs text-primary/70 truncate">{order.email}</p>
                        </div>
                        <div className="pt-2">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-40 mb-2">Project Access Key</p>
                             <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/5 rounded-xl group relative">
                                <Key className="w-3 h-3 text-primary opacity-50" />
                                <code className="text-xs font-black font-mono tracking-widest text-primary">{order.accessKey}</code>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(order.accessKey);
                                        toast.success("Key copied");
                                    }}
                                    className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all font-black text-[8px] uppercase tracking-widest hover:text-primary"
                                >
                                    Copy
                                </button>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl min-h-[400px]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="uppercase tracking-widest text-xs font-black opacity-40 italic">Visual Progress Gallery</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Image URL (CDN/Drive)"
                            className="flex-grow h-10 bg-background/20 border-white/5 rounded-lg text-xs"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button size="sm" onClick={addImage} className="h-10 bg-primary shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.images?.length > 0 ? order.images.map((img, idx) => (
                           <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-white/5">
                                <img src={img} alt={`Progress screenshot ${idx+1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Button variant="ghost" size="icon" onClick={() => removeImage(idx)} className="text-red-500 hover:bg-red-500/20">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                           </div>
                        )) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-3 opacity-20 border-2 border-dashed border-white/10 rounded-2xl">
                                <ImageIcon className="w-10 h-10" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Screenshots Shared</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <div className="p-6 pt-0 opacity-20">
                    <p className="text-[8px] font-medium leading-relaxed font-mono italic">
                        Tip: Clients can view these images in their real-time dashboard to visually track the evolution of their project. Use direct image URLs from hosting services or Google Drive.
                    </p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
