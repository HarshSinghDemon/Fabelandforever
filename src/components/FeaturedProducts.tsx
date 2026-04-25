
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Sparkles } from 'lucide-react';

interface FeaturedProductsProps {
  title: string;
  categoryFilter?: string;
  isBestseller?: boolean;
}

export function FeaturedProducts({ title, categoryFilter, isBestseller }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  // Use a simplified query and filter on the client to avoid indexing delays and missing field issues
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

    // New Arrivals logic: Limit to top 8 from the sorted list
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
      image: product.imageUrls?.[0] || ''
    });
    
    toast({
      title: "Selection Adopted ✨",
      description: `${product.name} has been selected.`,
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 container mx-auto px-6 flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-8 h-8 text-primary/10 animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/10">Unrolling {title}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16 reveal-on-scroll active">
          <span className="text-accent font-bold tracking-[0.8em] uppercase text-[9px] mb-4 block">Boutique Selection</span>
          <h2 className="font-headline text-4xl md:text-6xl text-primary tracking-tighter">{title}</h2>
          <div className="w-16 h-[1px] bg-accent/20 mt-6"></div>
        </div>

        <div className="relative px-4 md:px-14">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group space-y-6 transition-all duration-700 reveal-on-scroll active" style={{ transitionDelay: `${idx * 0.1}s` }}>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-none shadow-sm transition-all duration-[2s] group-hover:shadow-2xl border border-primary/5 stitching-border">
                        <Image
                          src={product.imageUrls?.[0] || 'https://placehold.co/600x800?text=Forever+Loop'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </Link>
                    
                    <div className="space-y-4 text-center px-2">
                      <div className="space-y-1">
                        <h3 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors truncate px-2">{product.name}</h3>
                        <p className="font-bold text-primary/40 text-sm tracking-widest italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          variant="outline"
                          className="w-full h-12 rounded-none border-primary/10 hover:border-primary text-[9px] tracking-[0.4em] font-black"
                        >
                          Adopt Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-6 h-12 w-12 border-none bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all rounded-none" />
            <CarouselNext className="hidden md:flex -right-6 h-12 w-12 border-none bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all rounded-none" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
