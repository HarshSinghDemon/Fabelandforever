
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
import { Sparkles } from 'lucide-react';

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
      <div className="py-20 container mx-auto px-6 flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-8 h-8 text-primary/10 animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/10">Unrolling {title}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-32 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10 md:mb-20 reveal-on-scroll active">
          <span className="text-accent font-black tracking-[0.8em] uppercase text-[9px] mb-4 block">Boutique Selection</span>
          <h2 className="font-headline text-4xl md:text-7xl text-primary tracking-tighter leading-none">{title}</h2>
          <div className="w-16 h-[1px] bg-accent/20 mt-6 md:mt-8"></div>
        </div>

        <div className="relative">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-3 md:-ml-6">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-3 md:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="group space-y-4 md:space-y-8 transition-all duration-700 reveal-on-scroll active" style={{ transitionDelay: `${idx * 0.1}s` }}>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-none shadow-sm transition-all duration-[2s] group-hover:shadow-2xl border border-primary/5 stitching-border">
                        <Image
                          src={product.imageUrls?.[0] || 'https://placehold.co/600x800?text=Forever+Loop'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </Link>
                    
                    <div className="space-y-2 md:space-y-4 text-center px-1">
                      <div className="space-y-0.5 md:space-y-1">
                        <h3 className="font-headline text-lg md:text-3xl text-primary group-hover:text-accent transition-colors truncate px-1 leading-tight">{product.name}</h3>
                        <p className="font-black text-primary/40 text-[10px] md:text-sm tracking-widest italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="pt-1 md:pt-2">
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          variant="outline"
                          className="w-full h-10 md:h-14 rounded-none border-primary/10 hover:border-primary text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.5em] font-black"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 border-none bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all rounded-none" />
            <CarouselNext className="hidden md:flex -right-12 h-12 w-12 border-none bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all rounded-none" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
