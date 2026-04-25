"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, Loader2, Home, LayoutGrid, X } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Candles', href: '/#shop' },
    { name: 'Flowers', href: '/#shop' },
    { name: 'Gift Sets', href: '/#shop' },
    { name: 'Decor', href: '/#shop' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500",
        isScrolled 
          ? "bg-white border-b border-primary/5 py-3" 
          : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between relative h-12">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <Logo className={cn(
                  "w-8 h-8 md:w-10 md:h-10 transition-colors duration-500",
                  isScrolled ? "text-primary" : "text-white"
                )} />
                <span className={cn(
                  "font-headline text-xl md:text-2xl tracking-tight hidden sm:block",
                  isScrolled ? "text-primary" : "text-white"
                )}>Fable & Forever</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-8">
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

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 rounded-full transition-all active:scale-95",
                  isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
                )}
              >
                <Search className="w-5 h-5" />
              </button>
              <CartDrawer isLight={!isScrolled} />
            </div>
          </div>
        </div>

        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-[700px] w-[95vw] border-none shadow-2xl p-0 overflow-hidden rounded-[2rem] bg-background">
            <DialogHeader className="p-6 md:p-10 pb-4">
              <div className="flex items-center justify-between mb-6">
                <DialogTitle className="font-headline text-2xl text-primary uppercase tracking-tighter">Find Treasure</DialogTitle>
              </div>
              <div className="relative border-b border-primary/10 pb-4">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                <Input 
                  placeholder="Search our catalog..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-10 border-none bg-transparent text-lg placeholder:text-primary/20 focus-visible:ring-0 rounded-none text-primary"
                  autoFocus
                />
              </div>
            </DialogHeader>
            <ScrollArea className="h-[50vh] px-6 md:px-10 pb-8">
              <div className="space-y-6">
                {loadingProducts ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : searchQuery && filteredProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground italic font-medium text-sm">No treasures match your search.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {(searchQuery ? filteredProducts : allProducts?.slice(0, 4))?.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 group"
                      >
                        <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden bg-muted rounded-xl">
                          {product.image && <Image src={product.image} alt={product.title} fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors text-xs md:text-sm">{product.title}</h4>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary/30 mt-1">{product.category}</p>
                          <p className="font-bold text-primary/80 text-[10px] md:text-xs mt-0.5">₹ {product.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </nav>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-primary/5 h-20 flex items-center justify-around px-4 pb-4 pt-2 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 group">
          <Home className="w-5 h-5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Home</span>
        </Link>
        <Link href="/#shop" className="flex flex-col items-center gap-1.5 group">
          <LayoutGrid className="w-5 h-5 text-primary/40 group-hover:text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Shop</span>
        </Link>
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-1.5 group">
          <Search className="w-5 h-5 text-primary/40 group-hover:text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Search</span>
        </button>
        <CartDrawer isLight={false} />
      </div>
    </>
  );
}
