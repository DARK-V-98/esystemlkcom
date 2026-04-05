
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useAuthContext } from "@/hooks/use-auth";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, loading } = useAuthContext();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [user, loading, router]);

  const onSubmit = (data: LoginFormValues) => {
    signInWithEmail(data.email, data.password);
  };

  const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8S109.8 11.6 244 11.6c70.3 0 129.8 27.8 174.4 72.4l-64 64C320.5 112.2 284.1 91 244 91c-82.6 0-150.1 66.6-150.1 170.8s67.5 170.8 150.1 170.8c99.9 0 133-77.2 137.9-117.4H244V261.8h244z"></path>
    </svg>
  );

  if (loading || user) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-md bg-card border-border shadow-2xl p-6">
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-2 max-w-4xl w-full bg-card border-border shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="relative p-8 flex flex-col justify-between bg-accent text-accent-foreground">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.png" alt="ESystemLk Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold">
                <span className="text-accent-foreground">esystem</span>
                <span className="text-primary">lk</span>
              </span>
            </Link>
          </div>
          <div className="relative z-10 mt-auto">
            <h2 className="text-3xl font-bold text-accent-foreground">Welcome Back</h2>
            <p className="text-accent-foreground/80 mt-2">Sign in to continue to your dashboard.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8">
            <CardHeader className="text-left p-0 mb-8">
              <CardTitle className="font-headline text-3xl">Sign In</CardTitle>
              <CardDescription>
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="rounded-lg bg-background border-border focus:border-primary focus:ring-0" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                         <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                      </div>
                      <FormControl>
                         <div className="relative">
                           <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="rounded-lg bg-background border-border focus:border-primary focus:ring-0 pr-10" disabled={loading} />
                           <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg" size="lg" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-muted-foreground text-sm">OR</span>
            </div>

            <Button variant="outline" className="w-full rounded-lg border-border hover:bg-accent" size="lg" onClick={signInWithGoogle} disabled={loading}>
              <GoogleIcon /> Sign In with Google
            </Button>
        </div>
      </div>


      {/* Mobile View */}
      <div className="md:hidden w-full flex flex-col min-h-[80vh] bg-background relative overflow-hidden rounded-3xl shadow-2xl border border-border">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary/10 via-background to-background blur-2xl"></div>
        <div className="p-6 flex-shrink-0 z-10">
          <div className="flex justify-between items-center">
            <Button asChild variant="ghost" size="icon">
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-6 z-10">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="mb-6" />
        </div>
        
        <div className="flex-grow p-6 z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="h-12 rounded-xl bg-secondary/50 border-border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} {...field} className="h-12 rounded-xl bg-secondary/50 border-border pr-10" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </FormControl>
                     <div className="text-right">
                       <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                     </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Switch id="remember-me" />
                  <label htmlFor="remember-me" className="text-muted-foreground">Remember me</label>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-base" variant="dark" disabled={loading}>
                {loading ? "Logging In..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="p-6 text-center z-10 flex-shrink-0 space-y-4">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-muted-foreground text-sm">OR</span>
            </div>
            <Button variant="outline" className="w-full h-14 rounded-xl text-base bg-secondary/50 border-border" onClick={signInWithGoogle} disabled={loading}>
               <GoogleIcon /> Sign in with Google
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary">Sign up</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
