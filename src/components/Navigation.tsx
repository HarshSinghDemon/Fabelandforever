"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search, Loader2, Home, LayoutGrid, X, Sparkles } from 'lucide-react';
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
          <DialogContent className="sm:max-w-[700px] w-[95vw] border-none shadow-2xl p-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-paper">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent/20"></div>
            
            <DialogHeader className="p-8 md:p-12 pb-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <DialogTitle className="font-headline text-3xl sm:text-4xl text-primary tracking-tighter">
                    Search <span className="italic">Treasures</span>
                  </DialogTitle>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Artisanal Catalog</p>
                </div>
              </div>
              
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
                <Input 
                  placeholder="What can the weavers find for you?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-14 border-none border-b-2 border-primary/5 bg-transparent text-xl placeholder:text-primary/20 focus-visible:ring-0 rounded-none text-primary font-headline"
                  autoFocus
                />
              </div>
            </DialogHeader>

            <ScrollArea className="h-[50vh] px-8 md:px-12 pb-10">
              <div className="space-y-8">
                {loadingProducts ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Opening the Scrolls...</p>
                  </div>
                ) : searchQuery && filteredProducts.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6 text-primary/20" />
                    </div>
                    <p className="text-primary/60 italic font-medium text-lg">"No treasures match your search."</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(searchQuery ? filteredProducts : allProducts?.slice(0, 6))?.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-primary/5 hover:border-accent/30 transition-all hover:shadow-xl hover:-translate-y-1 group"
                      >
                        <div className="relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden bg-muted rounded-xl shadow-sm">
                          {product.image && (
                            <Image 
                              src={product.image} 
                              alt={product.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors text-sm sm:text-base leading-tight uppercase tracking-tight">
                            {product.title}
                          </h4>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent/60">
                            {product.category}
                          </p>
                          <p className="font-bold text-primary/40 text-[10px] sm:text-xs">
                            ₹ {product.price?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {!searchQuery && (
              <div className="px-12 pb-8 flex items-center gap-4 text-primary/20 italic text-[11px] font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Try searching for "Candles", "Flowers", or "Mythical"</span>
              </div>
            )}
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
