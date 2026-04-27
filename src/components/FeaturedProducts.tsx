
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  title: string;
  categoryFilter?: string;
  isBestseller?: boolean;
}

export function FeaturedProducts({ title, categoryFilter, isBestseller }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: dbProducts, isLoading } = useCollection(productsQuery);

  const filteredProducts = React.useMemo(() => {
    if (!dbProducts) return [];
    
    let list = dbProducts.filter(p => p.isPublished === true);
    
    if (categoryFilter) {
      list = list.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());
    }
    
    if (isBestseller) {
      list = list.filter(p => p.isBestseller === true);
    }

    if (title === "New Arrivals") {
      return list.slice(0, 8);
    }

    return list;
  }, [dbProducts, categoryFilter, isBestseller, title]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      category: product.category || 'General',
      image: product.imageUrls?.[0] || 'https://placehold.co/600x800?text=Forever+Loop'
    });
    
    toast({
      title: "Selection Added ✨",
      description: `${product.name} is now in your basket.`,
    });
  };

  if (isLoading) {
    return (
      <div className="py-12 md:py-20 container mx-auto px-6 flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-8 h-8 text-primary/10 animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/10">Unrolling {title}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-8 md:mb-16 reveal-on-scroll active">
          <span className="text-accent font-black tracking-[0.8em] uppercase text-[9px] mb-3 block">Boutique Selection</span>
          <h2 className="font-headline text-4xl md:text-7xl text-primary tracking-tighter leading-none">{title}</h2>
          <div className="w-12 h-[1px] bg-accent/20 mt-4 md:mt-6"></div>
        </div>

        {/* Smartphone Horizontal Scroll (2x1 Matrix) */}
        <div className="block md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">
          <div className="flex gap-4 pb-8 min-w-full">
            {filteredProducts.map((product: any, idx: number) => (
              <Link 
                key={product.id}
                href={`/products/${product.id}`}
                className={cn(
                  "group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 active:scale-95 transition-all duration-500 snap-center shrink-0 w-[calc(50%-8px)]",
                )}
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image src={product.imageUrls?.[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-4 space-y-2 relative z-20">
                  <h3 className="font-headline text-sm text-primary truncate group-hover:text-accent font-black uppercase tracking-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-xs text-primary font-black">₹ {product.price.toLocaleString('en-IN')}</span>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden md:block relative">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3">
                  <div className="group relative py-2 md:py-4 px-1 md:px-2 transition-all duration-700 reveal-on-scroll active" style={{ transitionDelay: `${idx * 0.1}s` }}>
                    <div className="absolute inset-x-0 -inset-y-4 bg-accent/5 rounded-[1rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 shadow-xl group-hover:shadow-2xl transition-all duration-500 -z-10 group-hover:-translate-y-2"></div>
                    <Link href={`/products/${product.id}`} className="block space-y-2 md:space-y-6 text-center">
                      <div className="relative aspect-[3/4] mx-auto w-[92%] transition-all duration-700 group-hover:-translate-y-6 group-hover:scale-105 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] md:rounded-[2.5rem] shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-primary/5">
                          <Image src={product.imageUrls?.[0]} alt={product.name} fill className="object-cover" />
                        </div>
                      </div>
                      <div className="space-y-1.5 md:space-y-4 px-2 md:px-4">
                        <h3 className="font-headline text-sm md:text-3xl text-primary group-hover:text-accent transition-colors duration-500 truncate font-black uppercase tracking-tight">{product.name}</h3>
                        <p className="font-headline text-xs md:text-2xl text-primary font-black">₹ {product.price.toLocaleString('en-IN')}</p>
                        <Button onClick={(e) => handleAddToCart(e, product)} className="w-full h-12 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white shadow-sm font-black transition-all">
                          Add to Basket <ShoppingBag className="ml-1.5 w-4 h-4" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 h-14 w-14 bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-primary/5 text-primary hover:bg-primary hover:text-white transition-all" />
            <CarouselNext className="-right-12 h-14 w-14 bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-primary/5 text-primary hover:bg-primary hover:text-white transition-all" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
