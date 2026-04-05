"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { getPageSettings, updatePageVisibility, initializePageSettings, type PageVisibility } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const pageConfig = [
    { key: 'showServices', label: 'Services Page', description: 'Controls the main Services page and homepage section.' },
    { key: 'showPricing', label: 'Pricing Page', description: 'Controls the main Pricing page link in navigation.' },
    { key: 'showTestimonials', label: 'Testimonials Page', description: 'Controls the main Testimonials page and homepage section.' },
] as const;


export default function PageManagementClient() {
    const [settings, setSettings] = useState<PageVisibility | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        getPageSettings().then(data => {
            setSettings(data);
            setIsLoading(false);
        });
    }, []);

    const handleInitialize = () => {
        startTransition(async () => {
            const result = await initializePageSettings();
            if (result.success) {
                const newSettings = await getPageSettings();
                setSettings(newSettings);
            }
            toast({
                title: result.success ? 'Success' : 'Error',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
        });
    };

    const handleVisibilityChange = (key: keyof PageVisibility, checked: boolean) => {
        startTransition(async () => {
            setSettings(prev => prev ? { ...prev, [key]: checked } : null);
            const result = await updatePageVisibility(key, checked);
            if (!result.success) {
                // Revert on failure
                setSettings(prev => prev ? { ...prev, [key]: !checked } : null);
            }
            toast({
                title: result.success ? 'Success' : 'Error',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
        });
    };

    if (isLoading) {
        return (
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-6 w-32 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-6 w-11 rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }
    
    return (
        <>
            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg mb-8">
                <CardHeader>
                    <CardTitle>Initialize Settings</CardTitle>
                    <CardDescription>
                        If page settings are not working, you may need to initialize them in the database.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleInitialize} disabled={isPending}>
                        {isPending ? 'Initializing...' : 'Initialize Page Settings'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Page Visibility</CardTitle>
                    <CardDescription>
                        Toggle the visibility of various pages and sections on your site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {pageConfig.map(({ key, label, description }) => (
                         <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                            <div>
                                <h3 className="font-semibold">{label}</h3>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            <Switch
                                checked={settings?.[key] ?? false}
                                onCheckedChange={(checked) => handleVisibilityChange(key, checked)}
                                disabled={isPending || !settings}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
}
