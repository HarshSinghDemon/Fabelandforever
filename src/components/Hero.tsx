"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  const { data: heroSetting, loading } = useDoc(heroSettingRef);

  // Setup autoplay plugin for 10 seconds
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false })
  );

  const heroImages = useMemo(() => {
    // If we have an array of values in settings, use those
    if (heroSetting?.values && heroSetting.values.length > 0) {
      return heroSetting.values;
    }
    // If we have a single value in settings, use that + the second default
    if (heroSetting?.value) {
      return [
        heroSetting.value,
        "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_t8i3g7t8i3g7t8i3.png"
      ];
    }
    // Default fallback images
    return [
      "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_bx4li2bx4li2bx4l.png",
      "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_t8i3g7t8i3g7t8i3.png"
    ];
  }, [heroSetting]);

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
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Cinematic Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
            duration: 50, // Transition speed between slides
          }}
        >
          <CarouselContent className="h-screen ml-0">
            {heroImages.map((imgUrl, index) => (
              <CarouselItem key={index} className="h-full pl-0 relative">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={`Artisanal Heritage ${index + 1}`}
                    fill
                    quality={100}
                    className="object-cover opacity-85 animate-ken-burns"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Softened Overlays for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none z-[5]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_80%)] opacity-30 pointer-events-none z-[5]"></div>
      </div>
      
      {/* Editorial Content Overlay */}
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center text-center text-white pt-24">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          
          {/* Tagline */}
          <div className="overflow-hidden">
             <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[1em] md:tracking-[1.5em] text-white/40 block animate-loop-in opacity-0">
               Hand-Stitched Legacy
             </span>
          </div>

          {/* Dramatic Brand Stack */}
          <div className="relative">
            <h1 className="font-headline text-7xl sm:text-9xl md:text-[13rem] leading-[0.85] tracking-tighter drop-shadow-2xl flex flex-col items-center">
              <span className="block overflow-hidden">
                <span className="block animate-loop-in stagger-1 opacity-0">Fable</span>
              </span>
              
              <div className="h-0 relative z-20 flex justify-center items-center">
                <span className="font-fancy text-8xl md:text-[11rem] text-accent/90 block animate-loop-in stagger-2 opacity-0 -rotate-3">
                  &
                </span>
              </div>

              <span className="block overflow-hidden">
                <span className="italic block animate-loop-in stagger-3 opacity-0">Forever</span>
              </span>
            </h1>
          </div>
          
          {/* Subtext & Meta */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-[11px] md:text-sm leading-relaxed font-bold uppercase tracking-[0.4em] text-white/60 animate-loop-in stagger-4 opacity-0">
              Bespoke crochet collections designed for the heritage heart.
            </p>
            <div className="flex items-center justify-center gap-4 animate-loop-in stagger-4 opacity-0">
              <div className="h-[1px] w-8 bg-white/20"></div>
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.8em] text-white/30">
                Only in Kolkata
              </span>
              <div className="h-[1px] w-8 bg-white/20"></div>
            </div>
          </div>
          
          {/* CTA Group */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 animate-loop-in stagger-4 opacity-0">
            <Button asChild className="bg-white text-primary hover:bg-white/90 px-12 md:px-20 h-16 md:h-20 rounded-none text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/40 group overflow-hidden">
              <Link href="#shop" className="flex items-center relative z-10">
                Explore Collection <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            
            <Link 
              href="/about" 
              className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-white/80 hover:text-white transition-all border-b border-white/20 pb-2 hover:border-white group flex items-center gap-3"
            >
              Read Our Story <Sparkles className="w-4 h-4 text-accent group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 opacity-30">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white via-white/20 to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-soft-pulse"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-white/40 animate-float" />
          <span className="text-[8px] font-bold uppercase tracking-[0.8em] text-white/40">Scroll</span>
        </div>
      </div>
    </section>
  );
}
