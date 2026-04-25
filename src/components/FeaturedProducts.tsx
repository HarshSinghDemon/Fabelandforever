
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
import { ShoppingBasket } from 'lucide-react';

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

  const filteredProducts = React.useMemo(() => {
    let list = allItems;
    if (categoryFilter) {
      list = list.filter(p => p.category === categoryFilter);
    }
    if (isBestseller) {
      list = list.slice(0, 8);
    } else {
      list = list.slice(-8);
    }
    return list;
  }, [allItems, categoryFilter, isBestseller]);

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
      title: "Selection Adopted ✨",
      description: `${product.title} has been selected.`,
    });
  };

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-1 md:py-2 bg-background overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-2 md:mb-4 reveal-on-scroll">
          <span className="text-accent font-bold tracking-[0.8em] uppercase text-[7px] mb-1 block">Curator's Note</span>
          <h2 className="font-headline text-2xl md:text-4xl text-primary tracking-tight">{title}</h2>
          <div className="w-8 h-[1px] bg-accent/20 mt-2"></div>
        </div>

        <div className="relative px-4 md:px-14">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <div className="group space-y-3 transition-all duration-700 reveal-on-scroll" style={{ transitionDelay: `${idx * 0.05}s` }}>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-none shadow-sm transition-all duration-[2s] group-hover:shadow-xl border border-primary/5 stitching-border">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </Link>
                    
                    <div className="space-y-2 text-center px-1">
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-[9px] tracking-[0.05em] uppercase">{product.title}</h3>
                        <p className="font-bold text-primary/30 text-[8px] tracking-[0.2em] italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        variant="outline"
                        className="w-full h-9 border-primary/10 hover:border-primary text-[8px] tracking-[0.3em]"
                      >
                        Adopt Selection
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 h-10 w-10 border-none bg-white/50 backdrop-blur-sm shadow-sm hover:bg-primary hover:text-white transition-all rounded-none" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 h-10 w-10 border-none bg-white/50 backdrop-blur-sm shadow-sm hover:bg-primary hover:text-white transition-all rounded-none" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
