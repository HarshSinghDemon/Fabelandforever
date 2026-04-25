
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

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  if (loading) {
    return (
      <div className="h-[70vh] md:h-screen w-full bg-black flex items-center justify-center">
        <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white animate-pulse" />
      </div>
    );
  }

  return (
    <section className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-black group">
      <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((url: string, index: number) => (
            <div key={`${url}-${index}`} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image
                src={url}
                alt={`Artisanal Story ${index + 1}`}
                fill
                className="object-cover opacity-60"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-fade-in-up">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] md:tracking-[0.8em] text-white/60 block mb-4 md:mb-6">Hand-Stitched Legacy</span>
            <h1 className="font-headline text-5xl sm:text-7xl md:text-[9rem] leading-none mb-4 md:mb-8 tracking-tighter drop-shadow-2xl">
              Artisan <br /> <span className="italic">Threads</span>
            </h1>
          </div>
          
          <p className="text-[10px] md:text-sm max-w-sm md:max-w-xl mx-auto leading-relaxed font-bold uppercase tracking-widest text-white/70">
            Bespoke crochet treasures designed for the heritage heart.
          </p>
          
          <div className="pt-6 md:pt-12 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
            <Button asChild className="bg-white text-primary hover:bg-white/90 px-10 md:px-16 h-12 md:h-16 rounded-none text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95">
              <Link href="#shop" className="flex items-center">
                Shop Collection <ArrowRight className="ml-3 w-3 h-3" />
              </Link>
            </Button>
            <Link href="/about" className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 hover:text-white transition-all border-b border-white/20 pb-1">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 opacity-40">
        <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-white via-white/40 to-transparent overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce-slow"></div>
        </div>
      </div>
    </section>
  );
}
