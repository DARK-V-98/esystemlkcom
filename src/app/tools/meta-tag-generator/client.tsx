
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Check, Tv, Facebook, Twitter, Chrome, Globe, Share2, Info, Search, ShieldCheck } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { toast } from 'sonner';

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState('My Awesome Website');
  const [description, setDescription] = useState('This is a great description of my website that will rank well on Google.');
  const [imageUrl, setImageUrl] = useState('https://esystemlk.com/og-image.png');
  const [url, setUrl] = useState('https://esystemlk.com');
  const [isCopied, setIsCopied] = useState(false);

  const metaTags = `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Meta tags copied to clipboard!');
  };

  const domain = url ? new URL(url).hostname : 'example.com';

  return (
    <ToolLayout 
      title="Advanced SEO Meta Tag Generator" 
      description="Boost your website's click-through rate and search ranking. Generate and preview perfect meta tags for Google, Facebook, Twitter, and more in real-time."
      category="Web SEO"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-6">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
             <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-blue-500" />
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Share2 className="w-5 h-5 text-primary" />
                   Editor
                </CardTitle>
                <CardDescription>Enter the data for your website's meta tags.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 flex-grow">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                         <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Page Title</label>
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${title.length > 60 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {title.length} / 60
                         </span>
                      </div>
                      <Input value={title} onChange={e => setTitle(e.target.value)} className="h-11 bg-black/20 border-white/5" />
                   </div>

                   <div className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Meta Description</label>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${description.length > 160 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                             {description.length} / 160
                          </span>
                       </div>
                       <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="bg-black/20 border-white/5 font-sans" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-muted-foreground tracking-wider px-1">Website URL</label>
                      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://esystemlk.com" className="h-11 bg-black/20 border-white/5" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-muted-foreground tracking-wider px-1">OG Image URL</label>
                      <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/og.png" className="h-11 bg-black/20 border-white/5" />
                   </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4">
                   <div className="bg-blue-500/20 p-2 rounded-lg mt-1"><ShieldCheck className="w-4 h-4 text-blue-400" /></div>
                   <div className="text-[10px] text-blue-200/60 leading-relaxed uppercase font-bold tracking-widest italic">
                      Correct meta tags are vital for click-through rates on search results and social shares.
                   </div>
                </div>

                <Button onClick={handleCopy} className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-lg font-black uppercase gap-3">
                   {isCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                   {isCopied ? 'COPIED TO CLIPBOARD' : 'COPY META TAGS'}
                </Button>
             </CardContent>
           </Card>
        </div>

        {/* Previews */}
        <div className="lg:col-span-7 space-y-8">
           <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-12">
              {/* Google Preview */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                    <Search className="w-3 h-3" /> SERP Preview (Google)
                 </div>
                 <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 shadow-xl max-w-2xl group transition-all">
                    <p className="text-[10px] text-emerald-400 font-bold mb-1 truncate flex items-center gap-1">
                       <Globe className="w-2 h-2" /> {url || 'https://example.com'}
                    </p>
                    <h3 className="text-2xl text-blue-400 hover:underline cursor-pointer font-medium mb-1 truncate">
                       {title || 'Enter your title here'}
                    </h3>
                    <p className="text-sm text-white/50 leading-snug line-clamp-2">
                       {description || 'Enter a description to see how it looks in search engine results...'}
                    </p>
                 </div>
              </div>

              {/* Social Preview */}
              <div className="space-y-4">
                 <div className="flex items-center gap-6 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                    <div className="flex items-center gap-2"><Facebook className="w-3 h-3" /> Facebook</div>
                    <div className="flex items-center gap-2"><Twitter className="w-3 h-3" /> Twitter</div>
                 </div>
                 <div className="max-w-xl mx-auto md:mx-0 w-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                    <div className="aspect-[1.91/1] bg-black/40 relative overflow-hidden group">
                       {imageUrl ? (
                         <img src={imageUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.currentTarget.style.display = 'none')} />
                       ) : (
                         <div className="absolute inset-0 flex items-center justify-center text-white/10 italic">No image preview</div>
                       )}
                    </div>
                    <div className="p-8 border-t border-white/5">
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2 truncate">{domain}</p>
                        <h4 className="text-xl font-bold mb-2 truncate text-white/90">{title || 'Dynamic Page Title'}</h4>
                        <p className="text-sm text-white/50 line-clamp-2 italic leading-relaxed">{description || 'Dynamic Page Description...'}</p>
                    </div>
                 </div>
              </div>
           </Card>

           {/* Code Snippet Card */}
           <Card className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 overflow-hidden relative group">
              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400/30" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400/30" />
              </div>
              <pre className="text-xs bg-black/40 p-8 pt-10 rounded-2xl overflow-auto font-mono text-blue-300 leading-relaxed max-h-[300px]">
                 <code>{metaTags}</code>
              </pre>
           </Card>
        </div>
      </div>
    </ToolLayout>
  );
}