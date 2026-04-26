
"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Feather, Palette, ArrowRight, MousePointer2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
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

  const storyImageUrl = "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/products/1777062016035-WhatsApp_Image_2026_04_24_at_10.09.32_PM.jpeg";

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-primary/5">
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="reveal-on-scroll">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-8 block">The Philosophy</span>
            <h1 className="font-headline text-5xl sm:text-8xl text-primary leading-none mb-8 tracking-tighter">
              Our <span className="italic">Soul.</span>
            </h1>
            <div className="w-12 h-[1px] bg-accent/30 mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Human Narrative Layout */}
      <section className="py-16 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl sm:text-5xl text-primary leading-tight tracking-tight">
                It began with a hook, <br /><span className="italic">and a quiet afternoon in Kolkata.</span>
              </h2>
              <div className="h-1 w-16 bg-accent/20"></div>
            </div>
            
            <div className="space-y-6 text-base sm:text-lg text-primary/70 leading-relaxed font-medium italic">
              <p>
                Fable & Forever didn't start in a boardroom. It started in a sun-drenched corner of our home, where the rhythmic "click" of a crochet hook became a conversation between the hands and the heart.
              </p>
              <p>
                We believe that every stitch is a choice. A choice to use premium fibers that breathe, a choice to perfect a tension that lasts, and a choice to give every piece a name, not a serial number.
              </p>
            </div>

            <div className="pt-4">
               <Link href="/shop" className="inline-flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold uppercase tracking-[0.3em] text-[9px] text-primary">Browse the Heritage Gallery</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl reveal-on-scroll stagger-2 stitching-border">
            <Image 
              src={storyImageUrl} 
              alt="Artisan focus" 
              fill 
              className="object-cover transition-transform duration-[10s] hover:scale-105"
            />
          </div>
        </div>

        {/* The Maker's Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-16 border-y border-primary/5 mb-24 bg-white/30 backdrop-blur-sm rounded-[3rem] px-8">
          {[
            { 
              icon: Feather, 
              title: 'The Honest Thread', 
              desc: 'We only touch fibers that feel like a hug—pure cottons and soft wools.' 
            },
            { 
              icon: Palette, 
              title: 'A Muted World', 
              desc: 'Our colors are pulled from the earth and the vintage silks of our heritage.' 
            },
            { 
              icon: Sparkles, 
              title: 'The Forever Loop', 
              desc: 'Every loop is checked by eyes, not machines. Timeless perfection.' 
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4 text-center reveal-on-scroll" style={{ transitionDelay: `${idx * 0.2}s` }}>
              <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
                <item.icon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-headline text-2xl text-primary">{item.title}</h3>
              <p className="text-primary/50 text-[10px] leading-relaxed max-w-[200px] mx-auto italic font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The Human Connection */}
        <div className="max-w-4xl mx-auto text-center space-y-8 reveal-on-scroll">
          <div className="space-y-6">
            <h2 className="font-headline text-4xl sm:text-6xl text-primary leading-tight">
              A stitch is a <br /><span className="italic">promise kept.</span>
            </h2>
            <p className="text-primary/60 text-lg italic font-medium leading-relaxed px-6 max-w-2xl mx-auto">
              "When you hold a Fable & Forever piece, you aren't just holding yarn. You're holding days of patience and a dashboard for artisanal memory."
            </p>
          </div>
          
          <div className="pt-8">
             <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto animate-float">
                <MousePointer2 className="w-4 h-4 text-primary/20 rotate-12" />
             </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
