
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

  const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      'Flowers': "Everlasting blooms, hand-woven to capture nature's delicate beauty in every petal.",
      'Amigurumi': "Whimsical companions and tiny guardians, each loop filled with personality and warmth.",
      'Bag charm': "Miniature wonders designed to bring a touch of artisanal magic to your everyday essentials.",
      'Hair accessories': "Delicate, heritage-inspired loops crafted to crown your style with timeless elegance.",
      'Bandana': "Classic artisanal headwear, where comfort meets the intricate charm of handcrafted patterns.",
      'Ribbon bouquet': "A modern twist on timeless gifts, blending textured loops with graceful ribbon accents.",
    };
    return descriptions[category] || "Hand-stitched precision meets the warmth of our heritage treasures.";
  };

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

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
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

  const heroImageUrl = "https://plus.unsplash.com/premium_photo-1675799559554-f2395a6afa45?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <main className="min-h-screen bg-white selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      {/* Shop Hero - Elegant Editorial Entry */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImageUrl} 
            alt="Shop Catalog" 
            fill 
            className="object-cover opacity-60" 
            priority
            data-ai-hint="crochet craft"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <div className="reveal-on-scroll active space-y-6">
            <span className="text-white/40 font-bold tracking-[1em] uppercase text-[9px] mb-4 block">The Collections</span>
            <h1 className="font-headline text-5xl sm:text-9xl text-white leading-none tracking-tighter drop-shadow-2xl">
              Shop <span className="italic">Catalog.</span>
            </h1>
            <div className="w-12 h-[1px] bg-white/20 mx-auto"></div>
            <p className="text-white/60 font-medium max-w-md mx-auto leading-relaxed italic text-sm sm:text-base">
              "Curated treasures for the heritage home, hand-stitched with love and slow-woven loops."
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Category Bar - Minimalist Rail */}
      <div className="sticky top-16 md:top-20 z-[40] bg-white/95 backdrop-blur-2xl border-b border-primary/5 py-4 transition-all">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="relative flex items-center max-w-5xl mx-auto">
            <button 
              onClick={() => scrollByAmount('left')}
              className={cn(
                "absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 rounded-full bg-white shadow-md border border-primary/5 flex items-center justify-center text-primary transition-all duration-300",
                canScrollLeft ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-8 w-full"
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
                      "whitespace-nowrap px-6 py-2 rounded-none text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border-b-2 shrink-0 cursor-pointer",
                      activeTab === id 
                        ? "text-primary border-primary" 
                        : "text-primary/30 border-transparent hover:text-primary hover:border-primary/20"
                    )}
                  >
                    {cat}
                  </a>
                );
              })}
            </div>

            <button 
              onClick={() => scrollByAmount('right')}
              className={cn(
                "absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 rounded-full bg-white shadow-md border border-primary/5 flex items-center justify-center text-primary transition-all duration-300",
                canScrollRight ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
              className="py-16 sm:py-24 border-b border-primary/5 scroll-mt-40"
            >
              <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Elegant Collection Header */}
                <div className="mb-20 text-center max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-[1px] bg-primary/10"></div>
                    <span className="text-primary/40 font-bold tracking-[0.6em] uppercase text-[8px]">Curator's Note</span>
                    <div className="w-8 h-[1px] bg-primary/10"></div>
                  </div>
                  <h2 className="font-headline text-4xl sm:text-7xl text-primary tracking-tighter leading-none">{category}</h2>
                  <p className="text-primary/50 text-xs sm:text-sm italic font-medium leading-relaxed px-4">
                    "{getCategoryDescription(category)}"
                  </p>
                </div>

                {/* 2x2 Minimalist Editorial Matrix */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24">
                  {catProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="group space-y-6"
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-background rounded-none border border-primary/5 transition-all duration-700 shadow-sm group-hover:shadow-2xl">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 50vw"
                          />
                        </div>
                      </Link>
                      
                      <div className="space-y-4 text-center">
                        <div className="space-y-2">
                          <h3 className="font-headline text-lg sm:text-2xl text-primary tracking-tight truncate px-2">{product.title}</h3>
                          <p className="font-bold text-primary/40 text-[10px] tracking-[0.3em] uppercase italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="pt-2">
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-none border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-500 font-bold uppercase tracking-[0.4em] text-[8px] active:scale-95 group/btn"
                          >
                            Adopt Treasure <ShoppingBasket className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" />
                          </button>
                        </div>
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
