
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Bot, RefreshCw, Copy, Check, FileCode, Trash2, Plus, Info } from 'lucide-react';
import { ToolLayout } from '@/components/tools/tool-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Rule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export default function RobotsTxtGeneratorClient() {
  const [rules, setRules] = useState<Rule[]>([
    { userAgent: '*', allow: ['/'], disallow: ['/admin', '/private'] }
  ]);
  const [sitemap, setSitemap] = useState('https://esystemlk.com/sitemap.xml');
  const [generatedTxt, setGeneratedTxt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generateRobots = () => {
    let result = '';
    
    rules.forEach(rule => {
      result += `User-agent: ${rule.userAgent}\n`;
      rule.disallow.forEach(path => {
        if (path.trim()) result += `Disallow: ${path.trim()}\n`;
      });
      rule.allow.forEach(path => {
        if (path.trim()) result += `Allow: ${path.trim()}\n`;
      });
      result += '\n';
    });

    if (sitemap.trim()) {
      result += `Sitemap: ${sitemap.trim()}\n`;
    }

    setGeneratedTxt(result.trim());
    toast.success('Robots.txt generated!');
  };

  const handleDownload = () => {
    if (!generatedTxt) generateRobots();
    const blob = new Blob([generatedTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('robots.txt downloaded!');
  };

  const copyToClipboard = () => {
    if (!generatedTxt) return;
    navigator.clipboard.writeText(generatedTxt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const addPath = (index: number, type: 'allow' | 'disallow') => {
    const newRules = [...rules];
    newRules[index][type].push('');
    setRules(newRules);
  };

  const updatePath = (ruleIndex: number, pathIndex: number, type: 'allow' | 'disallow', value: string) => {
    const newRules = [...rules];
    newRules[ruleIndex][type][pathIndex] = value;
    setRules(newRules);
  };

  const removePath = (ruleIndex: number, pathIndex: number, type: 'allow' | 'disallow') => {
    const newRules = [...rules];
    newRules[ruleIndex][type].splice(pathIndex, 1);
    setRules(newRules);
  };

  return (
    <ToolLayout 
      title="Robots.txt Generator" 
      description="Create a custom robots.txt file to guide search engine crawlers and improve your site's SEO indexing. Manage your site's accessibility with ease."
      category="Web SEO"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-[hsl(200,100%,50%,0.5)] hover:shadow-[0_0_20px_hsl(200,100%,50%,0.1)] transition-all">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Crawler Rules
                </CardTitle>
                <CardDescription>Setup rules for different search bots.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {rules.map((rule, rIdx) => (
                  <div key={rIdx} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold">User Agent</label>
                        {rules.length > 1 && (
                           <Button variant="ghost" size="sm" onClick={() => setRules(rules.filter((_, i) => i !== rIdx))} className="text-red-400 hover:text-red-500 h-8">
                             Remove Group
                           </Button>
                        )}
                     </div>
                     <Select value={rule.userAgent} onValueChange={(val) => updateRule(rIdx, 'userAgent', val)}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-11">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="*">All Bots (*)</SelectItem>
                           <SelectItem value="Googlebot">Googlebot</SelectItem>
                           <SelectItem value="Bingbot">Bingbot</SelectItem>
                           <SelectItem value="Slurp">Yahoo! Slurp</SelectItem>
                           <SelectItem value="DuckDuckBot">DuckDuckBot</SelectItem>
                           <SelectItem value="Baiduspider">Baiduspider</SelectItem>
                           <SelectItem value="YandexBot">YandexBot</SelectItem>
                        </SelectContent>
                     </Select>

                     <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                           <label className="text-xs uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
                              Disallow Paths <Info className="w-3 h-3" />
                           </label>
                           {rule.disallow.map((path, pIdx) => (
                             <div key={pIdx} className="flex gap-2">
                                <Input 
                                  value={path} 
                                  onChange={(e) => updatePath(rIdx, pIdx, 'disallow', e.target.value)}
                                  placeholder="/private-folder"
                                  className="h-10 bg-gray-50 border-gray-200"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removePath(rIdx, pIdx, 'disallow')} className="h-10 w-10 text-destructive/50 hover:text-destructive">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                           ))}
                           <Button variant="ghost" size="sm" onClick={() => addPath(rIdx, 'disallow')} className="h-8 gap-2 text-xs">
                             <Plus className="w-3 h-3" /> Add Disallow
                           </Button>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Allow Paths</label>
                           {rule.allow.map((path, pIdx) => (
                             <div key={pIdx} className="flex gap-2">
                                <Input 
                                  value={path} 
                                  onChange={(e) => updatePath(rIdx, pIdx, 'allow', e.target.value)}
                                  placeholder="/public-folder"
                                  className="h-10 bg-gray-50 border-gray-200"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removePath(rIdx, pIdx, 'allow')} className="h-10 w-10 text-destructive/50 hover:text-destructive">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                           ))}
                           <Button variant="ghost" size="sm" onClick={() => addPath(rIdx, 'allow')} className="h-8 gap-2 text-xs">
                             <Plus className="w-3 h-3" /> Add Allow
                           </Button>
                        </div>
                     </div>
                  </div>
                ))}
                
                <div className="space-y-2">
                   <label className="text-sm font-semibold">Sitemap URL</label>
                   <Input 
                      value={sitemap} 
                      onChange={(e) => setSitemap(e.target.value)}
                      placeholder="https://example.com/sitemap.xml"
                      className="h-12 bg-gray-50 border-gray-200"
                   />
                </div>

                <Button onClick={generateRobots} className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                   <RefreshCw className="mr-2 w-4 h-4" />
                   Generate robots.txt
                </Button>
             </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  Code Preview
                </CardTitle>
                <CardDescription>Your production-ready robots.txt.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-9 gap-2">
                  {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-9 gap-2">
                  <Download className="w-3 h-3" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-0">
               <div className="flex-grow bg-gray-50 font-mono text-sm p-8 overflow-auto max-h-[620px] border-t border-gray-200 whitespace-pre">
                  {generatedTxt ? (
                    <code className="text-primary/80">
                      {generatedTxt}
                    </code>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic">
                      Click generate to view your robots.txt code...
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}

