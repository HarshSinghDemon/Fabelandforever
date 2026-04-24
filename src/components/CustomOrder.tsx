"use client";

import React from 'react';
import Image from 'next/image';
import { Heart, ArrowRight, Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function CustomOrder() {
  const db = useFirestore();
  const customSettingRef = useMemoFirebase(() => doc(db, 'settings', 'custom'), [db]);
  const { data: customSetting } = useDoc(customSettingRef);
  
  const customImageUrl = customSetting?.value;

  return (
    <section id="custom" className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 sm:w-64 sm:h-64 bg-accent/10 rounded-full blur-2xl opacity-40"></div>
            <div className="relative z-10">
              <span className="text-primary font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[8px] sm:text-[10px] mb-3 sm:mb-4 block">Bespoke Crochet Heirlooms</span>
              <h2 className="font-headline text-4xl sm:text-7xl text-primary mb-6 sm:mb-8 leading-tight">Your Vision, <br /><span className="italic text-accent">Our Hooks</span></h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-lg italic font-medium">
                "Every custom crochet piece begins with a spark. Share your vision and let's create a forever loop together."
              </p>
              
              <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
                {[
                  { step: '01', title: 'Yarn Selection', desc: 'Curating the softest ethically-sourced cotton and wool for your vision.' },
                  { step: '02', title: 'Stitch Magic', desc: 'Translating your inspiration into a hand-crafted crochet chart and loops.' },
                  { step: '03', title: 'The Final Stitch', desc: 'Execution with heirloom precision and a master crocheter\'s care.' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 sm:gap-8 group">
                    <span className="font-headline text-2xl sm:text-3xl text-accent/30 group-hover:text-accent transition-colors duration-500">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-primary text-lg sm:text-xl mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild className="w-full sm:w-auto mt-4 bg-primary hover:bg-primary/90 text-white h-14 sm:h-16 px-8 sm:px-10 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105">
                <a href="#contact">Start Your Consultation <ArrowRight className="ml-2 sm:ml-3 w-4 h-4" /></a>
              </Button>
            </div>
          </div>

          <div className="relative px-4 sm:px-0 mt-8 sm:mt-0">
             <div className="relative aspect-square w-full rounded-[2rem] sm:rounded-[4rem] overflow-hidden border-[8px] sm:border-[15px] border-white shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-muted/20">
                {customImageUrl ? (
                  <Image
                    src={customImageUrl}
                    alt="Custom crochet visualization"
                    fill
                    className="object-cover transition-transform duration-1000 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/10 gap-2 sm:gap-4">
                    <ImageIcon className="w-12 h-12 sm:w-20 sm:h-20" />
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-center px-6">Use the Admin Panel to loom your custom visual</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                
                <div className="absolute top-4 sm:top-10 right-4 sm:right-10 bg-white/95 backdrop-blur-md p-3 sm:p-6 rounded-xl sm:rounded-[2rem] shadow-xl border border-accent/10 floating">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Sparkles className="text-accent w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-primary">Master Artisan</span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground italic">"Every loop is a promise of forever."</p>
                </div>

                <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 flex items-center gap-3 sm:gap-4">
                    <div className="bg-accent text-white p-3 sm:p-5 rounded-full shadow-lg">
                        <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
                    </div>
                    <div className="text-white">
                        <p className="text-[8px] sm:text-xs font-bold uppercase tracking-widest opacity-80">Authentic</p>
                        <p className="font-headline text-lg sm:text-2xl leading-none">Crochet Arts</p>
                    </div>
                </div>
             </div>
             <div className="absolute -z-10 -bottom-6 -right-6 sm:-bottom-10 -right-10 w-32 h-32 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-2xl sm:blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
