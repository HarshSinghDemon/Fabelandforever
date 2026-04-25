"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function CustomOrder() {
  const db = useFirestore();
  const customSettingRef = useMemoFirebase(() => doc(db, 'settings', 'custom'), [db]);
  const { data: customSetting } = useDoc(customSettingRef);
  
  const customPlaceholder = PlaceHolderImages.find(img => img.id === 'custom-section');
  const customImageUrl = customSetting?.value || customPlaceholder?.imageUrl;

  return (
    <section id="custom" className="py-24 sm:py-40 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="relative order-2 lg:order-1">
             <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {customImageUrl ? (
                  <Image
                    src={customImageUrl}
                    alt="Custom Crochet"
                    fill
                    className="object-cover"
                    data-ai-hint={customPlaceholder?.imageHint || "crochet hands"}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/5">
                    <ImageIcon className="w-20 h-20" />
                  </div>
                )}
             </div>
             <div className="absolute -bottom-6 -right-6 bg-primary text-white p-10 hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-2 opacity-60">Made to order</p>
                <p className="font-headline text-2xl italic">Custom Designs</p>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-12">
            <div>
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Personalization</span>
              <h2 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">Custom <br /><span className="italic">Orders.</span></h2>
            </div>
            
            <p className="text-lg text-primary/70 leading-relaxed font-medium">
              Have a specific design in mind? We work with you to create one-of-a-kind crochet pieces tailored to your style.
            </p>
            
            <div className="space-y-8 pt-8 border-t border-primary/5">
              {[
                { title: 'Chat With Us', desc: 'Tell us about your idea, colors, and preferred size.' },
                { title: 'The Process', desc: 'We carefully hand-stitch your item using premium yarns.' },
                { title: 'Fast Delivery', desc: 'Your custom creation is gift-wrapped and shipped to your door.' }
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
                <a href="#contact">Start a Custom Order <ArrowRight className="ml-4 w-4 h-4" /></a>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
