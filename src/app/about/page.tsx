
"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Feather, Palette, BookOpen, Scroll, Quote, ArrowRight, MousePointer2 } from 'lucide-react';
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
      <section className="relative pt-48 pb-32 overflow-hidden border-b border-primary/5">
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="reveal-on-scroll">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-10 block">The Philosophy</span>
            <h1 className="font-headline text-6xl sm:text-9xl text-primary leading-none mb-12 tracking-tighter">
              Our <span className="italic">Soul.</span>
            </h1>
            <div className="w-16 h-[1px] bg-accent/30 mx-auto mb-16"></div>
          </div>
        </div>
      </section>

      {/* Human Narrative Layout */}
      <section className="py-32 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center mb-48">
          <div className="lg:col-span-7 space-y-12 reveal-on-scroll">
            <div className="space-y-6">
              <h2 className="font-headline text-4xl sm:text-6xl text-primary leading-tight tracking-tight">
                It began with a hook, <br /><span className="italic">and a quiet afternoon in Kolkata.</span>
              </h2>
              <div className="h-1 w-20 bg-accent/20"></div>
            </div>
            
            <div className="space-y-8 text-lg text-primary/70 leading-relaxed font-medium italic">
              <p>
                Fable & Forever didn't start in a boardroom. It started in a sun-drenched corner of our home, where the rhythmic "click" of a crochet hook became a conversation between the hands and the heart. In a world that races toward the disposable, we chose the slow path.
              </p>
              <p>
                We believe that every stitch is a choice. A choice to use premium fibers that breathe, a choice to perfect a tension that lasts, and a choice to give every piece a name, not a serial number. When we spend days on a single bandana or a tiny amigurumi pal, we aren't just "making products"—we are breathing life into yarn.
              </p>
              <p>
                Based here in the heart of Kolkata, our studio is a sanctuary for the meditative art of slow stitching. We don't chase trends; we weave heirlooms.
              </p>
            </div>

            <div className="pt-8">
               <Link href="/shop" className="inline-flex items-center gap-6 group">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold uppercase tracking-[0.3em] text-[10px] text-primary">Browse the Heritage Gallery</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl reveal-on-scroll stagger-2 stitching-border">
            <Image 
              src={storyImageUrl} 
              alt="Artisan focus" 
              fill 
              className="object-cover transition-transform duration-[10s] hover:scale-105"
            />
          </div>
        </div>

        {/* The Maker's Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32 border-y border-primary/5 mb-48 bg-white/30 backdrop-blur-sm rounded-[4rem] px-12">
          {[
            { 
              icon: Feather, 
              title: 'The Honest Thread', 
              desc: 'We only touch fibers that feel like a hug—pure cottons and soft wools that grow softer with every year they spend with you.' 
            },
            { 
              icon: Palette, 
              title: 'A Muted World', 
              desc: 'Our colors are pulled from the earth, the sky, and the vintage silks of our heritage. Timeless, never loud.' 
            },
            { 
              icon: Sparkles, 
              title: 'The Forever Loop', 
              desc: 'Every loop is checked by eyes, not machines. If it isn’t perfect enough to pass to your grandchildren, it doesn’t leave the loom.' 
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-8 text-center reveal-on-scroll" style={{ transitionDelay: `${idx * 0.2}s` }}>
              <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-headline text-3xl text-primary">{item.title}</h3>
              <p className="text-primary/50 text-[10px] leading-relaxed max-w-[220px] mx-auto italic font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The Human Connection */}
        <div className="max-w-4xl mx-auto text-center space-y-16 reveal-on-scroll">
          <div className="space-y-10">
            <Quote className="w-12 h-12 text-accent/20 mx-auto" />
            <h2 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">
              A stitch is a <br /><span className="italic">promise kept.</span>
            </h2>
            <p className="text-primary/60 text-xl italic font-medium leading-relaxed px-6 max-w-2xl mx-auto">
              "When you hold a Fable & Forever piece, you aren't just holding yarn. You're holding days of patience, a dash of Kolkata's soul, and a piece of our history. We don't just want to be in your wardrobe; we want to be part of your story."
            </p>
          </div>
          
          <div className="pt-20">
             <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto animate-float">
                <MousePointer2 className="w-5 h-5 text-primary/20 rotate-12" />
             </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
