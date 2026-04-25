"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Search, Loader2 } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

  const filteredProducts = allProducts?.filter(product => 
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', href: '/#shop' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-1000",
        isScrolled 
          ? "bg-background/95 backdrop-blur-3xl shadow-sm py-4 border-b border-primary/5" 
          : "bg-transparent py-8"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-8">
            <button 
              className={cn(
                "p-2 -ml-2 transition-all active:scale-90",
                isScrolled ? "text-primary" : "text-white"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:opacity-50",
                    isScrolled ? "text-primary" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="hover:opacity-60 transition-opacity">
              <Logo className={cn(
                "w-10 h-10 transition-colors duration-1000",
                isScrolled ? "text-primary" : "text-white"
              )} />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end space-x-4">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button className={cn(
                  "transition-all p-2 rounded-full active:scale-90",
                  isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
                )}>
                  <Search className="w-4 h-4" />
                </button>
              </DialogTrigger>
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
                    ) : searchQuery === '' ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <p className="col-span-full text-[9px] uppercase tracking-[0.3em] text-primary/40 font-bold mb-4">Trending Collections</p>
                         {['Creature', 'Enchanted', 'Guardian', 'Limited'].map(cat => (
                           <button 
                            key={cat} 
                            onClick={() => setSearchQuery(cat)}
                            className="text-left py-4 px-6 bg-paper hover:bg-primary/10 transition-all text-xs font-bold uppercase tracking-widest border border-primary/5 text-primary rounded-2xl"
                           >
                             {cat}
                           </button>
                         ))}
                      </div>
                    ) : (
                      <div className="grid gap-10">
                        {filteredProducts.map((product) => (
                          <Link 
                            key={product.id} 
                            href="/#shop" 
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-8 group"
                          >
                            <div className="relative w-24 h-32 overflow-hidden bg-muted rounded-2xl">
                              <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-primary group-hover:opacity-60 transition-opacity text-lg">{product.title}</h4>
                              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent mt-2">{product.category}</p>
                              <p className="font-bold text-primary/80 text-sm mt-2">₹ {product.price.toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <CartDrawer isLight={!isScrolled} />
          </div>
        </div>

        {/* Cinematic Mobile Menu Overlay */}
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
          
          <div className="space-y-16 max-w-sm">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/30">Boutique Navigation</p>
              <div className="h-[1px] w-12 bg-primary/10"></div>
            </div>
            
            <div className="space-y-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block text-5xl font-headline text-primary hover:opacity-40 transition-opacity"
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
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-sm font-bold text-primary hover:text-accent">Email Us</Link>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4">Portal</p>
                  <Link href="/admin/login" className="text-sm font-bold text-primary hover:text-accent">Artisan Login</Link>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">
                Based in Kolkata • Delivering within Kolkata
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}