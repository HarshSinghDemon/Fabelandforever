
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  title: string;
  categoryFilter?: string;
  isBestseller?: boolean;
  sideImage?: string;
  sideTitle?: string;
}

export function FeaturedProducts({ title, categoryFilter, isBestseller, sideImage, sideTitle }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: dbProducts } = useCollection(productsQuery);

  const allItems = [
    ...(dbProducts || []),
    ...PlaceHolderImages.map(p => ({
      id: p.id,
      title: p.description,
      price: p.price,
      category: p.category,
      image: p.imageUrl,
      description: p.story
    }))
  ];

  const filteredProducts = categoryFilter 
    ? allItems.filter(p => p.category === categoryFilter)
    : isBestseller 
      ? allItems.slice(0, 8) 
      : allItems.slice(allItems.length - 8);

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

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden border-t border-primary/5 reveal-on-scroll">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[8px] md:text-[9px] mb-4 block">Curated Collection</span>
          <h2 className="font-headline text-3xl md:text-5xl text-primary tracking-tight">{title}</h2>
          <div className="w-12 h-[1px] bg-accent/30 mt-6 mb-4"></div>
        </div>

        {/* Universal Carousel: 2x1 on Mobile, 4x1 on Desktop */}
        <div className="max-w-7xl mx-auto">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {filteredProducts.map((product: any) => (
                <CarouselItem key={product.id} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <div className="group space-y-4 md:space-y-6">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xl shadow-sm transition-all duration-700 group-hover:shadow-2xl border border-primary/5">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </Link>
                    
                    <div className="space-y-4 text-center px-1">
                      <div className="space-y-1">
                        <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-[11px] md:text-sm tracking-tight uppercase">{product.title}</h3>
                        <p className="font-bold text-primary/60 text-[10px] md:text-xs">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full h-10 md:h-12 rounded-lg bg-black hover:bg-black/90 text-white font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] transition-all active:scale-95 shadow-md"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center gap-4 mt-12">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-black hover:text-white transition-all shadow-lg" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-black hover:text-white transition-all shadow-lg" />
            </div>

            {/* Mobile "Swipe" Indicator */}
            <div className="md:hidden flex justify-center mt-8">
              <div className="flex gap-1">
                <div className="w-8 h-1 bg-primary/20 rounded-full">
                  <div className="w-1/3 h-full bg-accent rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
