
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Loader2, Instagram, Menu } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const useLightStyle = isHomePage && !isScrolled;

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

  // Listen for the custom event from the MobileBottomNav
  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search-dialog', handleOpenSearch);
    return () => window.removeEventListener('open-search-dialog', handleOpenSearch);
  }, []);

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
        useLightStyle 
          ? "bg-transparent py-2 sm:py-4" 
          : "bg-white/95 backdrop-blur-xl border-b border-primary/10 py-3 shadow-sm"
      )}>
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between relative">
            <div className="lg:hidden flex-1 flex justify-start">
               <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className={cn("p-2 rounded-full transition-all active:scale-90", useLightStyle ? "text-white" : "text-primary")} aria-label="Open menu"><Menu className="w-6 h-6" /></button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 border-none bg-primary z-[200]">
                    <SheetHeader className="p-8 border-b border-white/5"><SheetTitle className="text-white font-headline text-2xl">Menu</SheetTitle></SheetHeader>
                    <div className="flex flex-col p-8 space-y-6">
                      {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-black uppercase tracking-[0.5em] text-white/60 hover:text-white transition-all active:translate-x-2">{link.name}</Link>
                      ))}
                      <Link href="https://www.instagram.com/fable.and.forever/" target="_blank" className="flex items-center gap-4 pt-8 border-t border-white/10 text-accent font-black uppercase tracking-widest text-[10px]">Order via DM <Instagram className="w-4 h-4" /></Link>
                    </div>
                  </SheetContent>
               </Sheet>
            </div>

            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link href="/" className="flex items-center gap-3 md:gap-5 group active:scale-95 transition-transform">
                <Logo className={cn("w-8 h-8 md:w-10 md:h-10 transition-colors duration-500", useLightStyle ? "text-white" : "text-primary")} />
                <span className={cn(
                  "font-headline text-xl md:text-3xl font-bold tracking-tighter hidden lg:block transition-all duration-700",
                  (!isHomePage || isScrolled) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none",
                  useLightStyle ? "text-white" : "text-primary"
                )}>
                  <span className="text-[#FBBF24] text-[1.3em] inline-block leading-none">F</span>able & <span className="text-[#FBBF24] text-[1.3em] inline-block leading-none">F</span>orever
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={cn("text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-accent whitespace-nowrap", useLightStyle ? "text-white drop-shadow-md" : "text-primary")}>{link.name}</Link>
              ))}
            </div>

            <div className="flex-1 flex items-center justify-end gap-2 md:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className={cn("p-2 rounded-full transition-all active:scale-75", useLightStyle ? "text-white hover:bg-white/10" : "text-primary hover:bg-primary/5")} aria-label="Search"><Search className="w-5 h-5" /></button>
              <CartDrawer isLight={useLightStyle} />
            </div>
          </div>
        </div>

        <Dialog open={isSearchOpen} onOpenChange={(open) => { setIsSearchOpen(open); if (!open) setSearchQuery(''); }}>
          <DialogContent className="sm:max-w-[600px] w-full border-none shadow-2xl p-0 overflow-hidden rounded-none bg-paper h-screen sm:h-auto z-[150]">
            <div className="p-8 md:p-12 pb-4 h-full flex flex-col">
              <DialogHeader className="mb-10">
                <DialogTitle className="font-headline text-4xl text-primary tracking-tighter mb-8">Search</DialogTitle>
                <div className="relative group">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-accent transition-colors" />
                  <Input placeholder="What shall we find?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-14 border-none border-b-2 border-primary/10 bg-transparent text-xl md:text-2xl focus-visible:ring-0 rounded-none text-primary font-headline" autoFocus />
                </div>
              </DialogHeader>
              <ScrollArea className="flex-1 pb-10">
                <div className="space-y-6">
                  {loadingProducts && searchQuery && <div className="flex flex-col items-center justify-center py-12 gap-4"><Loader2 className="w-6 h-6 text-accent animate-spin" /><p className="text-[10px] font-bold uppercase tracking widest text-primary/30">Searching...</p></div>}
                  {searchQuery && filteredProducts.length === 0 && !loadingProducts ? <div className="text-center py-12"><p className="text-primary/40 font-headline text-lg italic">"No creations match."</p></div> : (
                    <div className="flex flex-col gap-4">
                      {filteredProducts.map((product) => (
                        <Link key={product.id} href={`/products/${product.id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-4 hover:bg-white border border-transparent hover:border-primary/5 transition-all group shadow-sm">
                          <div className="relative w-14 h-18 overflow-hidden bg-muted/20 flex-shrink-0"><Image src={product.imageUrls?.[0] || 'https://placehold.co/400x500'} alt={product.name} fill className="object-cover" /></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-headline text-lg text-primary group-hover:text-accent transition-colors truncate uppercase font-black tracking-tight">{product.name}</h4>
                            <div className="flex items-center gap-3 mt-1.5"><span className="text-[8px] font-bold uppercase tracking-widest text-accent/60">{product.category}</span><span className="font-black text-primary/60 text-[10px]">₹ {product.price?.toLocaleString('en-IN')}</span></div>
                          </div>
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
    </>
  );
}
