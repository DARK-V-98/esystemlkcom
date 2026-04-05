
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
import { Checkbox } from "@/components/ui/checkbox";

const signupSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { user, loading } = useAuthContext();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [user, loading, router]);

  const onSubmit = (data: SignupFormValues) => {
    signUpWithEmail(data.email, data.password, data.displayName);
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
            <h2 className="text-3xl font-bold">Create Your Future</h2>
            <p className="text-accent-foreground/80 mt-2">Join us and start building your digital presence today.</p>
          </div>
        </div>
        {/* Right Panel */}
        <div className="p-8">
            <CardHeader className="text-left p-0 mb-8">
              <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">Sign In</Link>
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="rounded-lg bg-background border-border focus:border-primary focus:ring-0" disabled={loading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                         <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...field} className="rounded-lg bg-background border-border focus:border-primary focus:ring-0 pr-10" disabled={loading} />
                           <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms-desktop" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel htmlFor="terms-desktop" className="text-sm font-normal text-muted-foreground">
                             I agree to the <Link href="/privacy-policy" className="text-primary hover:underline">Terms & Conditions</Link>
                          </FormLabel>
                        </div>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg" size="lg" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
            
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-muted-foreground text-sm">OR</span>
            </div>

            <Button variant="outline" className="w-full rounded-lg" size="lg" onClick={signInWithGoogle} disabled={loading}>
              <GoogleIcon /> Sign Up with Google
            </Button>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden w-full flex flex-col min-h-[80vh] bg-background relative overflow-hidden rounded-3xl shadow-2xl border border-border">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-primary/10 via-background to-background blur-xl"></div>
        <div className="p-6 flex-shrink-0 z-10">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft />
            </Link>
          </Button>
        </div>
        
        <div className="px-6 pb-6 z-10">
          <h1 className="text-3xl font-bold">Let's Get Started</h1>
          <p className="text-muted-foreground">Fill the form to continue</p>
        </div>

        <div className="flex-grow p-6 z-10 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} className="h-12 rounded-xl bg-secondary/50 border-border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} className="h-12 rounded-xl bg-secondary/50 border-border" />
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
                    <FormLabel>Choose a Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="min. 8 characters" {...field} className="h-12 rounded-xl bg-secondary/50 border-border pr-10" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" {...field} className="h-12 rounded-xl bg-secondary/50 border-border pr-10" />
                         <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-10 w-10 text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between py-2">
                    <FormLabel htmlFor="terms-mobile" className="mb-0 text-muted-foreground">
                      I agree with <Link href="/privacy-policy" className="text-primary">terms of use</Link>
                    </FormLabel>
                    <FormControl>
                      <Switch id="terms-mobile" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="basis-full" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 rounded-xl text-base" variant="dark" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="px-6 pb-6 text-center z-10 space-y-4 flex-shrink-0">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-muted-foreground text-sm">OR</span>
            </div>
            <Button variant="outline" className="w-full h-14 rounded-xl text-base bg-secondary/50 border-border" onClick={signInWithGoogle} disabled={loading}>
               <GoogleIcon /> Sign up with Google
            </Button>
             <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary">Sign in</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
