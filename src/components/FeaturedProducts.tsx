
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
    <section className="py-8 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 reveal-on-scroll">
          <h2 className="font-headline text-3xl sm:text-4xl text-primary tracking-tight mb-2">{title}</h2>
          <Link href="/#shop" className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-accent transition-all underline decoration-accent/20 underline-offset-4">
            View all
          </Link>
        </div>

        <div className={cn(
          "relative reveal-on-scroll max-w-7xl mx-auto",
          sideImage ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""
        )}>
          {sideImage && (
            <div className="lg:col-span-1 relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-xl">
               <Image 
                src={sideImage} 
                alt="Collection Feature" 
                fill 
                className="object-cover transition-transform duration-[10s] group-hover:scale-110" 
              />
               <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-8 text-center">
                  {sideTitle && (
                    <div className="space-y-1">
                      <p className="text-white/80 font-bold uppercase tracking-[0.4em] text-[10px]">Most Loved</p>
                      <h3 className="text-white font-fancy text-4xl drop-shadow-lg">{sideTitle}</h3>
                    </div>
                  )}
               </div>
            </div>
          )}

          <div className={cn(sideImage ? "lg:col-span-3" : "w-full")}>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-4">
                {filteredProducts.map((product: any) => (
                  <CarouselItem key={product.id} className={cn(
                    "pl-4 basis-[85%]",
                    sideImage ? "sm:basis-1/2 lg:basis-1/3" : "sm:basis-1/2 lg:basis-1/4"
                  )}>
                    <div className="group space-y-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xl shadow-sm transition-all group-hover:shadow-lg border border-primary/5">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                      </Link>
                      
                      <div className="space-y-4 text-center px-1">
                        <div className="space-y-1">
                          <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-sm tracking-tight">{product.title}</h3>
                          <p className="font-bold text-primary/60 text-xs">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full h-12 rounded-lg bg-black hover:bg-black/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-md"
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 border-primary/10 hover:bg-black hover:text-white transition-all shadow-sm" />
                <CarouselNext className="static translate-y-0 h-10 w-10 border-primary/10 hover:bg-black hover:text-white transition-all shadow-sm" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
