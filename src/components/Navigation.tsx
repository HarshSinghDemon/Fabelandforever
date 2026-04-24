
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles, Search, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Shop 🛍️', href: '/#shop' },
    { name: 'Custom 🧶', href: '/#custom' },
    { name: 'Our Story 📖', href: '/#story' },
    { name: 'Contact 💌', href: '/#contact' },
  ];

  const SearchButton = () => (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogTrigger asChild>
        <button className="text-primary/60 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5 active:scale-90">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-paper">
          <DialogTitle className="font-headline text-3xl text-primary mb-4">Find a Treasure</DialogTitle>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
            <Input 
              placeholder="Search for toys, blankets, or magic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-16 rounded-2xl border-2 border-primary/5 focus:border-accent bg-white text-lg"
              autoFocus
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-8 pt-0 bg-white">
          <div className="space-y-6">
            {loadingProducts ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : searchQuery && filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground italic">"No treasures match your whisper... try another spell."</p>
              </div>
            ) : searchQuery === '' ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground italic text-sm">"What are you looking for today?"</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href="/#shop" 
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-6 p-4 rounded-3xl hover:bg-paper transition-all group border border-transparent hover:border-accent/10"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-accent/10">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-lg group-hover:text-accent transition-colors">{product.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹ {product.price.toLocaleString('en-IN')}</p>
                    <ArrowRight className="w-4 h-4 ml-auto text-primary/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <nav className={cn(
      "fixed top-3 sm:top-6 left-0 right-0 z-50 transition-all duration-700 px-3 sm:px-6",
    )}>
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-10 py-2 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] transition-all duration-700",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-white/40 py-2 sm:py-3 scale-[0.98]" 
          : "bg-white/60 backdrop-blur-md border border-white/20"
      )}>
        <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:scale-105 transition-all group">
          <Logo className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
          <span className="font-headline text-base sm:text-2xl text-primary font-bold whitespace-nowrap">
            Fable & Forever
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-colors relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-accent/40 rounded-full transition-all group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-primary/10">
            <SearchButton />
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-1 sm:gap-2">
          <SearchButton />
          <CartDrawer />
          <button 
            className="text-primary p-2 hover:bg-accent/20 rounded-full transition-colors active:scale-90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "md:hidden fixed inset-x-3 top-16 sm:top-20 bg-white/95 backdrop-blur-2xl rounded-[1.8rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col space-y-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-white/30 transition-all duration-500 origin-top z-[60]",
        isMobileMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
      )}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="text-xl sm:text-3xl font-headline text-primary hover:text-accent transition-all flex items-center justify-between group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
            <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 text-accent transition-all" />
          </Link>
        ))}
        <div className="pt-4 border-t border-primary/10">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-primary/20 active:scale-95 transition-transform"
          >
            Explore Treasures ✨
          </button>
        </div>
      </div>
    </nav>
  );
}
