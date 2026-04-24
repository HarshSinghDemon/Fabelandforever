
"use client";

import React, { useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Star, Send, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
                <Scissors className="text-primary w-10 h-10 relative z-10 -rotate-45" />
              </div>
            </div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">The Weaver's Hand</span>
            <h2 className="font-headline text-5xl md:text-6xl text-primary mb-12 leading-tight">
              Where every stitch is <br />
              <span className="text-accent italic relative font-light">
                a legacy in every loop
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/60" />
                </svg>
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20 text-left">
              {[
                { icon: "🧶", title: "Artisan Fiber", desc: "Hand-picked, premium cotton and alpaca blends for timeless softness." },
                { icon: "✨", title: "The Perfect Tension", desc: "Every piece is crafted with precise tension for durability and grace." },
                { icon: "🍃", title: "Sustainable Spells", desc: "Eco-conscious materials that honor both the craft and the earth." }
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

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_40px_100px_-20px_rgba(45,115,107,0.15)] border-2 border-accent/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
               <div>
                 <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Maker's Mailbox</span>
                 <h2 className="font-headline text-5xl md:text-6xl text-primary mb-8 leading-tight">Commission <br /><span className="italic text-accent">A Keepsake</span></h2>
                 <p className="text-muted-foreground font-medium italic mb-10 leading-relaxed text-lg">
                   "Share your dreams for a bespoke pattern or custom creation. Our hooks are ready to bring your thread to life."
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-primary font-bold uppercase tracking-widest text-[10px]">
                        <Scissors className="w-4 h-4 text-accent" />
                        Next Yarn Batch: Summer Solstice
                    </div>
                 </div>
               </div>

               <form className="space-y-6 bg-accent/5 p-8 md:p-10 rounded-[3rem] stitching-border">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">Your Name</label>
                    <Input placeholder="E.g. Clara Moss" className="bg-white border-2 border-primary/5 h-14 rounded-2xl focus:border-accent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">Email Address</label>
                    <Input type="email" placeholder="clara@fable.com" className="bg-white border-2 border-primary/5 h-14 rounded-2xl focus:border-accent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-2">Your Request</label>
                    <Textarea placeholder="Describe the texture, colors, or story you'd like us to stitch..." className="bg-white border-2 border-primary/5 min-h-[150px] rounded-3xl focus:border-accent transition-all" />
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Send Request <Send className="ml-2 w-4 h-4" />
                  </Button>
               </form>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
