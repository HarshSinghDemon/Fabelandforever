"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';
import { Send, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function Home() {
  const scrollRefs = useRef<(HTMLElement | null)[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = "fableandforevercompany@gmail.com";
    const subject = encodeURIComponent(`Inquiry from Boutique: ${contactForm.name}`);
    const body = encodeURIComponent(contactForm.message);
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background selection:bg-accent/20">
      <Navigation />
      
      <Hero />
      
      {/* Category Scroll Placeholder (Floriy Dynamic) */}
      <div className="py-20 border-y border-primary/5 overflow-hidden whitespace-nowrap bg-white">
        <div className="flex animate-marquee gap-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Hand-Stitched Treasures</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Heirloom Quality</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Slow Crafted Luxury</span>
            </div>
          ))}
        </div>
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
        className="py-40 bg-[#F9F8F6] reveal-on-scroll"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px]">The Weaver's Heart</span>
            
            <h2 className="font-headline text-5xl sm:text-7xl md:text-8xl text-primary leading-tight">
              Crafted in the <br /><span className="italic">quiet moments.</span>
            </h2>

            <div className="space-y-8 max-w-2xl mx-auto">
              <p className="text-xl sm:text-2xl text-primary font-headline italic leading-relaxed">
                আমাদের প্রতিটি সৃষ্টি, ভালোবাসার রঙে রাঙানো এবং যত্নে বোনা। গল্পের প্রতিটি স্টিচ, হৃদয়ের ছোঁয়ায়।
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-accent opacity-60">
                Every stitch of the story, with a touch of the heart.
              </p>
            </div>

            <p className="text-lg text-primary/70 leading-relaxed font-medium max-w-3xl mx-auto">
              Fable & Forever started with a rhythmic 'click-pull' of a single hook and a ball of yarn that felt like a promise. We believe in the magic of things that take hours to grow—in objects that carry the heartbeat of the person who made them.
            </p>
          </div>
        </div>
      </section>

      <section 
        id="contact" 
        className="py-40 bg-white"
        ref={(el) => { if (el) scrollRefs.current[3] = el }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block">Inquiries</span>
              <h2 className="font-headline text-6xl sm:text-8xl text-primary leading-none mb-12">
                Stitch <br />
                <span className="italic">with us.</span>
              </h2>
              <p className="text-xl text-primary/60 italic leading-relaxed max-w-sm">
                "Questions about a pattern, a commission, or just a friendly whisper? Our loom is always open."
              </p>
              
              <div className="mt-20 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Connect Directly</p>
                <Link href="mailto:fableandforevercompany@gmail.com" className="text-2xl font-headline text-primary hover:text-accent transition-colors flex items-center gap-4">
                  fableandforevercompany@gmail.com <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4 border-b border-primary/10 pb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Your Name</label>
                    <Input 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Enter your name" 
                      className="border-none bg-transparent p-0 h-10 text-xl placeholder:text-primary/10 rounded-none focus-visible:ring-0" 
                    />
                  </div>
                  <div className="space-y-4 border-b border-primary/10 pb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Email Address</label>
                    <Input 
                      required
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com" 
                      className="border-none bg-transparent p-0 h-10 text-xl placeholder:text-primary/10 rounded-none focus-visible:ring-0" 
                    />
                  </div>
               </div>
               <div className="space-y-4 border-b border-primary/10 pb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Your Story / Inquiry</label>
                  <Textarea 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your forever treasure..." 
                    className="border-none bg-transparent p-0 min-h-[150px] text-xl placeholder:text-primary/10 rounded-none focus-visible:ring-0 resize-none" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-16 px-16 rounded-none text-[11px] font-bold uppercase tracking-[0.3em] w-full sm:w-auto">
                 Send Inquiry <Send className="ml-4 w-4 h-4" />
               </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
