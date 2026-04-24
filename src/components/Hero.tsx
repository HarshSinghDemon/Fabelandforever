
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, ArrowRight, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Hero() {
  const heroData = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-20 bg-paper">
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="animate-fade-in-up">
          <div className="mb-12">
            <Logo className="w-24 h-24 text-primary mb-6" showText />
          </div>
          
          <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-primary leading-[0.95] mb-10 relative">
            Stitches <br />
            <span className="text-accent relative inline-block group cursor-default italic font-light">
              Woven
              <span className="absolute -top-4 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </span>
            </span>
            <br />
            With Love
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-md mb-14 leading-relaxed font-medium italic">
            "Capturing the magic of handmade craft in every loop. Timeless crochet treasures for your heart and home." 🧶✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Button asChild size="lg" className="btn-squish bg-primary hover:bg-primary/90 text-primary-foreground px-14 py-8 text-xl rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:scale-105 group">
              <Link href="#shop" className="flex items-center">
                Adopt a Piece <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-squish border-primary/20 text-primary hover:bg-primary/5 px-14 py-8 text-xl rounded-[2rem] backdrop-blur-sm group">
              <Link href="#contact" className="flex items-center">
                Contact Studio <Heart className="ml-3 w-5 h-5 group-hover:fill-primary group-hover:scale-110 transition-all" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group">
          {/* Whimsical Decorative Stars to match user's image */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-${2+i} h-${2+i} text-primary/40 star-animation`} style={{ animationDelay: `${i * 0.3}s` }} fill="currentColor" />
            ))}
          </div>
          
          {/* Decorative Bow at the top right of image */}
          <div className="absolute -top-6 -right-6 z-30 rotate-12 scale-150 animate-bounce">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M20 20C20 20 5 10 5 5C5 0 15 0 20 15C25 0 35 0 35 5C35 10 20 20 20 20Z" fill="var(--accent)" stroke="var(--accent-foreground)" strokeWidth="1" />
               <path d="M20 20L15 35L20 30L25 35L20 20Z" fill="var(--accent)" stroke="var(--accent-foreground)" strokeWidth="1" />
               <circle cx="20" cy="20" r="3" fill="var(--accent-foreground)" />
            </svg>
          </div>

          <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[3.8rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-[18px] border-white group-hover:shadow-primary/10 transition-all duration-700 ring-4 ring-accent/20">
            <Image
              src={heroData?.imageUrl || "https://picsum.photos/seed/fable-hero/1200/1200"}
              alt="Handmade pink crochet lily"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
              data-ai-hint="pink crochet lily"
            />
            
            {/* Elegant Floating Tags */}
            <div className="absolute top-12 left-10 bg-white/95 backdrop-blur-md text-primary px-8 py-4 rounded-[1.5rem] shadow-xl font-bold text-sm floating border border-primary/5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
              Fable Fiber 🌿
            </div>
            <div className="absolute bottom-12 right-10 bg-primary/95 backdrop-blur-md text-white px-8 py-4 rounded-[1.5rem] shadow-xl font-bold text-sm floating [animation-delay:1.5s] flex items-center gap-3">
              Forever Loop ✨
              <Heart className="w-4 h-4 fill-accent text-accent" />
            </div>
          </div>
          
          {/* Background Glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/15 rounded-full blur-[100px] animate-pulse"></div>
        </div>
      </div>
      
      {/* Dynamic Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
    </section>
  );
}
