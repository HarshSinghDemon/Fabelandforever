"use client";

import React, { useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function Home() {
  const scrollRefs = useRef<(HTMLElement | null)[]>([]);

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

    scrollRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-dots overflow-x-hidden">
      <Navigation />
      <Hero />
      
      {/* Whimsical Transition */}
      <div className="h-32 bg-gradient-to-b from-transparent to-white/50 flex items-center justify-center">
        <div className="flex gap-4">
          <Sparkles className="text-accent w-6 h-6 animate-pulse" />
          <Heart className="text-primary w-4 h-4 animate-bounce delay-100" />
          <Sparkles className="text-accent w-6 h-6 animate-pulse delay-200" />
        </div>
      </div>

      <section ref={(el) => { if (el) scrollRefs.current[0] = el }} className="reveal-on-scroll">
        <FeaturedProducts />
      </section>
      
      {/* Story / About Section */}
      <section 
        id="story" 
        ref={(el) => { if (el) scrollRefs.current[1] = el }}
        className="py-32 bg-secondary/20 relative overflow-hidden reveal-on-scroll"
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
                <Star className="text-primary w-10 h-10 relative z-10 fill-primary/10" />
              </div>
            </div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">The Fable Heritage</span>
            <h2 className="font-headline text-5xl md:text-6xl text-primary mb-12 leading-tight">
              Where every stitch is a <br />
              <span className="text-accent italic relative font-light">
                legacy of love
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/60" />
                </svg>
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 text-left">
              {[
                { icon: "🌿", title: "Softest Hugs", desc: "Premium ethical yarns that feel like clouds against your skin." },
                { icon: "📖", title: "Forever Tales", desc: "Each creation arrives with its own hand-calligraphed birth certificate." },
                { icon: "✨", title: "Heart-Stitched", desc: "Slow-made magic that values patience and precision above all else." }
              ].map((item, i) => (
                <div key={i} className="group bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] stitching-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                  <h4 className="font-headline text-xl text-primary mb-4">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative Floating Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl floating"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl floating [animation-delay:2s]"></div>
      </section>

      <section ref={(el) => { if (el) scrollRefs.current[2] = el }} className="reveal-on-scroll">
        <CustomOrder />
      </section>
      
      {/* Newsletter Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-primary rounded-[4rem] p-16 text-center text-primary-foreground shadow-[0_30px_60px_-15px_rgba(45,115,107,0.3)] relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] opacity-40"></div>
             <div className="relative z-10">
               <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Inner Circle</span>
               <h2 className="font-headline text-5xl md:text-7xl mb-8 uppercase tracking-tight">Join the Fable</h2>
               <p className="mb-12 text-primary-foreground/90 max-w-xl mx-auto text-lg font-medium italic">
                 "Sign your name in our Book of Forever and receive a sprinkle of magic in your inbox every full moon."
               </p>
               <div className="flex flex-col sm:flex-row gap-5 max-w-lg mx-auto">
                 <input 
                   type="email" 
                   placeholder="Your magical email address" 
                   className="flex-1 bg-white/10 border-2 border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-accent/40 backdrop-blur-md transition-all"
                 />
                 <button className="btn-squish bg-accent text-accent-foreground px-12 py-5 rounded-2xl hover:bg-white hover:text-primary transition-all font-bold whitespace-nowrap shadow-xl uppercase tracking-widest text-xs">
                   Subscribe ✨
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
