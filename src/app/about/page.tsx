"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Feather, Palette, BookOpen, Scroll, Quote, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const heritageBanner = PlaceHolderImages.find(img => img.id === 'heritage-banner');
  const heroMain = PlaceHolderImages.find(img => img.id === 'hero-main');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Updated story image URL from Supabase
  const storyImageUrl = "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/1777062016035-WhatsApp_Image_2026_04_24_at_10.09.32_PM.jpeg";

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Modern Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden border-b border-primary/5">
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="reveal-on-scroll">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-10 block">The Foundation</span>
            <h1 className="font-headline text-6xl sm:text-9xl text-primary leading-none mb-12 tracking-tighter">
              Our <span className="italic">Story.</span>
            </h1>
            <div className="w-16 h-[1px] bg-accent/30 mx-auto mb-16"></div>
          </div>
        </div>
      </section>

      {/* Modern Narrative Layout */}
      <section className="py-32 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center mb-48">
          <div className="lg:col-span-7 space-y-12 reveal-on-scroll">
            <div className="space-y-6">
              <h2 className="font-headline text-4xl sm:text-6xl text-primary leading-tight tracking-tight">
                A Single Thread, <br /><span className="italic">A Lifetime of Memories.</span>
              </h2>
              <div className="h-1 w-20 bg-accent/20"></div>
            </div>
            
            <div className="space-y-8 text-lg text-primary/70 leading-relaxed font-medium italic">
              <p>
                Fable & Forever was born from a simple realization: in a world of fast fashion, there is something deeply sacred about a "forever loop." A stitch that doesn't just hold fabric together, but holds a moment in time.
              </p>
              <p>
                Based in our artisanal studio, we are dedicated to the meditative art of slow stitching. We believe that when an artisan spends days on a single piece, that piece inherits a soul.
              </p>
            </div>

            <div className="pt-8">
               <Link href="/#shop" className="inline-flex items-center gap-6 group">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold uppercase tracking-[0.3em] text-[10px] text-primary">Discover the Collections</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl reveal-on-scroll stagger-2 stitching-border">
            <Image 
              src={storyImageUrl} 
              alt="Artisan at work" 
              fill 
              className="object-cover transition-transform duration-[10s] hover:scale-105"
              data-ai-hint="crochet bandana"
            />
          </div>
        </div>

        {/* Values Grid - Refined & Modern */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32 border-y border-primary/5 mb-48 bg-white/30 backdrop-blur-sm rounded-[4rem] px-12">
          {[
            { 
              icon: Feather, 
              title: 'The Fiber', 
              desc: 'We source only the softest cottons and premium wool blends that age beautifully with time.' 
            },
            { 
              icon: Palette, 
              title: 'The Palette', 
              desc: 'Our colors are inspired by heritage landscapes—muted, earthy, and timeless.' 
            },
            { 
              icon: Sparkles, 
              title: 'The Finish', 
              desc: 'Every loop is inspected for perfection, ensuring it can be passed down generations.' 
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-8 text-center reveal-on-scroll" style={{ transitionDelay: `${idx * 0.2}s` }}>
              <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-headline text-3xl text-primary">{item.title}</h3>
              <p className="text-primary/50 text-xs leading-relaxed max-w-[220px] mx-auto italic">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Statement - Clean & Bold */}
        <div className="max-w-4xl mx-auto text-center space-y-16 reveal-on-scroll">
          <div className="space-y-10">
            <Quote className="w-12 h-12 text-accent/20 mx-auto" />
            <h2 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">
              A Legacy in <br /><span className="italic">Every Loop.</span>
            </h2>
            <p className="text-primary/60 text-xl italic font-medium leading-relaxed px-6 max-w-2xl mx-auto">
              "We aren't just creating products. We are weaving a tapestry of history, one stitch at a time. When you hold a Fable & Forever treasure, you hold a piece of our heart."
            </p>
          </div>
          
          <div className="pt-20">
             <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto animate-float">
                <Scroll className="w-5 h-5 text-primary/20" />
             </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
