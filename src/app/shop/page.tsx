
"use client";

import React, { useEffect, useState, useRef } from 'react';
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
  
  // Ref for the sidebar to handle independent scrolling if needed
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Robust Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: [0.1, 0.3, 0.6], rootMargin: "-10% 0% -10% 0%" }
    );

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
    <main className="min-h-screen bg-paper selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      {/* Shop Hero */}
      <section className="pt-48 pb-24 sm:pb-40 border-b border-primary/5 bg-white/50">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="reveal-on-scroll active">
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

      <div className="flex-1 flex relative">
        {/* Modern Vertical Category Sidebar - Works for Mobile & Desktop */}
        <aside 
          className="fixed left-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 bg-white/60 backdrop-blur-2xl border-r border-primary/5 z-[50] flex flex-col shadow-2xl transition-all duration-500"
        >
          <div 
            ref={sidebarRef}
            className="flex-1 overflow-y-auto no-scrollbar py-40 flex flex-col items-center gap-12"
          >
            {categories.map((cat) => (
              <a 
                key={cat} 
                href={`#${cat.toLowerCase()}`}
                className={cn(
                  "writing-vertical-lr rotate-180 flex items-center justify-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] transition-all duration-700 whitespace-nowrap py-6 relative group",
                  activeTab === cat.toLowerCase()
                    ? "text-accent scale-110" 
                    : "text-primary/20 hover:text-primary/60"
                )}
              >
                {/* Active Indicator Line */}
                {activeTab === cat.toLowerCase() && (
                  <div className="absolute top-0 right-0 w-[2px] h-full bg-accent animate-in fade-in slide-in-from-bottom-2 duration-500" />
                )}
                {cat}
              </a>
            ))}
          </div>
          
          {/* Scroll instruction for mobile */}
          <div className="py-8 flex flex-col items-center gap-2 opacity-20">
             <div className="w-[1px] h-8 bg-primary" />
             <span className="text-[6px] uppercase font-bold tracking-widest writing-vertical-lr rotate-180">Swipe</span>
          </div>
        </aside>

        {/* Main Product Feed - Offset to accommodate the fixed sidebar */}
        <div className="flex-1 pl-16 md:pl-24 lg:pl-32 pb-32 sm:pb-48 overflow-hidden">
          {categories.map((category, catIdx) => {
            const catProducts = allItems.filter(p => p.category === category);
            return (
              <section 
                key={category} 
                id={category.toLowerCase()} 
                className={cn(
                  "py-24 sm:py-48 border-b border-primary/5 scroll-mt-24 transition-opacity duration-1000",
                  activeTab === category.toLowerCase() ? "opacity-100" : "opacity-40"
                )}
              >
                <div className="container mx-auto px-6 max-w-7xl">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 sm:mb-32 gap-12 reveal-on-scroll active">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-[1px] bg-accent/30"></div>
                        <span className="text-accent font-bold tracking-[0.8em] uppercase text-[9px]">Collection</span>
                      </div>
                      <h2 className="font-headline text-5xl sm:text-9xl text-primary tracking-tighter leading-none">{category}</h2>
                    </div>
                    <div className="max-w-sm lg:text-right border-l lg:border-l-0 lg:border-r border-primary/10 pl-8 lg:pl-0 lg:pr-8 py-2">
                      <p className="text-primary/40 text-[13px] italic font-medium leading-relaxed">
                        "Curated treasures crafted with {category.toLowerCase()} in mind, ensuring a legacy of comfort and hand-stitched warmth."
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
                    {catProducts.map((product, idx) => (
                      <div 
                        key={product.id} 
                        className="group space-y-8 reveal-on-scroll active"
                        style={{ transitionDelay: `${idx * 0.1}s` }}
                      >
                        <Link href={`/products/${product.id}`} className="block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[2.5rem] shadow-sm transition-all duration-1000 group-hover:shadow-3xl border border-primary/5 stitching-border">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0">
                              <span className="bg-white/95 backdrop-blur-md px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] text-primary shadow-2xl border border-primary/5">
                                View Piece
                              </span>
                            </div>
                          </div>
                        </Link>
                        
                        <div className="space-y-6 text-center px-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-primary group-hover:text-accent transition-all duration-500 truncate text-[12px] tracking-[0.15em] uppercase">{product.title}</h3>
                            <p className="font-bold text-primary/30 text-[11px] tracking-[0.2em] italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                          </div>
                          
                          <Button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.4em] text-[9px] transition-all active:scale-95 shadow-xl group/btn relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              Adopt Treasure <ShoppingBasket className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
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
      </div>

      <Footer />
    </main>
  );
}
