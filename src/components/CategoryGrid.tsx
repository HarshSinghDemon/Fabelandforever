
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

export function CategoryGrid() {
  const collections = [
    { name: 'Artisanal Candles', image: 'https://picsum.photos/seed/cat-candles/800/1000', hint: 'luxury candle' },
    { name: 'Forever Flowers', image: 'https://picsum.photos/seed/cat-flowers/800/1000', hint: 'crochet bouquet' },
    { name: 'Mythical Creatures', image: 'https://picsum.photos/seed/cat-creatures/800/1000', hint: 'crochet dragon' },
    { name: 'Heritage Apparel', image: 'https://picsum.photos/seed/cat-apparel/800/1000', hint: 'crochet shawl' },
    { name: 'Bespoke Home', image: 'https://picsum.photos/seed/cat-home/800/1000', hint: 'crochet decor' },
    { name: 'Gift Sets', image: 'https://picsum.photos/seed/cat-gifts/800/1000', hint: 'gift hamper' },
  ];

  return (
    <section className="py-24 bg-white border-t border-primary/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-4 block">Curation</span>
          <h2 className="font-headline text-4xl sm:text-5xl text-primary tracking-tight">Shop By <span className="italic">Collections</span></h2>
          <div className="w-12 h-[1px] bg-accent/30 mx-auto mt-6"></div>
        </div>

        <div className="relative reveal-on-scroll">
          <Carousel 
            opts={{ 
              align: "start", 
              loop: true,
              dragFree: false
            }} 
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {collections.map((cat, idx) => (
                <CarouselItem key={idx} className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 px-2">
                  <Link 
                    href="/#shop" 
                    className="group block space-y-6"
                  >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-paper transition-all duration-1000 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-2xl border border-primary/5">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                        data-ai-hint={cat.hint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="absolute bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                         <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary shadow-lg border border-primary/5">
                            View Treasures
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 group">
                      <h4 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors duration-500">{cat.name}</h4>
                      <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-primary/30 group-hover:text-accent transition-all">
                        Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-end gap-4 mt-12 pr-4">
              <CarouselPrevious className="static translate-y-0 h-14 w-14 border-primary/5 bg-white shadow-xl hover:bg-primary hover:text-white transition-all" />
              <CarouselNext className="static translate-y-0 h-14 w-14 border-primary/5 bg-white shadow-xl hover:bg-primary hover:text-white transition-all" />
            </div>

            {/* Mobile Progress Bar Indicator */}
            <div className="md:hidden flex justify-center mt-12">
              <div className="w-24 h-[2px] bg-primary/5 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-accent w-1/3 animate-pulse"></div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
