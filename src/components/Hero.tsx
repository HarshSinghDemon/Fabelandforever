"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const heroData = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden pt-20 cute-gradient">
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="text-primary w-4 h-4 floating-sparkle" />
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Handmade with love & sprinkles</span>
          </div>
          <h1 className="font-fancy text-6xl md:text-7xl lg:text-8xl text-primary leading-tight mb-6">
            Soft, Sweet, <br />
            <span className="text-accent-foreground">& Crochet</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mb-10 leading-relaxed font-medium">
            Turn your day into a fluffy dream with our handmade amigurumi and cozy accessories. 🍓✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Shop Cute Things 🎀
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-10 py-7 text-lg rounded-full">
              Custom Order ☁️
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] lg:h-[650px] w-full rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000 border-[12px] border-white">
          <Image
            src={heroData?.imageUrl || "https://picsum.photos/seed/hero/1200/800"}
            alt="Adorable crochet plushies"
            fill
            className="object-cover"
            priority
            data-ai-hint="cute amigurumi"
          />
          {/* Cute Floating Decoration */}
          <div className="absolute top-10 right-10 bg-white/90 p-4 rounded-3xl shadow-lg border border-primary/10 animate-bounce">
            <span className="text-3xl">🧸</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Bubbles */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/30 rounded-full blur-2xl"></div>
    </section>
  );
}