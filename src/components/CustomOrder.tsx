
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AICrochetTool } from './AICrochetTool';

export function CustomOrder() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'custom-order-bg');

  return (
    <section id="custom" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 watercolor-accent rounded-full opacity-20"></div>
            <div className="relative z-10">
              <span className="text-secondary font-medium tracking-[0.2em] uppercase text-sm mb-4 block">Bespoke Design</span>
              <h2 className="font-headline text-5xl md:text-6xl text-primary mb-8">Your Vision, <br /><span className="italic">Our Craft</span></h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                The beauty of handcrafted items lies in their personalization. We work closely with you to create one-of-a-kind treasures that perfectly fit your home and heart.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Concept', desc: 'Share your ideas or use our AI tool to find inspiration.' },
                  { step: '02', title: 'Materials', desc: 'Select from our curated range of luxury yarns and colors.' },
                  { step: '03', title: 'Creation', desc: 'Watch your vision come to life with regular artisan updates.' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <span className="font-headline text-2xl text-secondary opacity-50">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
             <AICrochetTool />
             <div className="mt-12 flex items-center justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
                {/* Visual accents / line art placeholders */}
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 3h18v18H3zM9 9l6 6M15 9l-6 6" />
                </svg>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
