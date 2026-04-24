"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Heart, Star, Scissors, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => doc(db, 'settings', 'hero'), [db]);
  const { data: heroSetting } = useDoc(heroSettingRef);
  
  const heroImageUrl = heroSetting?.value;

  return (
    <section className="relative min-h-[90vh] sm:min-h-[100vh] flex items-center overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-20 bg-paper">
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
        <div className="animate-fade-in-up text-center lg:text-left">
          <div className="mb-6 sm:mb-12 inline-flex flex-col items-center lg:items-start gap-2 group cursor-pointer">
            <span className="font-headline text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary/60 group-hover:text-primary transition-colors">Artisanal Crochet Boutique</span>
            <span className="text-accent font-bold text-xs sm:text-sm tracking-widest opacity-80">ভালোবাসার সুতোয় বোনা ✨</span>
          </div>
          
          <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] text-primary leading-[1] sm:leading-[0.85] mb-8 sm:mb-12 relative">
            Stitches <br className="hidden sm:block" />
            <span className="text-accent relative inline-block group cursor-default italic font-light py-2">
              Woven
              <div className="absolute -top-4 sm:-top-8 -right-8 sm:-right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125 sm:scale-150">
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-accent animate-pulse" />
              </div>
              <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 25 10 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/40" />
              </svg>
            </span>
            <br className="hidden sm:block" />
            With Love
          </h1>
          
          <p className="text-lg sm:text-2xl md:text-3xl text-muted-foreground max-w-lg mb-10 sm:mb-16 leading-relaxed font-medium italic mx-auto lg:mx-0">
            "Capturing the magic of handmade craft in every loop. Timeless crochet treasures for your heart and home." 🧶✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center lg:justify-start">
            <Button asChild size="lg" className="btn-squish glow-hover bg-primary hover:bg-primary/90 text-primary-foreground h-14 sm:h-20 px-10 sm:px-16 text-lg sm:text-xl rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(45,115,107,0.4)] transition-all hover:scale-105 group">
              <Link href="#shop" className="flex items-center">
                Shop Collection <ArrowRight className="ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-squish border-primary/20 text-primary hover:bg-primary/5 h-14 sm:h-20 px-10 sm:px-16 text-lg sm:text-xl rounded-2xl sm:rounded-[2.5rem] backdrop-blur-md group hover:border-accent transition-all">
              <Link href="#story" className="flex items-center">
                Our Story <Heart className="ml-3 sm:ml-4 w-5 h-5 sm:w-6 sm:h-6 group-hover:fill-primary group-hover:scale-125 transition-all duration-500 text-primary" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-12 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] border border-accent/10 rounded-full animate-[spin_25s_linear_infinite] pointer-events-none hidden sm:block">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-accent/5">
                <Scissors className="w-5 h-5 text-primary" />
             </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[3rem] sm:rounded-[5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-[12px] sm:border-[25px] border-white group-hover:shadow-primary/20 transition-all duration-1000 group-hover:rotate-1 ring-4 sm:ring-8 ring-accent/5 bg-muted/20">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Handmade crochet visual"
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-primary/10 gap-3 sm:gap-4">
                  <ImageIcon className="w-12 h-12 sm:w-20 sm:h-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center px-6">Upload your crochet visual in Admin</p>
                </div>
              )}
              
              <div className="absolute top-6 sm:top-14 left-6 sm:left-12 bg-white/95 backdrop-blur-xl text-primary px-6 sm:px-10 py-3 sm:py-5 rounded-full sm:rounded-[2rem] shadow-xl font-bold text-xs sm:text-base floating border border-primary/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                Artisan Crafted 🌿
              </div>
            </div>
            
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-accent/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
