"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Footer } from '@/components/Footer';
import { Send, ArrowRight, Sparkles, Feather, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function Home() {
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
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = "fableandforevercompany@gmail.com";
    const subject = encodeURIComponent(`Studio Inquiry: ${contactForm.name}`);
    const body = encodeURIComponent(contactForm.message);
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background selection:bg-accent/20">
      <Navigation />
      
      <Hero />
      
      {/* High-end Infinite Marquee */}
      <div className="py-24 border-y border-primary/5 overflow-hidden whitespace-nowrap bg-white/50 backdrop-blur-sm">
        <div className="flex animate-marquee gap-32">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-32 items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-primary/20 italic">Kolkata Heritage</span>
              <div className="w-1 h-1 bg-primary/10 rounded-full"></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-primary/20">Hand-Stitched Magic</span>
              <div className="w-1 h-1 bg-primary/10 rounded-full"></div>
              <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-primary/20 italic">Local Artistry</span>
              <div className="w-1 h-1 bg-primary/10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection spread */}
      <section className="reveal-on-scroll">
        <FeaturedProducts />
      </section>

      {/* The Artisanal Process Block */}
      <section className="py-60 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32 reveal-on-scroll">
            <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-8 block">Our Ethos</span>
            <h2 className="font-headline text-6xl sm:text-8xl text-primary leading-none">
              The <span className="italic">Journey.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-32 lg:gap-20">
            {[
              { 
                icon: Feather, 
                title: 'Pure Materials', 
                desc: 'Every loop begins with the highest quality, ethically sourced fibers.',
                step: 'I'
              },
              { 
                icon: Palette, 
                title: 'Color Artistry', 
                desc: 'Palettes curated to evoke emotion and complement modern interiors.',
                step: 'II'
              },
              { 
                icon: Sparkles, 
                title: 'Slow Stitching', 
                desc: 'A rejection of fast-fashion. Each piece is a meditation in patience.',
                step: 'III'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-8 group reveal-on-scroll" style={{ transitionDelay: `${idx * 0.2}s` }}>
                <div className="relative inline-block mb-10">
                  <span className="absolute -top-10 -right-10 text-8xl font-headline italic text-primary/5 select-none">{item.step}</span>
                  <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mx-auto transition-all duration-1000 group-hover:scale-110 shadow-sm border border-primary/5">
                    <item.icon className="w-6 h-6 text-accent opacity-60" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-3xl text-primary uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-primary/50 text-sm leading-relaxed max-w-[280px] mx-auto font-medium italic">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-60 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-start">
            <div className="reveal-on-scroll">
              <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-10 block">Connection</span>
              <h2 className="font-headline text-7xl sm:text-9xl text-primary leading-none mb-16">
                Say <br />
                <span className="italic">Hello.</span>
              </h2>
              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/30">Studio Inquiry</p>
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-2xl font-headline text-primary hover:text-accent transition-all flex items-center gap-6 group">
                    Email the Weaver <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
                  </Link>
                </div>
                <div className="pt-10 border-t border-primary/5">
                  <p className="text-xs font-bold text-primary/40 uppercase tracking-widest leading-relaxed">
                    Based in Kolkata<br />Delivering within Kolkata
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-20 reveal-on-scroll">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6 border-b border-primary/10 pb-6 group focus-within:border-primary transition-colors">
                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40">Identity</label>
                    <Input 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your Name" 
                      className="border-none bg-transparent p-0 h-10 text-2xl placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline" 
                    />
                  </div>
                  <div className="space-y-6 border-b border-primary/10 pb-6 group focus-within:border-primary transition-colors">
                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40">Email</label>
                    <Input 
                      required
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="you@domain.com" 
                      className="border-none bg-transparent p-0 h-10 text-2xl placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline" 
                    />
                  </div>
               </div>
               <div className="space-y-6 border-b border-primary/10 pb-6 group focus-within:border-primary transition-colors">
                  <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40">Whisper</label>
                  <Textarea 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your vision..." 
                    className="border-none bg-transparent p-0 min-h-[120px] text-2xl placeholder:text-primary/10 rounded-none focus-visible:ring-0 resize-none font-headline" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-16 px-20 rounded-none text-[9px] font-bold uppercase tracking-[0.5em] w-full sm:w-auto transition-all active:scale-95 shadow-2xl">
                 Transmit Message
               </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}