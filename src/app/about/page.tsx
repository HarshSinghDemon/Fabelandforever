"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Feather, Palette, BookOpen, Scroll, Quote } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const heritageBanner = PlaceHolderImages.find(img => img.id === 'heritage-banner');

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

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-24 reveal-on-scroll">
            <span className="text-accent font-bold tracking-[0.8em] uppercase text-[10px] mb-8 block">The Foundation</span>
            <h1 className="font-headline text-6xl sm:text-9xl text-primary leading-none mb-12">
              Our <span className="italic">Story.</span>
            </h1>
            <p className="text-primary/40 font-bold uppercase tracking-[0.5em] text-[10px] mb-16">সুতোয় বোনা প্রতিটি গল্প • EVERY STORY WOVEN IN THREAD</p>
            <div className="w-24 h-[1px] bg-accent/30 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* The Narrative */}
      <section className="pb-32 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
          <div className="space-y-12 reveal-on-scroll">
            <div className="relative">
              <Quote className="absolute -top-12 -left-12 w-24 h-24 text-accent/10 -z-10" />
              <h2 className="font-headline text-4xl sm:text-5xl text-primary leading-tight">
                A Single Thread, <br /><span className="italic">A Lifetime of Memories.</span>
              </h2>
            </div>
            <div className="space-y-8 text-lg text-primary/70 leading-relaxed font-medium italic">
              <p>
                Fable & Forever was born from a simple realization: in a world of fast fashion, there is something deeply sacred about a "forever loop." A stitch that doesn't just hold fabric together, but holds a moment in time.
              </p>
              <p>
                Based in the heart of Kolkata, our studio is dedicated to the meditative art of slow stitching. We believe that when an artisan spends days on a single piece, that piece inherits a soul.
              </p>
            </div>
            <div className="pt-8 flex items-center gap-6 group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="font-fancy text-3xl text-primary">Stitched by a single pair of hands</p>
            </div>
          </div>
          
          <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl reveal-on-scroll stagger-2">
            <Image 
              src={heritageBanner?.imageUrl || "https://picsum.photos/seed/story-1/800/1000"} 
              alt="Artisan at work" 
              fill 
              className="object-cover"
              data-ai-hint="crochet hands"
            />
            <div className="absolute inset-0 border-[20px] border-white/10 m-8 rounded-[3rem] pointer-events-none"></div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32 border-y border-primary/5 mb-48">
          {[
            { 
              icon: Feather, 
              title: 'The Fiber', 
              desc: 'We source only the softest cottons and premium wool blends that age beautifully with time.' 
            },
            { 
              icon: Palette, 
              title: 'The Palette', 
              desc: 'Our colors are inspired by the heritage landscapes of Kolkata—muted, earthy, and timeless.' 
            },
            { 
              icon: Sparkles, 
              title: 'The Finish', 
              desc: 'Every "forever loop" is inspected for perfection, ensuring it can be passed down generations.' 
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-8 text-center reveal-on-scroll" style={{ transitionDelay: `${idx * 0.2}s` }}>
              <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mx-auto stitching-border">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-headline text-3xl text-primary">{item.title}</h3>
              <p className="text-primary/50 text-sm leading-relaxed max-w-[250px] mx-auto italic">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="text-center space-y-16 reveal-on-scroll">
          <div className="inline-block p-10 bg-white rounded-[4rem] shadow-xl border border-primary/5">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-10" />
            <h2 className="font-headline text-4xl sm:text-6xl text-primary mb-8">A Legacy in Every Loop</h2>
            <p className="text-primary/60 text-xl max-w-3xl mx-auto italic font-medium leading-relaxed px-6">
              "We aren't just creating products. We are weaving a tapestry of history, one stitch at a time. When you hold a Fable & Forever treasure, you aren't just holding yarn—you're holding a piece of our story."
            </p>
          </div>
          
          <div className="pt-20">
             <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto animate-float">
                <Scroll className="w-6 h-6 text-primary/20" />
             </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
