
"use client";

import React, { useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Send, Scissors, Star } from 'lucide-react';
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
    <main className="min-h-screen bg-paper overflow-x-hidden selection:bg-accent/30">
      <Navigation />
      
      <div className="relative">
        <Hero />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
      </div>
      
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-8 items-center">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-accent/50"></div>
          <div className="flex gap-4">
            <Sparkles className="text-accent w-6 h-6 animate-pulse" />
            <Heart className="text-primary w-5 h-5 animate-bounce delay-100 fill-primary/10" />
            <Sparkles className="text-accent w-6 h-6 animate-pulse delay-200" />
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-accent/50"></div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent/60">The Tale Continues</p>
      </div>

      <section ref={(el) => { if (el) scrollRefs.current[0] = el }} className="reveal-on-scroll">
        <FeaturedProducts />
      </section>

      <section ref={(el) => { if (el) scrollRefs.current[1] = el }} className="reveal-on-scroll">
        <CustomOrder />
      </section>
      
      <section 
        id="story" 
        ref={(el) => { if (el) scrollRefs.current[2] = el }}
        className="py-40 bg-white relative overflow-hidden reveal-on-scroll"
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                <div className="relative bg-white p-8 rounded-full shadow-2xl border border-accent/10 group-hover:rotate-12 transition-transform duration-500">
                  <Scissors className="text-primary w-12 h-12 -rotate-45" />
                </div>
              </div>
            </div>
            
            <h2 className="font-headline text-6xl md:text-8xl text-primary mb-12 leading-tight">
              A Fable in <span className="text-accent italic">every stitch,</span> <br />
              <span className="relative font-light text-primary/80">
                a Forever in every loop
                <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent/40 animate-weave" />
                </svg>
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
              {[
                { icon: "🧶", title: "Hand-Picked Fiber", desc: "Sourcing the softest cotton and ethically-farmed wool for our creations." },
                { icon: "✨", title: "Whimsical Details", desc: "Each piece is adorned with subtle charms and delicate, precise tension." },
                { icon: "🍃", title: "Eco-Conscious Craft", desc: "Reducing our footprint by using sustainable yarns and plastic-free packaging." }
              ].map((item, i) => (
                <div key={i} className="group bg-paper p-12 rounded-[3.5rem] stitching-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-4">
                  <div className="text-5xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{item.icon}</div>
                  <h4 className="font-headline text-2xl text-primary mb-6">{item.title}</h4>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-40 left-[5%] opacity-10 floating [animation-delay:3s]"><Star className="w-20 h-20 text-accent fill-current" /></div>
      </section>

      <section id="contact" className="py-40 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-[5rem] p-12 md:p-24 shadow-[0_50px_120px_-30px_rgba(45,115,107,0.2)] border-2 border-accent/5 relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="animate-fade-in-up">
                 <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-8 block">The Hook & Needle Mailbox</span>
                 <h2 className="font-headline text-6xl md:text-7xl text-primary mb-10 leading-[1.1]">Let's Weave <br /><span className="italic text-accent">Something New</span></h2>
                 <p className="text-muted-foreground font-medium italic mb-12 leading-relaxed text-xl max-w-sm">
                   "Questions about a pattern, or just want to say hi? Drop us a line and let's start a new story together."
                 </p>
                 <div className="flex items-center gap-6">
                    <div className="h-16 h-[2px] bg-accent/30"></div>
                    <div className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                      Next Batch: Early Summer
                    </div>
                 </div>
               </div>

               <form className="space-y-8 bg-paper p-10 md:p-14 rounded-[4rem] stitching-border shadow-inner">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Full Name</label>
                    <Input placeholder="Your lovely name" className="bg-white border-2 border-primary/5 h-16 rounded-3xl focus:border-accent transition-all px-8 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Email Address</label>
                    <Input type="email" placeholder="your@email.com" className="bg-white border-2 border-primary/5 h-16 rounded-3xl focus:border-accent transition-all px-8 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">The Story</label>
                    <Textarea placeholder="What are we creating today?" className="bg-white border-2 border-primary/5 min-h-[180px] rounded-[2.5rem] focus:border-accent transition-all p-8 text-lg leading-relaxed" />
                  </div>
                  <Button className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-base uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.97] group">
                    Send Message <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
