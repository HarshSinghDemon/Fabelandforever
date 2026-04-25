"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Hero() {
  const db = useFirestore();
  const heroSettingRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'hero');
  }, [db]);
  const { data: heroSetting } = useDoc(heroSettingRef);
  
  const heroImageUrl = heroSetting?.value;

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden bg-[#F9F8F6]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Artisanal Crochet Masterpiece"
            fill
            className="object-cover opacity-90 transition-transform duration-[3s] hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <ImageIcon className="w-20 h-20 text-primary/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-80 block">Established in the Quiet Hours</span>
          
          <h1 className="font-headline text-5xl sm:text-7xl md:text-9xl leading-[1] mb-4">
            A Fable in <br /> Every Stitch
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl max-w-xl mx-auto leading-relaxed font-medium italic opacity-90">
            "Hand-crocheted treasures that carry the heartbeat of the weaver. Timeless, artisanal, and woven forever."
          </p>
          
          <div className="pt-10">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-12 h-16 rounded-none text-xs font-bold uppercase tracking-widest transition-all hover:px-14">
              <Link href="#shop">
                Discover The Collection <ArrowRight className="ml-4 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-50">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white vertical-text">Scroll</span>
        <div className="w-[1px] h-12 bg-white/40 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce-slow"></div>
        </div>
      </div>
    </section>
  );
}

// Helper style for vertical text if needed
const style = `
.vertical-text {
  writing-mode: vertical-rl;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(-100%); }
  50% { transform: translateY(100%); }
}
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
`;