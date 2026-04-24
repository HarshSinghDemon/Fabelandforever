
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
    <section className="relative min-h-[100vh] flex items-center overflow-hidden pt-40 pb-20 bg-paper">
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="animate-fade-in-up">
          <div className="mb-16 inline-flex items-center gap-6 group cursor-pointer">
            <span className="font-headline text-lg tracking-[0.3em] uppercase text-primary/60 group-hover:text-primary transition-colors">Bespoke Crochet Stitchery</span>
          </div>
          
          <h1 className="font-headline text-8xl md:text-9xl lg:text-[10rem] text-primary leading-[0.85] mb-12 relative">
            Stitches <br />
            <span className="text-accent relative inline-block group cursor-default italic font-light py-2">
              Woven
              <div className="absolute -top-8 -right-12 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150">
                <Sparkles className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 25 10 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/40" />
              </svg>
            </span>
            <br />
            With Love
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-lg mb-16 leading-relaxed font-medium italic">
            "Capturing the magic of handmade craft in every loop. Timeless crochet treasures for your heart and home." 🧶✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <Button asChild size="lg" className="btn-squish glow-hover bg-primary hover:bg-primary/90 text-primary-foreground px-16 py-10 text-xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(45,115,107,0.4)] transition-all hover:scale-105 group">
              <Link href="#shop" className="flex items-center">
                Adopt a Piece <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform duration-500" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-squish border-primary/20 text-primary hover:bg-primary/5 px-16 py-10 text-xl rounded-[2.5rem] backdrop-blur-md group hover:border-accent transition-all">
              <Link href="#contact" className="flex items-center">
                Our Story <Heart className="ml-4 w-6 h-6 group-hover:fill-primary group-hover:scale-125 transition-all duration-500 text-primary" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-accent/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-xl border border-accent/10">
                <Scissors className="w-6 h-6 text-primary" />
             </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[5rem] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] border-[25px] border-white group-hover:shadow-primary/20 transition-all duration-1000 group-hover:rotate-1 ring-8 ring-accent/5 bg-muted/20">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Handmade crochet visual"
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-primary/10 gap-4">
                  <ImageIcon className="w-20 h-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center px-10">Use the Admin Panel to loom your hero visual</p>
                </div>
              )}
              
              <div className="absolute top-14 left-12 bg-white/95 backdrop-blur-xl text-primary px-10 py-5 rounded-[2rem] shadow-2xl font-bold text-base floating border border-primary/5 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-accent animate-ping"></span>
                Bespoke Fiber Arts 🌿
              </div>
              
              <div className="absolute bottom-14 right-12 bg-primary/95 backdrop-blur-xl text-white px-10 py-5 rounded-[2rem] shadow-2xl font-bold text-base floating [animation-delay:1.5s] flex items-center gap-4">
                Forever Loop ✨
                <Heart className="w-5 h-5 fill-accent text-accent" />
              </div>
            </div>
            
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-10 right-10 opacity-20 floating [animation-duration:10s]">
        <Star className="w-24 h-24 text-accent fill-current" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 floating [animation-duration:8s] [animation-delay:2s]">
        <Scissors className="w-32 h-32 text-primary" />
      </div>
    </section>
  );
}
