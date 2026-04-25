
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Search, User, Loader2 } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const db = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: allProducts, loading: loadingProducts } = useCollection(productsQuery);

  const filteredProducts = React.useMemo(() => {
    if (!allProducts || !searchQuery) return [];
    return allProducts.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = product.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || categoryMatch;
    });
  }, [allProducts, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Candles', href: '/#shop' },
    { name: 'Forever Flowers', href: '/#shop' },
    { name: 'Gift Sets', href: '/#shop' },
    { name: 'Decor Essentials', href: '/#shop' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact Us', href: '/#contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-700",
        isScrolled 
          ? "bg-background/95 backdrop-blur-3xl shadow-md py-4 border-b border-primary/5" 
          : "bg-transparent py-8"
      )}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Logo className={cn(
                  "w-10 h-10 transition-colors duration-700",
                  isScrolled ? "text-primary" : "text-white"
                )} />
                <span className={cn(
                  "font-headline text-2xl tracking-tight hidden sm:block",
                  isScrolled ? "text-primary" : "text-white"
                )}>Fable & Forever</span>
              </Link>
            </div>

            <div className="flex-1 max-w-2xl hidden md:block">
              <div className={cn(
                "relative flex items-center h-12 rounded-lg border px-4 transition-all",
                isScrolled 
                  ? "bg-paper/50 border-primary/10 focus-within:border-primary/30" 
                  : "bg-white/10 border-white/20 focus-within:bg-white/20"
              )}>
                <Search className={cn("w-4 h-4 mr-3", isScrolled ? "text-primary/40" : "text-white/40")} />
                <input 
                  type="text"
                  placeholder="Search our treasures..."
                  readOnly
                  className={cn(
                    "bg-transparent border-none focus:ring-0 text-sm w-full placeholder:italic cursor-pointer",
                    isScrolled ? "text-primary placeholder:text-primary/30" : "text-white placeholder:text-white/30"
                  )}
                  onClick={() => setIsSearchOpen(true)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/admin/login" className={cn(
                "p-2 transition-all hover:opacity-50",
                isScrolled ? "text-primary" : "text-white"
              )}>
                <User className="w-5 h-5" />
              </Link>
              
              <CartDrawer isLight={!isScrolled} />

              <button 
                className={cn(
                  "p-2 lg:hidden transition-all",
                  isScrolled ? "text-primary" : "text-white"
                )}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center items-center gap-8 hidden lg:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent",
                  isScrolled ? "text-primary/60" : "text-white/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-[800px] border-none shadow-2xl p-0 overflow-hidden rounded-[2.5rem] bg-background">
            <DialogHeader className="p-8 pb-4">
              <DialogTitle className="font-headline text-3xl text-primary mb-8 text-left uppercase tracking-tighter">Find Treasure</DialogTitle>
              <div className="relative border-b border-primary/10 pb-4">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                <Input 
                  placeholder="Search our catalog..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-12 border-none bg-transparent text-xl placeholder:text-primary/20 focus-visible:ring-0 rounded-none text-primary"
                  autoFocus
                />
              </div>
            </DialogHeader>
            <ScrollArea className="h-[60vh] p-8 pt-0">
              <div className="space-y-12">
                {loadingProducts ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : searchQuery && filteredProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground italic font-medium">No results found.</p>
                  </div>
                ) : (
                  <div className="grid gap-10">
                    {(searchQuery ? filteredProducts : allProducts?.slice(0, 5))?.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-8 group"
                      >
                        <div className="relative w-24 h-32 overflow-hidden bg-muted rounded-2xl">
                          {product.image && <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-primary group-hover:opacity-60 transition-opacity text-lg">{product.title}</h4>
                          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent mt-2">{product.category}</p>
                          <p className="font-bold text-primary/80 text-sm mt-2">₹ {product.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <div className={cn(
          "fixed inset-x-4 top-4 bottom-4 bg-background/98 backdrop-blur-3xl z-[80] transition-all duration-700 p-10 pt-32 rounded-[3rem] shadow-2xl",
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
        )}>
          <button 
            className="absolute top-10 right-10 text-primary p-2 transition-all active:scale-90"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-16">
            <div className="space-y-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block text-4xl font-headline text-primary hover:opacity-40 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-24 space-y-10 border-t border-primary/5">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4">Contact</p>
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-sm font-bold text-primary">Email Us</Link>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4">Portal</p>
                  <Link href="/admin/login" className="text-sm font-bold text-primary">Artisan Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
