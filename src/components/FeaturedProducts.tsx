"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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
  bannerImage?: string;
  reverse?: boolean;
}

export function FeaturedProducts({ title, categoryFilter, isBestseller, bannerImage, reverse = false }: FeaturedProductsProps) {
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
    <section className="py-12 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
          reverse ? "lg:flex-row-reverse" : ""
        )}>
          {/* Featured Banner */}
          <div className={cn(
            "lg:col-span-5 h-[500px] lg:h-[600px] relative rounded-[1.5rem] overflow-hidden shadow-xl reveal-on-scroll",
            reverse ? "lg:order-last" : ""
          )}>
            <Image 
              src={bannerImage || `https://picsum.photos/seed/${title}/800/1200`}
              alt={title}
              fill
              className="object-cover transition-transform duration-[10s] hover:scale-110"
              data-ai-hint="luxury crochet"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
              <p className="text-white/80 font-bold uppercase tracking-[0.3em] text-[10px]">Exclusively in Kolkata</p>
            </div>
          </div>

          {/* Carousel Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="text-center lg:text-left reveal-on-scroll">
              <h2 className="font-headline text-3xl sm:text-4xl text-primary tracking-tight mb-1">{title}</h2>
              <Link href="/#shop" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-accent transition-all inline-flex items-center gap-2">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="relative reveal-on-scroll">
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-3">
                  {filteredProducts.map((product: any) => (
                    <CarouselItem key={product.id} className="pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                      <div className="group space-y-3">
                        <Link href={`/products/${product.id}`} className="block">
                          <div className="relative aspect-square overflow-hidden bg-muted rounded-xl shadow-sm transition-all group-hover:shadow-lg border border-primary/5">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        </Link>
                        
                        <div className="space-y-3 text-center px-1">
                          <div className="space-y-0.5">
                            <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-xs">{product.title}</h3>
                            <p className="font-bold text-primary/60 text-[11px]">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
                          </div>
                          
                          <Button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full h-10 rounded-lg bg-black hover:bg-black/90 text-white font-bold uppercase tracking-widest text-[9px] transition-all active:scale-95 shadow-md"
                          >
                            Add to cart
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center lg:justify-start gap-2 mt-6">
                  <CarouselPrevious className="static translate-y-0 h-8 w-8 border-primary/10 hover:bg-black hover:text-white" />
                  <CarouselNext className="static translate-y-0 h-8 w-8 border-primary/10 hover:bg-black hover:text-white" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}