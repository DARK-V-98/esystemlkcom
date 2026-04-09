
'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Code, Rocket, LogIn, LayoutGrid, User as UserIcon, LogOut, MessageCircle } from "lucide-react";
import { useAuthContext, useAuth } from "@/hooks/use-auth";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuthContext();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Demo Designs", href: "/demo-designs" },
    { name: "Pricing", href: "/pricing" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Courses", href: "/courses" },
    { name: "Track Project", href: "/track" },
    { name: "Blog", href: "/blog" },
    { name: "Tools", href: "/tools"},
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  
  const MobileMenu = () => (
    <div className="flex flex-col h-full">
        <SheetHeader className="p-6 border-b flex-shrink-0">
          <SheetTitle asChild>
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              <Image src="/logo.png" alt="ESystemLk Logo" width={30} height={30} className="rounded-lg" />
              <span className="text-xl font-bold tracking-wide">
                <span className="text-foreground">ESYSTEM</span>
                <span style={{color:'hsl(200,100%,50%)', textShadow:'0 0 10px hsl(200,100%,50%,0.8)'}}>LK</span>
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-grow">
          <div className="p-6">
            {user && (
              <div className="pb-6 border-b mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                    <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="font-semibold truncate">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <Button asChild variant="ghost" className="justify-start">
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                  </Button>
                   <Button asChild variant="ghost" className="justify-start">
                      <Link href={`/profile/${user.uid}`} onClick={() => setIsMobileMenuOpen(false)}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                  </Button>
                   <Button asChild variant="ghost" className="justify-start">
                      <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-lg py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border flex-shrink-0 flex flex-col gap-4">
          {user ? (
             <Button variant="outline" size="lg" className="gap-2 w-full" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}>
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
          ) : (
             <Button asChild variant="hero" size="lg" className="gap-2 w-full">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </Button>
          )}
        </div>
      </div>
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
        isScrolled || isMobileMenuOpen
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="ESystemLk Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold tracking-wide">
              <span className="text-foreground">ESYSTEM</span>
              <span style={{color:'hsl(200,100%,50%)', textShadow:'0 0 10px hsl(200,100%,50%,0.8)'}}>LK</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
             <Button asChild variant="hero" size="sm" className="gap-2">
              <Link href="/contact">
                <Rocket className="w-4 h-4" />
                Get Started
              </Link>
            </Button>
            {loading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                      <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/admin">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href={`/profile/${user.uid}`}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                     <Link href="/messages">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                 <button
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[80vw] sm:max-w-sm bg-background">
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
