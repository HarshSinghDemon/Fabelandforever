
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ShoppingBasket, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [activeCategory, setActiveCategory] = useState('All Items');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: dbProducts, loading } = useCollection(productsQuery);

  const allItems = [
    ...(dbProducts || []),
    ...PlaceHolderImages.map(p => ({
      id: p.id,
      title: p.description,
      price: p.price,
      category: p.category,
      image: p.imageUrl,
      imageHint: p.imageHint,
      description: p.story
    }))
  ].slice(0, 15);

  const filteredProducts = activeCategory === 'All Items' 
    ? allItems 
    : allItems.filter(p => p.category === activeCategory);

  const categories = ['All Items', ...new Set(allItems.map(p => p.category))];

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
      title: "Treasure Selected",
      description: `${product.title} added to your basket.`,
    });
  };

  if (loading && dbProducts.length === 0 && allItems.length === 0) {
    return (
      <div className="py-60 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 text-center px-6">Preparing Our Collection...</p>
      </div>
    );
  }

  return (
    <section id="shop" className="py-24 sm:py-40 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-24 reveal-on-scroll">
          <h2 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">New <span className="italic">Arrivals</span></h2>
          <div className="flex justify-center mt-8">
             <Link href="/#shop" className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary border-b border-primary/10 pb-1 transition-all">
               View All
             </Link>
          </div>
        </div>

        <div className="relative reveal-on-scroll">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-8">
              {filteredProducts.map((product: any) => (
                <CarouselItem key={product.id} className="pl-8 basis-full sm:basis-1/2 lg:basis-1/4">
                  <Link 
                    href={`/products/${product.id}`}
                    className="group block space-y-6"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-2xl shadow-lg img-hover-zoom">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-white/95 backdrop-blur-md text-primary p-4 shadow-2xl hover:bg-primary hover:text-white transition-all transform active:scale-90 rounded-full"
                         >
                           <ShoppingBasket className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <h3 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors truncate px-2">{product.title}</h3>
                      <p className="font-bold text-primary/40 text-sm">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
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
