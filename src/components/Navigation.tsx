"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Loader2, Home, LayoutGrid, Sparkles, ArrowRight, Instagram } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const db = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allDbProducts, loading: loadingProducts } = useCollection(productsQuery);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim() || !allDbProducts) return [];
    const queryStr = searchQuery.toLowerCase();
    return allDbProducts
      .filter(p => p.isPublished === true)
      .filter(product => {
        const titleMatch = product.name?.toLowerCase().includes(queryStr);
        const categoryMatch = product.category?.toLowerCase().includes(queryStr);
        return titleMatch || categoryMatch;
      });
  }, [allDbProducts, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHomePage ? 100 : 20;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Flowers', href: '/shop#flowers' },
    { name: 'Amigurumi', href: '/shop#amigurumi' },
    { name: 'Our Story', href: '/about' },
    { name: 'Connect', href: '/#contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-700",
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-primary/5 py-4 shadow-sm" 
          : "bg-transparent py-10"
      )}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between relative">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 md:gap-5 group">
                <Logo className={cn(
                  "w-9 h-9 md:w-12 md:h-12 transition-colors duration-500",
                  isScrolled ? "text-primary" : "text-white"
                )} />
                <span className={cn(
                  "font-headline text-xl md:text-4xl font-bold tracking-tighter hidden sm:block transition-all duration-700",
                  (!isHomePage || isScrolled) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none",
                  isScrolled ? "text-primary" : "text-white"
                )}>
                  Fable & Forever
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-14">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:text-accent whitespace-nowrap",
                    isScrolled ? "text-primary" : "text-white drop-shadow-md"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 md:gap-10">
              <Link 
                href="https://www.instagram.com/fable.and.forever/"
                target="_blank"
                className={cn(
                  "hidden xs:flex items-center gap-3 px-6 py-2.5 rounded-full border-2 transition-all text-[9px] font-black uppercase tracking-widest group/ig",
                  isScrolled 
                    ? "border-accent/20 text-accent hover:bg-accent hover:text-white" 
                    : "border-white/30 text-white hover:bg-white hover:text-primary"
                )}
              >
                Order via DM <Instagram className="w-3.5 h-3.5 ml-1 group-hover/ig:rotate-12 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 rounded-full transition-all active:scale-90",
                  isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
                )}
              >
                <Search className="w-5 h-5 md:w-6 h-6" />
              </button>
              <CartDrawer isLight={!isScrolled && isHomePage} />
            </div>
          </div>
        </div>

        <Dialog open={isSearchOpen} onOpenChange={(open) => {
          setIsSearchOpen(open);
          if (!open) setSearchQuery('');
        }}>
          <DialogContent className="sm:max-w-[600px] w-full border-none shadow-2xl p-0 overflow-hidden rounded-none bg-paper h-screen sm:h-auto">
            <div className="p-8 md:p-12 pb-4 h-full flex flex-col">
              <DialogHeader className="mb-10">
                <div className="flex flex-col gap-2 mb-8">
                  <DialogTitle className="font-headline text-4xl md:text-5xl text-primary tracking-tighter">
                    Search
                  </DialogTitle>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60 italic">Exploring the boutique scrolls</p>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-accent transition-colors" />
                  <Input 
                    placeholder="What shall we find?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-14 md:h-16 border-none border-b-2 border-primary/5 bg-transparent text-xl md:text-2xl placeholder:text-primary/10 focus-visible:ring-0 rounded-none text-primary font-headline"
                    autoFocus
                  />
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 pb-10">
                <div className="space-y-6">
                  {loadingProducts && searchQuery && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Searching collection...</p>
                    </div>
                  )}
                  
                  {searchQuery && filteredProducts.length === 0 && !loadingProducts ? (
                    <div className="text-center py-16">
                      <p className="text-primary/40 font-headline text-xl italic">"No creations match this query."</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredProducts.map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/products/${product.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-4 md:gap-6 p-4 md:p-5 hover:bg-white rounded-none border border-transparent hover:border-primary/5 transition-all group shadow-sm"
                        >
                          <div className="relative w-14 h-18 md:w-16 md:h-20 overflow-hidden bg-muted/20 flex-shrink-0">
                            <Image 
                              src={product.imageUrls?.[0] || 'https://placehold.co/400x500'} 
                              alt={product.name} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-headline text-lg md:text-xl text-primary group-hover:text-accent transition-colors truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-accent/60">
                                {product.category}
                              </span>
                              <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-primary/10 rounded-full"></span>
                              <span className="font-bold text-primary/60 text-[10px] md:text-xs">
                                ₹ {product.price?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-primary/5 h-22 flex items-center justify-around px-4 pb-6 pt-3 shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 group">
          <Home className="w-5 h-5 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center gap-1.5 group">
          <LayoutGrid className="w-5 h-5 text-primary/60" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Shop</span>
        </Link>
        <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-1.5 group">
          <Search className="w-5 h-5 text-primary/60" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Search</span>
        </button>
        <div className="scale-90">
          <CartDrawer isLight={false} />
        </div>
      </div>
    </>
  );
}