"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
  const heroData = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-32 pb-20 tale-gradient">
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-primary/20">
            <Sparkles className="text-primary w-4 h-4 sparkle-slow" />
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Magical Handmade Treasures</span>
          </div>
          <h1 className="font-fancy text-6xl md:text-7xl lg:text-8xl text-primary leading-[1.1] mb-8">
            Woven with <br />
            <span className="text-accent">Fairy Tales</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mb-12 leading-relaxed font-medium italic">
            "Step into a world where every stitch tells a story and every creation holds a dream."
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-8 text-lg rounded-full shadow-2xl shadow-primary/30 transition-all hover:scale-105 group">
              Explore the Shop <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 px-12 py-8 text-lg rounded-full backdrop-blur-sm">
              Custom Tale 📖
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Decorative frame */}
          <div className="absolute -inset-4 border-2 border-accent/30 rounded-[4rem] -rotate-3 animate-pulse"></div>
          <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[15px] border-white group">
            <Image
              src={heroData?.imageUrl || "https://picsum.photos/seed/hero/1200/1200"}
              alt="Adorable crochet plushies"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              priority
              data-ai-hint="teal crochet amigurumi"
            />
            {/* Floating Tags */}
            <div className="absolute top-10 right-10 bg-accent text-accent-foreground px-6 py-3 rounded-2xl shadow-xl font-bold text-sm floating">
              100% Cotton 🌿
            </div>
            <div className="absolute bottom-10 left-10 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm floating [animation-delay:1s]">
              Hand-Stitched ✨
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
    </section>
  );
}