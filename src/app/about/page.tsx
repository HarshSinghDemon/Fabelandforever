"use client";

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Feather, Palette, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const customPlaceholder = PlaceHolderImages.find(img => img.id === 'custom-section');

  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      
      <div className="pt-48 pb-24 container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-32 reveal-on-scroll active">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[10px] mb-10 block">Our History</span>
          <h1 className="font-headline text-6xl sm:text-8xl text-primary leading-tight mb-10">
            Our <span className="italic">Story.</span>
          </h1>
          <div className="w-24 h-[1px] bg-accent/30 mx-auto mb-16"></div>
          <p className="text-2xl sm:text-3xl text-primary font-headline italic leading-relaxed max-w-4xl mx-auto">
            আমাদের প্রতিটি সৃষ্টি, ভালোবাসার রঙে রাঙানো এবং যত্নে বোনা। গল্পের প্রতিটি স্টিচ, হৃদয়ের ছোঁয়ায়।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-48 reveal-on-scroll">
          <div className="space-y-10 leading-relaxed text-xl text-primary/90 font-medium">
            <p>
              Fable & Forever started as a small passion for high-quality handmade crafts. We believe in the beauty of items that take time to create—objects that carry the personal touch and heartbeat of the maker.
            </p>
            <p>
              Every loop we weave and every stitch we place is part of a larger narrative. We don't just make crochet items; we create "forever loops" that are designed to be cherished across generations.
            </p>
            <div className="pt-10 flex items-center gap-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <p className="font-fancy text-3xl text-primary">Hand-stitched with love</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
            <Image 
              src={customPlaceholder?.imageUrl || "https://picsum.photos/seed/about/800/1000"} 
              alt="Artisan hands" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 py-32 border-y border-primary/10 reveal-on-scroll">
          {[
            { icon: Feather, title: 'Fine Materials', desc: 'We only use soft, durable, and ethically sourced yarns for our creations.' },
            { icon: Palette, title: 'Artisan Colors', desc: 'Each color combination is picked to look beautiful in your home and lifestyle.' },
            { icon: Sparkles, title: 'Perfect Finish', desc: 'Detailed craftsmanship ensures every piece is built to last a lifetime.' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-8">
              <item.icon className="w-10 h-10 text-accent" />
              <h3 className="font-headline text-3xl text-primary">{item.title}</h3>
              <p className="text-primary/70 text-base leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-48 text-center space-y-16 reveal-on-scroll">
          <BookOpen className="w-16 h-16 text-primary/20 mx-auto" />
          <h2 className="font-headline text-5xl sm:text-6xl text-primary">A Legacy in Every Stitch</h2>
          <p className="text-primary/60 text-lg max-w-2xl mx-auto italic font-medium leading-relaxed">
            "We aren't just selling products. we are sharing a piece of our history, one stitch at a time. Thank you for being part of our story."
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}