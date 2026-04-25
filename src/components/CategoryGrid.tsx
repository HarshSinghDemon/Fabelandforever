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
    { name: 'Forever Flowers', slug: 'flowers', image: 'https://picsum.photos/seed/cat-flowers/800/1000', hint: 'crochet flowers' },
    { name: 'Amigurumi Pals', slug: 'amigurumi', image: 'https://picsum.photos/seed/cat-amigurumi/800/1000', hint: 'crochet toy' },
    { name: 'Bag Charms', slug: 'bag-charm', image: 'https://picsum.photos/seed/cat-charms/800/1000', hint: 'bag charm' },
    { name: 'Hair Accessories', slug: 'hair-accessories', image: 'https://picsum.photos/seed/cat-hair/800/1000', hint: 'hair clips' },
    { name: 'Artisan Bandanas', slug: 'bandana', image: 'https://picsum.photos/seed/cat-bandana/800/1000', hint: 'crochet bandana' },
    { name: 'Ribbon Bouquets', slug: 'ribbon-bouquet', image: 'https://picsum.photos/seed/cat-ribbon/800/1000', hint: 'ribbon bouquet' },
  ];

  return (
    <section className="py-12 md:py-24 bg-white border-t border-primary/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 reveal-on-scroll">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-4 block">Curation</span>
          <h2 className="font-headline text-4xl sm:text-6xl text-primary tracking-tight">Shop By <span className="italic">Collections</span></h2>
          <div className="w-16 h-[1px] bg-accent/30 mx-auto mt-6"></div>
        </div>

        <div className="relative reveal-on-scroll px-4 md:px-12">
          <Carousel 
            opts={{ 
              align: "start", 
              loop: true,
              dragFree: false
            }} 
            className="w-full relative"
          >
            <CarouselContent className="-ml-0">
              {collections.map((cat, idx) => (
                <CarouselItem key={idx} className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 px-2">
                  <Link 
                    href={`/shop#${cat.slug}`} 
                    className="group block space-y-4"
                  >
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-paper transition-all duration-1000 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-2xl border border-primary/5 stitching-border">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                        data-ai-hint={cat.hint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="absolute bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                         <span className="bg-white/90 backdrop-blur-sm px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary shadow-lg border border-primary/5">
                            View Selections
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 group">
                      <h4 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors duration-500">{cat.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/30 group-hover:text-accent transition-all">
                        Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-6 lg:-left-10 h-12 w-12 border-primary/5 bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all" />
            <CarouselNext className="hidden md:flex -right-6 lg:-right-10 h-12 w-12 border-primary/5 bg-white/80 backdrop-blur-sm shadow-xl hover:bg-primary hover:text-white transition-all" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
