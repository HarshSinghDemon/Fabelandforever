
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroData = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden pt-20">
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <span className="text-secondary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Handcrafted with Love</span>
          <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl text-primary leading-[1.1] mb-8">
            The Art of <br />
            <span className="italic">Handcrafted</span> <br />
            Comfort
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed">
            Elevate your living space with bespoke crochet pieces that blend timeless techniques with modern aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-full shadow-lg transition-transform hover:scale-105">
              Explore the Collection
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 px-8 py-6 text-base rounded-full">
              Custom Orders
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] lg:h-[650px] w-full rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000">
          <Image
            src={heroData?.imageUrl || "https://picsum.photos/seed/hero/1200/800"}
            alt="Elegantly draped crochet"
            fill
            className="object-cover"
            priority
            data-ai-hint="crochet blanket"
          />
          <div className="absolute inset-0 border-[20px] border-background/20 pointer-events-none"></div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 watercolor-accent rounded-full opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 line-art-bg opacity-50"></div>
    </section>
  );
}
