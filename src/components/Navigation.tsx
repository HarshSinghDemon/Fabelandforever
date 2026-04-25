"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Loader2, Home, LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const db = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: allDbProducts, loading: loadingProducts } = useCollection(productsQuery);

  const allAvailableProducts = React.useMemo(() => {
    const dbItems = allDbProducts || [];
    const placeholders = PlaceHolderImages.map(p => ({
      id: p.id,
      title: p.description,
      price: p.price,
      category: p.category,
      image: p.imageUrl,
      description: p.story
    }));
    
    const combined = [...dbItems];
    placeholders.forEach(p => {
      if (!combined.some(item => item.id === p.id)) {
        combined.push(p);
      }
    });
    
    return combined;
  }, [allDbProducts]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allAvailableProducts.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(query);
      const categoryMatch = product.category?.toLowerCase().includes(query);
      return (titleMatch || categoryMatch) && product.category !== 'Hero' && product.category !== 'Banner';
    });
  }, [allAvailableProducts, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHomePage ? 200 : 40;
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

  const showBrandText = !isHomePage || isScrolled;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-700",
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-primary/5 py-2.5 shadow-sm" 
          : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between relative h-12">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="transition-all duration-700 ease-in-out transform">
                  <Logo className={cn(
                    "w-8 h-8 md:w-9 md:h-9 transition-colors duration-500",
                    isScrolled ? "text-primary" : "text-white"
                  )} />
                </div>
                <span className={cn(
                  "font-headline text-xl md:text-2xl tracking-tighter hidden sm:block transition-all duration-1000 delay-100",
                  showBrandText ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
                  isScrolled ? "text-primary" : "text-white"
                )}>
                  Fable & Forever
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-10 xl:gap-14">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[8px] font-bold uppercase tracking-[0.4em] transition-all hover:text-accent whitespace-nowrap",
                    isScrolled ? "text-primary/50" : "text-white/60"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 rounded-full transition-all active:scale-95",
                  isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
                )}
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <CartDrawer isLight={!isScrolled} />
            </div>
          </div>
        </div>

        <Dialog open={isSearchOpen} onOpenChange={(open) => {
          setIsSearchOpen(open);
          if (!open) setSearchQuery('');
        }}>
          <DialogContent className="sm:max-w-[500px] w-[95vw] border-none shadow-2xl p-0 overflow-hidden rounded-none bg-paper">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent/20"></div>
            
            <DialogHeader className="p-10 pb-4">
              <div className="flex flex-col gap-1 mb-6">
                <DialogTitle className="font-headline text-4xl text-primary tracking-tighter">
                  Search
                </DialogTitle>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60 italic">Exploring the boutique scrolls</p>
              </div>
              
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
                <Input 
                  placeholder="What shall we find?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-12 border-none border-b border-primary/10 bg-transparent text-xl placeholder:text-primary/10 focus-visible:ring-0 rounded-none text-primary font-headline"
                  autoFocus
                />
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] px-10 pb-10">
              <div className="space-y-4">
                {loadingProducts && searchQuery && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40 italic">Searching collection...</p>
                  </div>
                )}
                
                {searchQuery && filteredProducts.length === 0 && !loadingProducts ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-primary/60 italic font-medium">"No creations match this query."</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-4 hover:bg-white rounded-none border border-transparent hover:border-primary/5 transition-all group shadow-sm hover:shadow-md"
                      >
                        <div className="relative w-12 h-16 overflow-hidden bg-muted/20 rounded-none">
                          {product.image && (
                            <Image 
                              src={product.image} 
                              alt={product.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors text-xs uppercase tracking-tight truncate">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-accent/60">
                              {product.category}
                            </span>
                            <span className="w-1 h-1 bg-primary/10 rounded-full"></span>
                            <span className="font-bold text-primary/60 text-[10px]">
                              ₹ {product.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-primary/5 h-20 flex items-center justify-around px-4 pb-4 pt-2 shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 group">
          <Home className="w-5 h-5 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center gap-1.5 group">
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
