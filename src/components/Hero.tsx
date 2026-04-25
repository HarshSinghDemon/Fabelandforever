"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  const { data: heroSetting } = useDoc(heroSettingRef);
  
  const heroPlaceholder = PlaceHolderImages.find(img => img.id === 'hero-main');
  const heroImageUrl = heroSetting?.value || heroPlaceholder?.imageUrl;

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Artisanal Crochet"
            fill
            className="object-cover opacity-60 transition-transform duration-[20s] hover:scale-110"
            priority
            data-ai-hint={heroPlaceholder?.imageHint || "luxury crochet"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/5">
            <ImageIcon className="w-20 h-20 text-white/5" />
          </div>
        )}
        {/* Cinematic Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/70"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-white/60 block mb-6 animate-pulse">Hand-Stitched Legacy</span>
            <h1 className="font-headline text-7xl sm:text-9xl md:text-[11rem] leading-[0.85] mb-8 tracking-tighter drop-shadow-2xl">
              Artisan <br /> <span className="italic">Threads</span>
            </h1>
          </div>
          
          <p className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-bold uppercase tracking-widest text-white/70">
            Bespoke crochet treasures designed to last a lifetime.
          </p>
          
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-10">
            <Button asChild className="bg-white text-primary hover:bg-white/90 px-16 h-16 rounded-none text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 shadow-2xl active:scale-95">
              <Link href="#shop" className="flex items-center">
                Explore Collection <ArrowRight className="ml-4 w-3 h-3" />
              </Link>
            </Button>
            <Link href="/about" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-white/70 transition-all border-b border-white/30 pb-1">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 opacity-40">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white via-white/40 to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce-slow"></div>
        </div>
      </div>
    </section>
  );
}