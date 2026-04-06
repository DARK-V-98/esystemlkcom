"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Globe, 
  LayoutDashboard, 
  ShieldCheck, 
  ExternalLink,
  Circle,
  Monitor,
  Image as ImageIcon,
  Rocket,
  Search,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ToolLayout } from '@/components/tools/tool-layout';

interface ProjectStage {
  name: string;
  status: 'pending' | 'active' | 'completed';
  description: string;
}

interface OrderData {
  projectName: string;
  clientName: string;
  email: string;
  status: 'pending' | 'in-progress' | 'review' | 'testing' | 'completed';
  progress: number;
  accessKey: string;
  currentStage: string;
  stages: ProjectStage[];
  devLink?: string;
  images: string[];
  lastUpdated: any;
  createdAt: any;
}

export default function TrackerClient() {
  const { firestore } = useAuthContext();
  const [accessKey, setAccessKey] = useState('');
  const [projectData, setProjectData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);
  const [error, setError] = useState('');

  const handleAccess = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!accessKey.trim()) return;

    setLoading(true);
    setError('');

    if (!firestore) {
        setError("Database connection initializing...");
        return;
    }

    // Access using accessKey
    const q = query(collection(firestore, 'orders'), where('accessKey', '==', accessKey.trim()));
    
    // Using onSnapshot for real-time tracking once the key is validated
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as OrderData;
        setProjectData(data);
        setIsAccessAllowed(true);
        setLoading(false);
        toast.success("Project access granted. Connection live!");
      } else {
        setError("Invalid access key. Please check your email or contact support.");
        setLoading(false);
        toast.error("Access key not recognized.");
      }
    }, (error) => {
      console.error("Tracking error:", error);
      setError("Connection to development stream lost.");
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const getStatusText = (status: OrderData['status']) => {
    switch(status) {
        case 'completed': return 'Deployed & Production Live';
        case 'in-progress': return 'Active Development & Coding';
        case 'review': return 'UI/UX Visual Review';
        case 'testing': return 'Final Polish & Quality Audit';
        default: return 'Initialization & Documentation';
    }
  };

  if (!isAccessAllowed) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            {/* Visual background details */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            
            <CardHeader className="text-center pt-12 pb-8 space-y-4">
               <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 rotate-12 transition-transform hover:rotate-0 duration-500">
                  <Key className="w-10 h-10 text-primary animate-pulse" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">Live Monitor Access</CardTitle>
                  <CardDescription className="uppercase text-[10px] font-black tracking-[0.4em] opacity-40">Development Console</CardDescription>
               </div>
            </CardHeader>
            <CardContent className="px-8 pb-12 space-y-6">
                <form onSubmit={handleAccess} className="space-y-4">
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                        <Input 
                            className="bg-white/5 border-white/5 h-16 pl-12 rounded-2xl text-lg font-black tracking-widest placeholder:opacity-20 placeholder:font-normal focus:bg-white/10 transition-all placeholder:tracking-normal" 
                            placeholder="ESL-XXXX-XXXX"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="text-red-400 text-[10px] uppercase font-black tracking-widest text-center px-4 leading-relaxed italic">{error}</p>}
                    <Button 
                        type="submit" 
                        disabled={loading || !accessKey}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 group"
                    >
                        {loading ? <Zap className="w-6 h-6 animate-spin" /> : (
                            <><Search className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" /> CONNECT STREAM</>
                        )}
                    </Button>
                </form>
                <div className="flex items-center justify-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Access</div>
                    <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Real-time</div>
                    <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Worldwide</div>
                </div>
            </CardContent>
        </Card>
        <p className="mt-8 text-muted-foreground/30 font-black text-[10px] uppercase tracking-[0.5em] text-center max-w-sm leading-loose">
            Enter your unique project key provided by esystemlk to access your real-time development monitor.
        </p>
      </div>
    );
  }

  return (
    <ToolLayout 
        title={`${projectData?.projectName}`} 
        description="YOUR EXCLUSIVE REAL-TIME PROJECT DASHBOARD. WATCH YOUR VISION COME TO LIFE LINE BY LINE."
        category="Live Project Stream"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        {/* Main Status Column */}
        <div className="lg:col-span-8 space-y-8">
            <Card className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Rocket className="w-32 h-32" />
                </div>
                <CardHeader className="pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <Badge className="bg-primary/20 text-primary border-primary/50 text-[10px] font-black tracking-widest mb-2 uppercase">Current Phase</Badge>
                            <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Monitor className="w-8 h-8 text-primary opacity-50" />
                                {projectData?.currentStage}
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium opacity-70 italic">{getStatusText(projectData!.status)}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest mb-1">Access Key</p>
                                <code className="text-sm font-black font-mono tracking-widest text-primary">{projectData?.accessKey}</code>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex justify-between items-end px-1">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 mb-2 opacity-50">Overall Project Completion</p>
                                <p className="text-6xl font-black italic tracking-tighter text-primary">
                                    {projectData?.progress}<span className="text-2xl opacity-40">%</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                                    <div className="w-1 h-5 bg-primary/70 rounded-full animate-pulse delay-75" />
                                    <div className="w-1 h-4 bg-primary/40 rounded-full animate-pulse delay-150" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Live Connection Secured</p>
                            </div>
                        </div>
                        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-1">
                            <div 
                                className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.8)] relative overflow-hidden" 
                                style={{ width: `${projectData?.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectData?.devLink && (
                           <a 
                             href={projectData.devLink} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex items-center justify-between p-6 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl transition-all group"
                           >
                              <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Stage Preview</p>
                                  <p className="font-bold text-sm truncate max-w-[200px]">VISIT LIVE DESIGN SITE</p>
                              </div>
                              <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </a>
                        )}
                        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Client Identity</p>
                                <p className="font-bold text-sm">{projectData?.clientName}</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 opacity-40" />
                        </div>
                     </div>
                </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader>
                    <CardTitle className="uppercase tracking-widest text-xs font-black opacity-40 italic">Development Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5 border-t border-white/5">
                        {projectData?.stages.map((stage, idx) => (
                            <div key={idx} className={cn("p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all", stage.status === 'active' && "bg-primary/5")}>
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                                        stage.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                        stage.status === 'active' ? "bg-primary text-primary-foreground shadow-primary/30 rotate-2 relative" :
                                        "bg-white/5 text-muted-foreground/30 border border-white/5"
                                    )}>
                                        {stage.status === 'active' && <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20" />}
                                        {stage.status === 'completed' ? <Check className="w-6 h-6" /> : stage.status === 'active' ? <Zap className="w-6 h-6 fill-current" /> : <Circle className="w-6 h-6 opacity-20" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className={cn("font-black uppercase tracking-tight text-lg", stage.status === 'completed' && "text-muted-foreground/40 line-through")}>{stage.name}</p>
                                            {stage.status === 'active' && <Badge className="bg-primary/20 text-primary border-primary/50 text-[8px] animate-pulse">CURRENT ACTIVE PHASE</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground/60 font-medium max-w-sm">{stage.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                     {stage.status === 'completed' ? (
                                         <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                                             <Sparkles className="w-3 h-3" /> Successfully Delivered
                                         </div>
                                     ) : stage.status === 'active' ? (
                                        <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" /> Under Development
                                        </div>
                                     ) : (
                                        <span className="text-muted-foreground/20 font-black text-[9px] uppercase tracking-widest">Awaiting Kickoff</span>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Visual Progress Side Column */}
        <div className="lg:col-span-4 space-y-8">
            <Card className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px]">
                <CardHeader>
                    <CardTitle className="uppercase tracking-widest text-[11px] font-black opacity-60 flex items-center gap-2 tracking-[0.2em]">
                        <ImageIcon className="w-4 h-4 text-primary" /> Visual Development Stream
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold opacity-30 mt-1 uppercase italic">Real-time captures from your project's current build.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 gap-4">
                        {projectData?.images && projectData.images.length > 0 ? projectData.images.map((img, idx) => (
                           <div key={idx} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in">
                                <img src={img} alt={`Progress capture ${idx + 1}`} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase text-white/50 tracking-widest border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Capture No. {idx + 1}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                        )) : (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4 opacity-10 grayscale border-2 border-dashed border-white/10 rounded-[2.5rem]">
                                <Monitor className="w-16 h-16" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center max-w-[150px] leading-loose">Visual captures will appear here as we build.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <div className="flex gap-2 items-center">
                        <Clock className="w-3 h-3 text-primary opacity-50" />
                        <p className="text-[8px] font-black uppercase text-muted-foreground opacity-60 tracking-widest">
                            Last Stream Update: {projectData?.updatedAt?.toDate ? format(projectData.updatedAt.toDate(), 'PPP p') : 'Just Now'}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="bg-primary/10 backdrop-blur-3xl border border-primary/20 rounded-3xl overflow-hidden shadow-2xl p-6">
                <div className="space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-widest italic opacity-60">Success Partnership</h3>
                    <p className="text-xs font-medium leading-relaxed opacity-70">
                        We don't just build systems; we build efficiency. Your project is being crafted with the latest tech stack ensuring performance, security, and scalability. 
                        <strong> If you have any immediate feedback, please contact your project manager directly.</strong>
                    </p>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                         <span className="text-[9px] font-black tracking-widest uppercase opacity-40">Development Partner</span>
                         <span className="text-[9px] font-black tracking-widest uppercase text-primary">ESystemLk Solutions</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
