
"use client";

import { useAuthContext } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Users, CreditCard, BarChart2, FileSignature, Newspaper, User, Layers } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuthContext();

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="bg-card border border-border rounded-3xl py-12 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Admin Dashboard</h1>
        {user && <p className="text-muted-foreground md:text-xl mt-4">Welcome, {user.displayName || user.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/admin/profile" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Profile</CardTitle>
                 <User className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Update your public profile information.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/users" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                 <Users className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage user roles and permissions.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/messages" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>View Messages</CardTitle>
                <Mail className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Read and manage messages from the contact form.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/blog" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Management</CardTitle>
                <Newspaper className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Create, edit, and manage blog posts.</p>
              </CardContent>
            </Card>
        </Link>
         <Link href="/admin/quotation" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quotation Generator</CardTitle>
                <FileSignature className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Create and generate professional PDF quotations for clients.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/pricing" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pricing Management</CardTitle>
                <CreditCard className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Update and manage service pricing tiers and add-ons.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/demo-designs" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Demo Designs</CardTitle>
                <Layers className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage the demo websites gallery.</p>
              </CardContent>
            </Card>
        </Link>
        <Link href="/admin/orders" className="block hover:scale-105 transition-transform duration-300">
            <Card className="bg-card border border-border rounded-2xl shadow-lg h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Tracking</CardTitle>
                 <BarChart2 className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage active projects and real-time development progress.</p>
              </CardContent>
            </Card>
        </Link>
      </div>
    </div>
  );
}
