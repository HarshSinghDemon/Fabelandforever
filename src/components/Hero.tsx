"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  const { data: heroSetting, loading } = useDoc(heroSettingRef);
  
  const heroPlaceholder = PlaceHolderImages.find(img => img.id === 'hero-main');
  
  const heroImages = React.useMemo(() => {
    if (heroSetting?.values && Array.isArray(heroSetting.values) && heroSetting.values.length > 0) {
      return heroSetting.values;
    }
    if (heroSetting?.value) {
      return [heroSetting.value];
    }
    return [heroPlaceholder?.imageUrl || "https://picsum.photos/seed/hero/1920/1080"];
  }, [heroSetting, heroPlaceholder]);

  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    duration: 50,
    skipSnaps: false
  }, [
    Autoplay({ delay: 6000, stopOnInteraction: false })
  ]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <Sparkles className="w-12 h-12 text-primary/20 animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/20">The Loom is Waking</span>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black group">
      <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((url: string, index: number) => (
            <div key={`${url}-${index}`} className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={url}
                  alt={`Artisanal Selection ${index + 1}`}
                  fill
                  className="object-cover opacity-60 scale-110 transition-transform duration-[15s] ease-out-expo group-hover:scale-100"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_95%)] opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          <div className="space-y-6 md:space-y-10">
            <div className="overflow-hidden mb-6">
               <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[1em] md:tracking-[1.5em] text-white/40 block animate-loop-in opacity-0">Hand-Stitched Legacy</span>
            </div>
            <h1 className="font-headline text-6xl sm:text-8xl md:text-[11rem] leading-none tracking-tighter drop-shadow-2xl">
              <span className="block overflow-hidden">
                <span className="block animate-loop-in stagger-1 opacity-0">Fable &</span>
              </span>
              <span className="block overflow-hidden -mt-4 md:-mt-10">
                <span className="italic block animate-loop-in stagger-2 opacity-0">Forever</span>
              </span>
            </h1>
          </div>
          
          <div className="overflow-hidden space-y-4">
            <p className="text-[11px] md:text-sm max-w-sm md:max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-[0.4em] text-white/60 animate-loop-in stagger-3 opacity-0">
              Bespoke crochet collections designed for the heritage heart.
            </p>
            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.6em] text-white/30 animate-loop-in stagger-3 opacity-0">
              Only in Kolkata
            </p>
          </div>
          
          <div className="pt-8 md:pt-16 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 animate-loop-in stagger-3 opacity-0">
            <Button asChild className="bg-white text-primary hover:bg-white/90 px-12 md:px-20 h-14 md:h-20 rounded-none text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/40 group overflow-hidden">
              <Link href="#shop" className="flex items-center relative z-10">
                Shop Collection <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Link href="/about" className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-white/80 hover:text-white transition-all border-b border-white/20 pb-2 hover:border-white">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 opacity-30">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white via-white/20 to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-soft-pulse"></div>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.8em] text-white/40">Scroll</span>
      </div>
    </section>
  );
}
