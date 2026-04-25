"use client";

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: dbProducts } = useCollection(productsQuery);

  const allItems = React.useMemo(() => {
    const items = [
      ...(dbProducts || []),
      ...PlaceHolderImages.filter(p => p.category !== 'Hero' && p.category !== 'Banner').map(p => ({
        id: p.id,
        title: p.description,
        price: p.price,
        category: p.category,
        image: p.imageUrl,
        description: p.story
      }))
    ];
    return items;
  }, [dbProducts]);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(allItems.map(item => item.category)));
    return cats.sort();
  }, [allItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.intersectionRatio > 0.4) {
               setActiveTab(entry.target.id);
            }
          }
        });
      },
      { threshold: [0.1, 0.4, 0.8] }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [allItems]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || 'General',
      image: product.image
    });
    toast({
      title: "Added to Basket ✨",
      description: `${product.title} is now yours.`,
    });
  };

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Shop Hero */}
      <section className="pt-48 pb-24 sm:pb-32 border-b border-primary/5 bg-white/50">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="reveal-on-scroll">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-8 block">Artisanal Catalog</span>
            <h1 className="font-headline text-6xl sm:text-9xl text-primary leading-none mb-10 tracking-tighter">
              The <span className="italic">Shop.</span>
            </h1>
            <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[10px] max-w-md mx-auto leading-relaxed">
              Every loop is a promise. Every stitch is a story. Curated treasures for the heritage home.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Responsive Category Bar */}
      <div className="sticky top-[72px] z-50 bg-white/90 backdrop-blur-xl border-b border-primary/5">
        <div className="container mx-auto relative px-0 overflow-hidden">
          {/* Subtle edge fades to indicate scrolling on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent z-10 sm:hidden pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent z-10 sm:hidden pointer-events-none"></div>
          
          <div className="flex items-center gap-3 sm:gap-12 overflow-x-auto no-scrollbar scroll-smooth py-4 sm:py-6 px-6 sm:px-12 flex-nowrap touch-pan-x">
             {categories.map((cat) => (
                <a 
                  key={cat} 
                  href={`#${cat.toLowerCase()}`}
                  className={cn(
                    "flex-shrink-0 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] px-5 py-2.5 sm:px-0 sm:py-0 rounded-full transition-all duration-500 whitespace-nowrap",
                    activeTab === cat.toLowerCase()
                      ? "bg-primary text-white sm:bg-transparent sm:text-accent sm:scale-110" 
                      : "bg-primary/5 text-primary/40 hover:text-accent sm:bg-transparent"
                  )}
                >
                  {cat}
                </a>
             ))}
             {/* Spacer for scroll-padding effect */}
             <div className="w-6 flex-shrink-0 sm:hidden"></div>
          </div>
        </div>
      </div>

      <div className="pb-32 sm:pb-48">
        {categories.map((category, catIdx) => {
          const catProducts = allItems.filter(p => p.category === category);
          return (
            <section 
              key={category} 
              id={category.toLowerCase()} 
              className={cn(
                "py-24 sm:py-40 border-b border-primary/5 scroll-mt-32",
                catIdx % 2 === 1 ? "bg-white/30" : "bg-transparent"
              )}
            >
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-28 gap-8 reveal-on-scroll">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-accent/30"></div>
                      <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px]">Collection</span>
                    </div>
                    <h2 className="font-headline text-5xl sm:text-8xl text-primary tracking-tighter">{category}</h2>
                  </div>
                  <div className="max-w-xs md:text-right">
                    <p className="text-primary/40 text-xs sm:text-sm italic font-medium leading-relaxed">
                      "Curated treasures crafted with {category.toLowerCase()} in mind, ensuring a legacy of comfort and hand-stitched warmth."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-16">
                  {catProducts.map((product, idx) => (
                    <div 
                      key={product.id} 
                      className="group space-y-8 reveal-on-scroll"
                      style={{ transitionDelay: `${idx * 0.1}s` }}
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[2.5rem] sm:rounded-[4rem] shadow-sm transition-all duration-1000 group-hover:shadow-2xl border border-primary/5 stitching-border">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            <span className="bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest text-primary shadow-lg border border-primary/5">
                              View Details
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="space-y-5 text-center px-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-[11px] sm:text-xs tracking-[0.1em] uppercase">{product.title}</h3>
                          <p className="font-bold text-primary/40 text-[10px] sm:text-xs tracking-widest italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full h-12 sm:h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[8px] sm:text-[10px] transition-all active:scale-95 shadow-lg relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Add To Basket <ShoppingBasket className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
