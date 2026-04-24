"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export function Hero() {
  const heroData = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-20">
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-accent/30 backdrop-blur-md px-6 py-2.5 rounded-full mb-10 border border-accent/40">
            <Sparkles className="text-primary w-4 h-4 sparkle-slow" />
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Hand-Spun Fairytales</span>
          </div>
          
          <h1 className="font-fancy text-7xl md:text-8xl lg:text-9xl text-primary leading-[1] mb-10 relative">
            Woven with <br />
            <span className="text-accent relative inline-block group cursor-default">
              Magic
              <span className="absolute -top-4 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </span>
            </span>
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-md mb-14 leading-relaxed font-medium italic">
            "We don't just crochet plushies; we breathe life into the companions you've been waiting for."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Button size="lg" className="btn-squish bg-primary hover:bg-primary/90 text-primary-foreground px-14 py-8 text-xl rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:scale-105 group">
              Shop Now <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="btn-squish border-primary/20 text-primary hover:bg-primary/5 px-14 py-8 text-xl rounded-[2rem] backdrop-blur-sm group">
              Custom Tale <Heart className="ml-3 w-5 h-5 group-hover:fill-primary group-hover:scale-110 transition-all" />
            </Button>
          </div>
        </div>

        <div className="relative group">
          {/* Animated decorative frame */}
          <div className="absolute -inset-6 border-2 border-accent/40 rounded-[4.5rem] -rotate-3 transition-transform duration-700 group-hover:rotate-0 animate-[pulse_3s_infinite]"></div>
          <div className="absolute -inset-3 border-2 border-primary/10 rounded-[4rem] rotate-2 transition-transform duration-700 group-hover:rotate-0"></div>
          
          <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[3.8rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-[18px] border-white group-hover:shadow-primary/10 transition-all duration-700">
            <Image
              src={heroData?.imageUrl || "https://picsum.photos/seed/hero/1200/1200"}
              alt="Adorable crochet plushies"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
              data-ai-hint="teal crochet amigurumi"
            />
            
            {/* Elegant Floating Tags */}
            <div className="absolute top-12 left-10 bg-white/95 backdrop-blur-md text-primary px-8 py-4 rounded-[1.5rem] shadow-xl font-bold text-sm floating border border-primary/5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
              100% Cotton 🌿
            </div>
            <div className="absolute bottom-12 right-10 bg-primary/95 backdrop-blur-md text-white px-8 py-4 rounded-[1.5rem] shadow-xl font-bold text-sm floating [animation-delay:1.5s] flex items-center gap-3">
              Artisan Made ✨
              <Heart className="w-4 h-4 fill-accent text-accent" />
            </div>
          </div>
          
          {/* Background Glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>
      </div>
      
      {/* Dynamic Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
    </section>
  );
}
