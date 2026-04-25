
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
  
  const categoryBarRef = useRef<HTMLDivElement>(null);
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

  // Check scroll positions
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: [0.1, 0.4, 0.8], rootMargin: "-25% 0% -25% 0%" }
    );

    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [allItems]);

  // Auto-scroll the active pill into view
  useEffect(() => {
    if (activeTab && scrollContainerRef.current) {
      const activePill = scrollContainerRef.current.querySelector(`[data-category="${activeTab}"]`);
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
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
    <main className="min-h-screen bg-paper selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      {/* Shop Hero */}
      <section className="pt-40 pb-16 border-b border-primary/5 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="reveal-on-scroll active">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[8px] mb-6 block">The Collective</span>
            <h1 className="font-headline text-5xl sm:text-8xl text-primary leading-none mb-8 tracking-tighter">
              Boutique <span className="italic">Catalog.</span>
            </h1>
            <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[9px] max-w-md mx-auto leading-relaxed italic">
              "Curated treasures for the heritage home, hand-stitched with love and slow-woven loops."
            </p>
          </div>
        </div>
      </section>

      {/* Modern Sticky Slim Category Bar */}
      <div className="sticky top-16 md:top-20 z-[40] bg-paper/90 backdrop-blur-xl border-b border-primary/5 py-4 transition-all shadow-sm">
        <div className="container mx-auto px-6 relative group">
          
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 shadow-lg border border-primary/5 flex items-center justify-center text-primary hover:bg-white transition-all hidden md:flex"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 md:px-0"
          >
            {categories.map((cat) => {
              const id = cat.toLowerCase();
              return (
                <a 
                  key={cat} 
                  href={`#${id}`}
                  data-category={id}
                  className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border-2 shrink-0",
                    activeTab === id 
                      ? "bg-primary text-white border-primary shadow-lg scale-105" 
                      : "bg-white/50 text-primary/40 border-primary/5 hover:border-accent/30 hover:text-primary"
                  )}
                >
                  {cat}
                </a>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 shadow-lg border border-primary/5 flex items-center justify-center text-primary hover:bg-white transition-all hidden md:flex"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {/* Subtle Fades for scroll indication */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-paper to-transparent pointer-events-none z-10 transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )} />
          <div className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-paper to-transparent pointer-events-none z-10 transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </div>

      <div className="flex-1 pb-32 sm:pb-48">
        {categories.map((category, catIdx) => {
          const catProducts = allItems.filter(p => p.category === category);
          const catId = category.toLowerCase();
          
          return (
            <section 
              key={category} 
              id={catId} 
              className={cn(
                "py-24 sm:py-32 border-b border-primary/5 scroll-mt-40 transition-opacity duration-1000",
                activeTab === catId ? "opacity-100" : "opacity-40"
              )}
            >
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 reveal-on-scroll active">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-accent/30"></div>
                      <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px]">The Collection</span>
                    </div>
                    <h2 className="font-headline text-5xl sm:text-7xl text-primary tracking-tighter leading-none">{category}</h2>
                  </div>
                  <div className="max-w-xs md:text-right border-l md:border-l-0 md:border-r border-primary/10 pl-6 md:pl-0 md:pr-6 py-2">
                    <p className="text-primary/40 text-[12px] italic font-medium leading-relaxed">
                      Hand-stitched precision meets the warmth of the {category.toLowerCase()} aesthetic.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                  {catProducts.map((product, idx) => (
                    <div 
                      key={product.id} 
                      className="group space-y-6 reveal-on-scroll active"
                      style={{ transitionDelay: `${idx * 0.05}s` }}
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[2rem] shadow-sm transition-all duration-1000 group-hover:shadow-3xl border border-primary/5 stitching-border">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        </div>
                      </Link>
                      
                      <div className="space-y-4 text-center px-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-primary group-hover:text-accent transition-all duration-500 truncate text-[11px] tracking-[0.1em] uppercase">{product.title}</h3>
                          <p className="font-bold text-primary/30 text-[10px] tracking-[0.2em] italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.4em] text-[9px] transition-all active:scale-95 shadow-xl group/btn"
                        >
                          <span className="flex items-center gap-2">
                            Adopt Piece <ShoppingBasket className="w-4 h-4" />
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
