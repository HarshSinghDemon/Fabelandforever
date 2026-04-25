
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

export function CategoryGrid() {
  const collections = [
    { name: 'Artisanal Candles', image: 'https://picsum.photos/seed/cat-candles/600/800', hint: 'luxury candle' },
    { name: 'Forever Flowers', image: 'https://picsum.photos/seed/cat-flowers/600/800', hint: 'crochet bouquet' },
    { name: 'Mythical Creatures', image: 'https://picsum.photos/seed/cat-creatures/600/800', hint: 'crochet dragon' },
    { name: 'Heritage Apparel', image: 'https://picsum.photos/seed/cat-apparel/600/800', hint: 'crochet shawl' },
    { name: 'Bespoke Home', image: 'https://picsum.photos/seed/cat-home/600/800', hint: 'crochet decor' },
    { name: 'Gift Sets', image: 'https://picsum.photos/seed/cat-gifts/600/800', hint: 'gift hamper' },
  ];

  return (
    <section className="py-32 bg-white border-t border-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 reveal-on-scroll">
          <h2 className="font-headline text-4xl sm:text-5xl text-primary tracking-tight">Shop By Collections</h2>
        </div>

        <div className="relative reveal-on-scroll">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-6">
              {collections.map((cat, idx) => (
                <CarouselItem key={idx} className="pl-6 basis-[80%] sm:basis-1/2 lg:basis-1/4">
                  <Link 
                    href="/#shop" 
                    className="group block space-y-6"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted transition-all duration-700 shadow-sm group-hover:shadow-xl">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        data-ai-hint={cat.hint}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 group">
                      <h4 className="font-headline text-xl text-primary group-hover:text-accent transition-colors">{cat.name}</h4>
                      <ArrowRight className="w-4 h-4 text-primary/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:flex justify-end gap-3 mt-12 pr-4">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-black hover:text-white" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-primary/10 hover:bg-black hover:text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
