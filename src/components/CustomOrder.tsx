
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomOrder() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'custom-order-bg');

  return (
    <section id="custom" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-40"></div>
            <div className="relative z-10">
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Bespoke Design</span>
              <h2 className="font-headline text-5xl md:text-7xl text-primary mb-8 leading-tight">Your Vision, <br /><span className="italic text-accent">Our Craft</span></h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg italic font-medium">
                "The beauty of handcrafted items lies in their personalization. We work closely with you to create one-of-a-kind treasures that perfectly fit your home and heart."
              </p>
              
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Concept', desc: 'Share your ideas, colors, and the story you want your piece to tell.' },
                  { step: '02', title: 'Materials', desc: 'Select from our curated range of luxury ethically-sourced yarns.' },
                  { step: '03', title: 'Creation', desc: 'Watch your vision come to life with regular artisanal updates.' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-8 group">
                    <span className="font-headline text-3xl text-accent/30 group-hover:text-accent transition-colors duration-500">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-primary text-xl mb-2">{item.title}</h4>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild className="mt-12 bg-primary hover:bg-primary/90 text-white h-16 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105">
                <a href="#contact">Start a Consultation <ArrowRight className="ml-3 w-4 h-4" /></a>
              </Button>
            </div>
          </div>

          <div className="relative">
             {/* Replaced AI tool with a high-end visual showcase */}
             <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden border-[15px] border-white shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <Image
                  src={bgImage?.imageUrl || "https://picsum.photos/seed/yarn/800/800"}
                  alt="Luxury yarn and craft materials"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                
                {/* Floating Tags */}
                <div className="absolute top-10 right-10 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-accent/10 floating">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-accent w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Master Craft</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground italic">"Slowly made for fast memories."</p>
                </div>

                <div className="absolute bottom-10 left-10 flex items-center gap-4">
                    <div className="bg-accent text-white p-5 rounded-full shadow-lg">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div className="text-white">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Authentic</p>
                        <p className="font-headline text-2xl">Hand-Calligraphed</p>
                    </div>
                </div>
             </div>
             
             {/* Artistic Accents */}
             <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
