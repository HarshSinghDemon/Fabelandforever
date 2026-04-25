
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
      ? allItems.slice(0, 8) // Simplified bestseller logic
      : allItems.slice(allItems.length - 8); // Simplified new arrivals logic

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
    <section className="py-24 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="font-headline text-4xl sm:text-5xl text-primary leading-tight">{title}</h2>
          <div className="flex justify-center mt-4">
             <Link href="/#shop" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-all flex items-center gap-2">
               View all <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>

        <div className="relative reveal-on-scroll">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-6 sm:-ml-10">
              {filteredProducts.map((product: any) => (
                <CarouselItem key={product.id} className="pl-6 sm:pl-10 basis-full sm:basis-1/2 lg:basis-1/4">
                  <div className="group space-y-6">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-2xl shadow-sm transition-all group-hover:shadow-xl">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                    </Link>
                    
                    <div className="space-y-4 text-center">
                      <div className="space-y-1">
                        <h3 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors truncate px-2">{product.title}</h3>
                        <p className="font-bold text-primary/60 text-sm">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full h-12 rounded-xl bg-black hover:bg-black/90 text-white font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:flex justify-center gap-4 mt-12">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-primary hover:text-white" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-primary hover:text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
