
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBasket, ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: dbProducts, isLoading } = useCollection(productsQuery);

  const publishedProducts = React.useMemo(() => {
    return (dbProducts || []).filter(p => p.isPublished === true);
  }, [dbProducts]);

  const categories = [
    'Flowers',
    'Amigurumi',
    'Bag charm',
    'Hair accessories',
    'Bandana',
    'Ribbon bouquet'
  ];

  const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      'Flowers': "Everlasting blooms, hand-woven to capture nature's delicate beauty in every petal.",
      'Amigurumi': "Whimsical companions and tiny guardians, each loop filled with personality and warmth.",
      'Bag charm': "Miniature wonders designed to bring a touch of artisanal magic to your essentials.",
      'Hair accessories': "Delicate, heritage-inspired loops crafted to crown your style with timeless elegance.",
      'Bandana': "Classic headwear, where comfort meets the intricate charm of handcrafted patterns.",
      'Ribbon bouquet': "A modern twist on gifts, blending textured loops with graceful ribbon accents.",
    };
    return descriptions[category] || "Hand-stitched precision meets the warmth of our heritage pieces.";
  };

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
  }, []);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      category: product.category || 'General',
      image: product.imageUrls?.[0] || ''
    });
    toast({
      title: "Added to Cart ✨",
      description: `${product.name} has been selected.`,
    });
  };

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1605649494300-83561a0932da?q=80&w=2070&auto=format&fit=crop" 
            alt="Shop Catalog" 
            fill 
            className="object-cover opacity-40 animate-ken-burns" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
          <div className="reveal-on-scroll active space-y-4 md:space-y-6">
            <span className="text-white/40 font-black tracking-[0.8em] md:tracking-[1em] uppercase text-[9px] mb-2 block">Boutique Curation</span>
            <h1 className="font-headline text-5xl md:text-9xl text-white leading-none tracking-tighter drop-shadow-2xl">
              Shop <span className="italic">Catalog.</span>
            </h1>
            <p className="text-white/60 font-medium max-w-lg mx-auto leading-relaxed italic text-xs md:text-lg px-4">
              "Hand-stitched loops for the heritage home, curated with patience and artisanal care."
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-[70px] md:top-[80px] z-[40] bg-white/95 backdrop-blur-2xl border-b border-primary/5 py-3 md:py-6">
        <div className="container mx-auto px-4 md:px-6 relative max-w-7xl">
          <div className="relative flex items-center max-w-5xl mx-auto">
            <button 
              onClick={() => scrollByAmount('left')}
              className={cn(
                "absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-50 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-xl border border-primary/5 flex items-center justify-center text-primary transition-all duration-300",
                canScrollLeft ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar scroll-smooth py-2 px-2 w-full"
            >
              {categories.map((cat) => (
                <a 
                  key={cat} 
                  href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="whitespace-nowrap text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-all border-b-2 border-transparent hover:border-accent pb-2"
                >
                  {cat}
                </a>
              ))}
            </div>

            <button 
              onClick={() => scrollByAmount('right')}
              className={cn(
                "absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-50 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-xl border border-primary/5 flex items-center justify-center text-primary transition-all duration-300",
                canScrollRight ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-24 md:pb-32">
        {isLoading ? (
          <div className="py-40 md:py-60 flex flex-col items-center gap-6">
             <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary/10 animate-pulse" />
             <p className="text-[10px] font-bold uppercase tracking-[0.6em] md:tracking-[0.8em] text-primary/20">The loom is weaving...</p>
          </div>
        ) : (
          categories.map((category) => {
            const catProducts = publishedProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
            const catId = category.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <section 
                key={category} 
                id={catId} 
                className="py-16 md:py-24 border-b border-primary/5 scroll-mt-24 md:scroll-mt-32"
              >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                  <div className="mb-10 md:mb-20 text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
                    <span className="text-accent font-black tracking-[0.6em] md:tracking-[0.8em] uppercase text-[8px] md:text-[9px]">Collection</span>
                    <h2 className="font-headline text-4xl md:text-7xl text-primary tracking-tighter leading-none">{category}</h2>
                    <p className="text-primary/50 text-xs md:text-sm italic font-medium leading-relaxed px-4">
                      "{getCategoryDescription(category)}"
                    </p>
                  </div>

                  {catProducts.length === 0 ? (
                    <div className="py-12 md:py-24 text-center border-2 border-dashed border-primary/5 rounded-[2rem] md:rounded-[4rem] bg-paper/30 mx-4">
                       <p className="text-primary/20 font-headline text-lg md:text-2xl italic px-6">"New loops coming soon to this collection."</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                      {catProducts.map((product) => (
                        <div key={product.id} className="group relative py-8 px-4 transition-all duration-700">
                          {/* Elevated background on hover */}
                          <div className="absolute inset-x-0 -inset-y-6 bg-white rounded-[2rem] opacity-0 group-hover:opacity-100 group-hover:bg-primary shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-500 -z-10 group-hover:-translate-y-2"></div>
                          
                          <Link href={`/products/${product.id}`} className="block space-y-6 md:space-y-8 text-center group-hover:text-white transition-colors duration-500">
                            {/* Floating Image with Shadow */}
                            <div className="relative aspect-[3/4] mx-auto w-[85%] transition-all duration-700 group-hover:-translate-y-6 group-hover:scale-105">
                              {/* Bottom Shadow Wrapper */}
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              
                              <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-primary/5">
                                <Image
                                  src={product.imageUrls?.[0] || 'https://placehold.co/600x800?text=Forever+Loop'}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 90vw, 30vw"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-3 md:space-y-5 px-6">
                              <h3 className="font-headline text-2xl md:text-4xl text-primary leading-tight px-1 group-hover:text-white transition-colors duration-500">{product.name}</h3>
                              <p className="text-[10px] md:text-xs text-primary/40 leading-relaxed italic line-clamp-2 max-w-[240px] mx-auto group-hover:text-white/40 transition-colors duration-500">
                                {product.description}
                              </p>
                              
                              <div className="flex items-center justify-center gap-4 pt-2">
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/20 group-hover:text-white/20 transition-colors duration-500">{product.category}</span>
                                <span className="font-headline text-xl md:text-3xl text-primary group-hover:text-white transition-colors duration-500">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                              </div>
                              
                              <div className="pt-2">
                                <button 
                                  onClick={(e) => handleAddToCart(e, product)}
                                  className="w-full h-12 md:h-14 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white group-hover:bg-accent group-hover:text-white group-hover:border-transparent transition-all duration-500 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-xl active:scale-95"
                                >
                                  Add to Cart <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>

      <Footer />
    </main>
  );
}
