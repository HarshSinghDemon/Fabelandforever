
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CategoryGrid() {
  const categories = [
    { name: 'Creatures', image: 'https://picsum.photos/seed/cat-creatures/600/600', hint: 'crochet dragon' },
    { name: 'Flowers', image: 'https://picsum.photos/seed/cat-flowers/600/600', hint: 'crochet tulip' },
    { name: 'Candles', image: 'https://picsum.photos/seed/cat-candles/600/600', hint: 'crochet candle' },
    { name: 'Apparel', image: 'https://picsum.photos/seed/cat-apparel/600/600', hint: 'crochet shawl' },
    { name: 'Home', image: 'https://picsum.photos/seed/cat-home/600/600', hint: 'crochet decor' },
    { name: 'Miniatures', image: 'https://picsum.photos/seed/cat-mini/600/600', hint: 'crochet bear' },
  ];

  return (
    <section className="py-32 bg-background border-t border-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 reveal-on-scroll">
          <h2 className="font-headline text-5xl text-primary leading-tight">Shop by <span className="italic">Category</span></h2>
          <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Discover Your Forever Loop</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-10">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href="/#shop" 
              className="group block space-y-6 reveal-on-scroll"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-square rounded-full overflow-hidden bg-muted border-2 border-primary/5 group-hover:border-accent transition-all duration-700">
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  data-ai-hint={cat.hint}
                />
              </div>
              <div className="text-center">
                <h4 className="font-headline text-xl text-primary group-hover:text-accent transition-colors">{cat.name}</h4>
                <div className="w-0 h-[1px] bg-accent mx-auto mt-2 group-hover:w-8 transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
