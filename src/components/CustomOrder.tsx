"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function CustomOrder() {
  const db = useFirestore();
  const customSettingRef = useMemoFirebase(() => doc(db, 'settings', 'custom'), [db]);
  const { data: customSetting } = useDoc(customSettingRef);
  
  const customImageUrl = customSetting?.value;

  return (
    <section id="custom" className="py-24 sm:py-40 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Image Side - Floriy-like clean presentation */}
          <div className="relative order-2 lg:order-1">
             <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {customImageUrl ? (
                  <Image
                    src={customImageUrl}
                    alt="Bespoke Crochet"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/5">
                    <ImageIcon className="w-20 h-20" />
                  </div>
                )}
             </div>
             {/* Decorative label */}
             <div className="absolute -bottom-6 -right-6 bg-primary text-white p-10 hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-2 opacity-60">Handmade</p>
                <p className="font-headline text-2xl italic">Masterfully Stitched</p>
             </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2 space-y-12">
            <div>
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Bespoke Commissions</span>
              <h2 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">Your vision, <br /><span className="italic">our precision.</span></h2>
            </div>
            
            <p className="text-lg text-primary/70 leading-relaxed font-medium italic">
              "We take the whispers of your imagination and translate them into physical treasures. Every loop is intentional, every stitch is a choice."
            </p>
            
            <div className="space-y-8 pt-8 border-t border-primary/5">
              {[
                { title: 'The Consultation', desc: 'A dialogue about color, texture, and the story you wish to tell.' },
                { title: 'The Looming', desc: 'Crafting the architecture of your piece with high-integrity fibers.' },
                { title: 'The Delivery', desc: 'An heirloom-quality treasure, finished and gift-wrapped with care.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8">
                  <span className="text-accent font-bold text-xs pt-1">0{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-2">{item.title}</h4>
                    <p className="text-primary/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8">
              <Button asChild className="rounded-none h-16 px-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[11px]">
                <a href="#contact">Inquire for Commission <ArrowRight className="ml-4 w-4 h-4" /></a>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}