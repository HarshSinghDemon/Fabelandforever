"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Search, ShoppingBasket, Loader2 } from 'lucide-react';
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
    { name: 'Shop', href: '/#shop' },
    { name: 'Custom', href: '/#custom' },
    { name: 'Our Story', href: '/about' },
  ];

  const SearchButton = () => (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogTrigger asChild>
        <button className={cn(
          "transition-all p-2 rounded-full hover:bg-white/10",
          isScrolled ? "text-primary" : "text-white"
        )}>
          <Search className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-none shadow-2xl p-0 overflow-hidden rounded-none sm:rounded-3xl">
        <DialogHeader className="p-8 pb-4 bg-background">
          <DialogTitle className="font-headline text-3xl text-primary mb-6 text-center">Search Boutique</DialogTitle>
          <div className="relative border-b border-primary/20 pb-4">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
            <Input 
              placeholder="What are you looking for?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-12 border-none bg-transparent text-xl placeholder:text-primary/20 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-8 pt-0 bg-background">
          <div className="space-y-8">
            {loadingProducts ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : searchQuery && filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground italic">No treasures match your search.</p>
              </div>
            ) : searchQuery === '' ? (
              <div className="grid grid-cols-2 gap-4">
                 <p className="col-span-2 text-[10px] uppercase tracking-widest text-primary/40 font-bold mb-2">Suggested Categories</p>
                 {['Creatures', 'Guardians', 'Enchanted', 'Toys'].map(cat => (
                   <button 
                    key={cat} 
                    onClick={() => setSearchQuery(cat)}
                    className="text-left py-3 px-4 bg-muted hover:bg-primary/5 transition-colors text-sm font-medium"
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href="/#shop" 
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-6 group"
                  >
                    <div className="relative w-24 h-24 overflow-hidden bg-muted rounded-xl">
                      <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary group-hover:opacity-60 transition-opacity">{product.title}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mt-1">{product.category}</p>
                      <p className="font-medium text-primary/60 text-sm mt-1">₹ {product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.3em] py-2.5 text-center fixed top-0 w-full z-[70] transition-transform duration-500">
        Free Hand-Stitched Magic on Orders Over ₹2,000
      </div>

      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-700 mt-[35px]",
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl shadow-md py-4 mt-0" 
          : "bg-transparent py-8"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <button 
              className={cn(
                "md:hidden p-2 -ml-2 transition-colors",
                isScrolled ? "text-primary" : "text-white"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:opacity-60",
                    isScrolled ? "text-primary" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className={cn(
                "w-12 h-12 transition-colors duration-700",
                isScrolled ? "text-primary" : "text-white"
              )} />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-6">
            <SearchButton />
            <CartDrawer isLight={!isScrolled} />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "md:hidden fixed inset-0 top-0 bg-background/98 backdrop-blur-2xl z-[80] transition-all duration-700 p-8 pt-32",
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}>
          <button 
            className="absolute top-10 right-8 text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="space-y-10 text-center max-w-xs mx-auto">
            <div className="flex justify-center mb-16">
               <Logo className="w-20 h-20 text-primary" />
            </div>
            {navLinks.map((link, idx) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block text-4xl font-headline text-primary animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-20 border-t border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-8">Artisan Portal</p>
              <Link 
                href="/admin/login" 
                className="inline-block py-4 px-10 rounded-full border border-primary/20 text-sm font-bold uppercase tracking-widest text-primary/60 hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
