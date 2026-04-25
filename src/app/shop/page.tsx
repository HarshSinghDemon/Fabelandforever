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
import { ShoppingBasket, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 300);
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [categories]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: [0.1], rootMargin: "-20% 0% -60% 0%" }
    );

    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [allItems]);

  useEffect(() => {
    if (activeTab && scrollContainerRef.current) {
      const activePill = scrollContainerRef.current.querySelector(`[data-category="${activeTab}"]`);
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        setTimeout(checkScroll, 600);
      }
    }
  }, [activeTab]);

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
    <main className="min-h-screen bg-white selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      {/* Shop Hero - Minimalist & Clean */}
      <section className="pt-40 pb-20 border-b border-primary/5">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="reveal-on-scroll active">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-6 block">The Collective</span>
            <h1 className="font-headline text-6xl sm:text-8xl text-primary leading-none mb-8 tracking-tighter">
              Boutique <span className="italic">Catalog.</span>
            </h1>
            <p className="text-primary/60 font-bold uppercase tracking-[0.4em] text-[10px] max-w-md mx-auto leading-relaxed italic">
              "Curated treasures for the heritage home, hand-stitched with love and slow-woven loops."
            </p>
          </div>
        </div>
      </section>

      {/* Modern Sticky Category Bar - Solid Minimalist */}
      <div className="sticky top-16 md:top-20 z-[40] bg-white border-b border-primary/5 py-3 transition-all">
        <div className="container mx-auto px-6 relative">
          <div className="relative flex items-center">
            
            <button 
              onClick={() => scrollByAmount('left')}
              aria-label="Scroll Left"
              className={cn(
                "absolute -left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white shadow-lg border border-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300",
                canScrollLeft ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-4 w-full"
            >
              {categories.map((cat) => {
                const id = cat.toLowerCase();
                return (
                  <a 
                    key={cat} 
                    href={`#${id}`}
                    data-category={id}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(id);
                      if (element) {
                        const yOffset = -140; 
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border-2 shrink-0 cursor-pointer",
                      activeTab === id 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white text-primary/40 border-primary/5 hover:border-accent hover:text-primary"
                    )}
                  >
                    {cat}
                  </a>
                );
              })}
            </div>

            <button 
              onClick={() => scrollByAmount('right')}
              aria-label="Scroll Right"
              className={cn(
                "absolute -right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white shadow-lg border border-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300",
                canScrollRight ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10",
              canScrollLeft ? "opacity-100" : "opacity-0"
            )} />
            <div className={cn(
              "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10",
              canScrollRight ? "opacity-100" : "opacity-0"
            )} />
          </div>
        </div>
      </div>

      <div className="flex-1 pb-48">
        {categories.map((category) => {
          const catProducts = allItems.filter(p => p.category === category);
          const catId = category.toLowerCase();
          
          return (
            <section 
              key={category} 
              id={catId} 
              className="py-24 border-b border-primary/5 scroll-mt-40"
            >
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-accent"></div>
                      <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px]">The Collection</span>
                    </div>
                    <h2 className="font-headline text-5xl sm:text-7xl text-primary tracking-tighter leading-none">{category}</h2>
                  </div>
                  <div className="max-w-xs md:text-right">
                    <p className="text-primary/60 text-[12px] italic font-medium leading-relaxed">
                      Hand-stitched precision meets the warmth of the {category.toLowerCase()} aesthetic.
                    </p>
                  </div>
                </div>

                {/* 2x1 Minimalist Matrix Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12">
                  {catProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="group space-y-6"
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-2xl border border-primary/5 transition-all duration-500">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      </Link>
                      
                      <div className="space-y-4 text-center">
                        <div className="space-y-1">
                          <h3 className="font-bold text-primary text-[11px] tracking-[0.1em] uppercase">{product.title}</h3>
                          <p className="font-bold text-primary/60 text-[10px] tracking-[0.2em]">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full h-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.4em] text-[8px] transition-all active:scale-95 shadow-sm"
                        >
                          Adopt Piece
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
