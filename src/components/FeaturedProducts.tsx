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

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: dbProducts } = useCollection(productsQuery);

  const allItems = React.useMemo(() => {
    const items = [
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
    return items;
  }, [dbProducts]);

  const filteredProducts = React.useMemo(() => {
    if (categoryFilter) {
      return allItems.filter(p => p.category === categoryFilter);
    }
    if (isBestseller) {
      return allItems.slice(0, 8);
    }
    return allItems.slice(-8);
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
      title: "Added to Basket ✨",
      description: `${product.title} is now yours.`,
    });
  };

  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden border-t border-primary/5 reveal-on-scroll">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-accent font-bold tracking-[0.8em] uppercase text-[9px] mb-6 block">Curated Collection</span>
          <h2 className="font-headline text-4xl md:text-6xl text-primary tracking-tight">{title}</h2>
          <div className="w-16 h-[1px] bg-accent/30 mt-8 mb-6"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-6">
              {filteredProducts.map((product: any, idx: number) => (
                <CarouselItem key={product.id} className="pl-6 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <div className="group space-y-6 hover:-translate-y-2 transition-transform duration-700">
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[1.5rem] shadow-sm transition-all duration-700 group-hover:shadow-2xl border border-primary/5">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </Link>
                    
                    <div className="space-y-4 text-center px-2">
                      <div className="space-y-2">
                        <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-[12px] md:text-sm tracking-[0.1em] uppercase">{product.title}</h3>
                        <p className="font-bold text-primary/40 text-[11px] md:text-xs tracking-widest italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <Button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full h-12 md:h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] transition-all active:scale-95 shadow-lg group/btn overflow-hidden relative"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Add to Basket <ShoppingBasket className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center gap-6 mt-20">
              <CarouselPrevious className="static translate-y-0 h-16 w-16 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-xl rounded-full" />
              <CarouselNext className="static translate-y-0 h-16 w-16 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-xl rounded-full" />
            </div>

            {/* Mobile "Swipe" Indicator */}
            <div className="md:hidden flex justify-center mt-12">
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-accent rounded-full animate-[shimmer_3s_infinite]"></div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}