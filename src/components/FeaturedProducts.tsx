
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
      title: "Added to Cart ✨",
      description: `${product.name} has been selected.`,
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
        <div className="flex flex-col items-center text-center mb-12 md:mb-20 reveal-on-scroll active">
          <span className="text-accent font-black tracking-[0.8em] uppercase text-[9px] mb-3 block">Boutique Selection</span>
          <h2 className="font-headline text-4xl md:text-7xl text-primary tracking-tighter leading-none">{title}</h2>
          <div className="w-12 h-[1px] bg-accent/20 mt-4 md:mt-6"></div>
        </div>

        <div className="relative">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4 md:-ml-8">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="group relative py-8 px-4 transition-all duration-700 reveal-on-scroll active" style={{ transitionDelay: `${idx * 0.1}s` }}>
                    {/* Elevated background on hover */}
                    <div className="absolute inset-x-0 -inset-y-6 bg-white rounded-[3rem] opacity-0 group-hover:opacity-100 group-hover:bg-primary shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-500 -z-10 group-hover:-translate-y-2"></div>
                    
                    <Link href={`/products/${product.id}`} className="block space-y-8 text-center group-hover:text-white transition-colors duration-500">
                      {/* Floating Image Container */}
                      <div className="relative aspect-[3/4] mx-auto w-[90%] transition-all duration-700 group-hover:-translate-y-6 group-hover:scale-105">
                        {/* Interactive Shadow */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-primary/5">
                          <Image
                            src={product.imageUrls?.[0] || 'https://placehold.co/600x800?text=Forever+Loop'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 90vw, 33vw"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4 px-2">
                        <div className="space-y-1">
                          <h3 className="font-headline text-2xl md:text-4xl text-primary leading-tight truncate px-1 group-hover:text-white transition-colors duration-500">{product.name}</h3>
                          <p className="text-[9px] md:text-[10px] text-primary/30 font-bold uppercase tracking-[0.4em] italic group-hover:text-white/40 transition-colors duration-500">{product.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-6 pt-2">
                           <span className="text-[8px] md:text-[10px] font-black text-primary/20 uppercase tracking-widest group-hover:text-white/20 transition-colors duration-500">Limited Piece</span>
                           <span className="font-headline text-xl md:text-3xl text-primary group-hover:text-white transition-colors duration-500">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full h-14 md:h-16 rounded-full border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-white group-hover:bg-accent group-hover:text-white group-hover:border-transparent text-[9px] md:text-[11px] tracking-[0.4em] font-black uppercase shadow-sm hover:shadow-xl transition-all duration-500 group/btn"
                          >
                            Add to Cart <ShoppingBag className="ml-3 w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12 h-14 w-14 border-none bg-white/90 backdrop-blur-md shadow-2xl hover:bg-primary hover:text-white transition-all rounded-full" />
            <CarouselNext className="hidden md:flex -right-12 h-14 w-14 border-none bg-white/90 backdrop-blur-md shadow-2xl hover:bg-primary hover:text-white transition-all rounded-full" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
