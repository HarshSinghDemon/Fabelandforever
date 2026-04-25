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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#111]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Handmade Crochet"
            fill
            className="object-cover opacity-80 transition-transform duration-[10s] hover:scale-110"
            priority
            data-ai-hint={heroPlaceholder?.imageHint || "luxury crochet"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/10">
            <ImageIcon className="w-20 h-20 text-white/5" />
          </div>
        )}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] opacity-80 block mb-4">Premium Crochet Boutique</span>
          
          <h1 className="font-headline text-6xl sm:text-8xl md:text-[8rem] leading-[0.9] mb-6 tracking-tighter">
            Handmade <br /> <span className="italic">with Love</span>
          </h1>
          
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
            High-quality, hand-crocheted items designed for your home and lifestyle.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-14 h-16 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-2xl">
              <Link href="#shop">
                Shop Collection <ArrowRight className="ml-4 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white hover:text-primary px-14 h-16 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all">
              <Link href="#custom">Custom Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 opacity-60">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 transform rotate-180 [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce-slow"></div>
        </div>
      </div>
    </section>
  );
}
