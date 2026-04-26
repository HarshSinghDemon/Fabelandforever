
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
import { cn } from '@/lib/utils';

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  const { data: heroSetting } = useDoc(heroSettingRef);

  const plugin = React.useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  );

  const heroImages = useMemo(() => {
    if (heroSetting?.values && heroSetting.values.length > 0) {
      return heroSetting.values;
    }
    return [
      "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_bx4li2bx4li2bx4l.png",
      "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/Gemini_Generated_Image_t8i3g7t8i3g7t8i3.png",
      "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/Gemini_Generated_Image_7ffses7ffses7ffs.png"
    ];
  }, [heroSetting]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* Visual Layer: Cinematic Background Carousel */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-screen ml-0">
            {heroImages.map((imgUrl, index) => (
              <CarouselItem key={index} className="h-full pl-0 relative basis-full">
                <div className="relative w-full h-full">
                  <Image
                    src={imgUrl}
                    alt={`Artisanal Heritage ${index + 1}`}
                    fill
                    quality={100}
                    className="object-cover animate-ken-burns"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Subtle Gradient Overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-[5]"></div>
      </div>
      
      {/* Narrative Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full flex items-center justify-center text-center text-white pointer-events-none">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-16 pointer-events-auto">
          <div className="overflow-hidden">
             <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.8em] md:tracking-[1.5em] text-accent block animate-loop-in opacity-0">
               Hand-Stitched Legacy
             </span>
          </div>

          <div className="relative">
            <h1 className="font-headline text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] hero-title leading-[0.85] tracking-tighter drop-shadow-2xl flex flex-col items-center select-none px-2">
              <span className="block overflow-hidden">
                <span className="block animate-loop-in stagger-1 opacity-0">Fable</span>
              </span>
              <div className="h-0 relative z-20 flex justify-center items-center">
                <span className="font-fancy text-5xl md:text-9xl lg:text-[12rem] text-accent/90 block animate-loop-in stagger-2 opacity-0 -rotate-3">
                  &
                </span>
              </div>
              <span className="block overflow-hidden">
                <span className="italic block animate-loop-in stagger-3 opacity-0">Forever</span>
              </span>
            </h1>
          </div>
          
          <div className="space-y-8 md:space-y-10 max-w-2xl mx-auto pt-16 md:pt-0">
            <p className="text-[10px] md:text-base leading-relaxed font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/70 animate-loop-in stagger-4 opacity-0 px-4">
              Bespoke crochet collections designed for the heritage heart.
            </p>
            
            <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 animate-loop-in stagger-4 opacity-0">
              <Button asChild className="bg-white text-primary hover:bg-white/90 px-10 md:px-16 h-16 md:h-20 rounded-none text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-2xl group w-full sm:w-auto">
                <Link href="#shop" className="flex items-center justify-center">
                  Explore Collection <ArrowRight className="ml-3 md:ml-4 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              
              <Link 
                href="https://www.instagram.com/fable.and.forever/"
                target="_blank"
                className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/90 hover:text-accent transition-all border-b-2 border-accent/40 pb-2 hover:border-accent group flex items-center justify-center gap-4 bg-black/20 backdrop-blur-sm px-8 py-5 md:bg-transparent md:p-0 rounded-full w-full sm:w-auto"
              >
                Order via DM <Sparkles className="w-5 h-5 text-accent group-hover:rotate-45 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 md:gap-6 opacity-40">
        <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-white via-white/20 to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-soft-pulse"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MousePointer2 className="w-4 h-4 md:w-5 md:h-5 text-white/60 animate-float" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.8em] md:tracking-[1em] text-white/60">Scroll</span>
        </div>
      </div>
    </section>
  );
}
