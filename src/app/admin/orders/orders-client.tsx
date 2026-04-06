"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthContext } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Mail, 
  Key, 
  Globe, 
  Settings,
  LayoutDashboard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  projectName: string;
  clientName: string;
  email: string;
  status: 'pending' | 'in-progress' | 'review' | 'testing' | 'completed';
  progress: number;
  accessKey: string;
  orderNumber: string;
  createdAt: any;
  updatedAt: any;
  devLink?: string;
}

export default function OrdersClient() {
  const { firestore } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!firestore) return;

    const q = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  const deleteOrder = async (id: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to delete this order? This will remove all project progress data.")) {
        try {
            await deleteDoc(doc(firestore, 'orders', id));
            toast.success("Order deleted successfully");
        } catch (error) {
            toast.error("Failed to delete order");
        }
    }
  };

  const copyAccessKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Access key copied to clipboard");
  };

  const filteredOrders = orders.filter(order => 
    (order.projectName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (order.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (order.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (order.accessKey?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/50">Completed</Badge>;
      case 'in-progress': return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/50">Processing</Badge>;
      case 'review': return <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-purple-500/50">Client Review</Badge>;
      case 'testing': return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-amber-500/50">Final Testing</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
             <LayoutDashboard className="w-8 h-8 text-primary" />
             Project Tracking System
          </h1>
          <p className="text-muted-foreground mt-1">Manage active website orders and real-time development progress.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20">
          <Link href="/admin/quotation">
            <Plus className="w-4 h-4 mr-2" /> New Project / Quotation
          </Link>
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by client, project, email or access key..." 
              className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse bg-muted/20 border-muted/50 h-48"></Card>
                ))
            ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <Card key={order.id} className="group overflow-hidden bg-background/40 hover:bg-background/60 border-border/10 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/5">
                        <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-black text-lg uppercase tracking-tight line-clamp-1">{order.projectName}</h3>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(order.status)}
                                        <span className="text-xs font-bold text-muted-foreground/60">{order.progress}%</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-lg border-border/50 shadow-2xl">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-2">
                                                <Settings className="w-4 h-4" /> Manage Project
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => copyAccessKey(order.accessKey)} className="flex items-center gap-2">
                                            <Key className="w-4 h-4" /> Copy Access Key
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive flex items-center gap-2" onClick={() => deleteOrder(order.id)}>
                                            <Trash2 className="w-4 h-4" /> Delete Project
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 text-primary/50" />
                                    <span>Joined {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'PPP') : 'Recently'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4 text-primary/50" />
                                    <span className="truncate">{order.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Globe className="w-4 h-4 text-primary/50" />
                                    <span className="truncate">{order.devLink || 'Link not set'}</span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="pt-2">
                                <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                     <div 
                                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                                        style={{ width: `${order.progress}%` }} 
                                     />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1 rounded-lg border-border/50 hover:bg-primary/5" asChild>
                                    <Link href={`/admin/orders/${order.id}`}>
                                        MANAGE
                                    </Link>
                                </Button>
                                {order.devLink && (
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg border-border/50 hover:bg-primary/5" asChild>
                                        <a href={order.devLink} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3 h-3 mr-2" /> VISIT
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto opacity-30">
                        <LayoutDashboard className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">No active projects found</p>
                    <Button variant="link" asChild>
                        <Link href="/admin/quotation">Build your first project from a quotation</Link>
                    </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
