"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { EditorialBanner } from '@/components/EditorialBanner';
import { Footer } from '@/components/Footer';
import { ArrowRight, Feather, Palette, Sparkles, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function Home() {
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = "fableandforevercompany@gmail.com";
    window.open(`mailto:${recipient}`, '_blank');
  };

  const hairImg = "https://qigxixiekbdkeperulpk.supabase.co/storage/v1/object/public/uploads/anya-chernykh-kwrYG3RdVt4-unsplash.jpg";
  const bandanaImg = "https://images.unsplash.com/photo-1591051649443-453d2e0a716d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <main className="min-h-screen bg-background selection:bg-accent/20 relative pb-24 md:pb-0">
      <Navigation />
      
      <Hero />
      
      <div id="shop" className="space-y-0 relative z-10">
        <FeaturedProducts title="New Arrivals" />
        <FeaturedProducts title="Bestsellers" isBestseller />

        <EditorialBanner 
          title="Hair Accessories"
          subtitle="LEGACY IN EVERY STITCH"
          imageUrl={hairImg}
          imageHint="crochet clips"
          link="/shop#hair-accessories"
          className="reveal-on-scroll"
        />
        
        <FeaturedProducts title="Most Loved Flowers" categoryFilter="Flowers" />

        <EditorialBanner 
          title="Artisan Bandanas"
          subtitle="PREMIUM COLLECTIONS"
          imageUrl={bandanaImg}
          imageHint="crochet bandana"
          link="/shop#bandana"
          className="reveal-on-scroll"
        />
        
        <FeaturedProducts title="Most Loved Amigurumi" categoryFilter="Amigurumi" />
      </div>

      <section className="py-16 md:py-24 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <span className="text-accent font-black tracking-[0.8em] uppercase text-[10px] mb-6 block reveal-on-scroll">Our Ethos</span>
          <h2 className="font-headline text-4xl sm:text-7xl text-primary leading-none mb-12 md:mb-16 reveal-on-scroll">
            The <span className="italic">Process.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
            {[
              { icon: Feather, title: 'Pure Materials', desc: 'Sourced from local vendors, ensuring every loop starts with high quality fibers.' },
              { icon: Palette, title: 'Artisan Palette', desc: 'Colors chosen to evoke emotion and complement your heritage home.' },
              { icon: Sparkles, title: 'Slow Stitching', desc: 'Every creation is a labor of love, taking days to achieve perfection.' }
            ].map((item, idx) => (
              <div key={idx} className={`space-y-4 md:space-y-8 reveal-on-scroll stagger-${idx + 1}`}>
                <div className="w-14 h-14 md:w-20 md:h-20 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm hover:scale-110 transition-transform duration-500 group">
                  <item.icon className="w-5 h-5 md:w-8 md:h-8 text-accent group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="font-headline text-xl md:text-3xl text-primary uppercase tracking-tighter">{item.title}</h3>
                <p className="text-primary/60 text-xs md:text-base leading-relaxed max-w-[280px] mx-auto italic font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-16 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div className="reveal-on-scroll">
              <span className="text-accent font-black tracking-[0.8em] uppercase text-[11px] mb-6 block">Direct Connection</span>
              <h2 className="font-headline text-5xl md:text-[8rem] text-primary leading-none mb-10">
                Contact <br />
                <span className="italic text-accent">Us.</span>
              </h2>
              <div className="space-y-6 md:space-y-10">
                <div className="p-6 md:p-8 bg-accent text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                       <Instagram className="w-8 h-8" />
                       <h3 className="font-headline text-xl md:text-3xl">Order via DM</h3>
                    </div>
                    <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed text-white/80">
                      Bespoke consultations and custom order manifesting exclusively via Instagram DMs.
                    </p>
                    <Link href="https://www.instagram.com/fable.and.forever/" target="_blank" className="inline-flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] bg-white text-accent px-6 py-4 rounded-full mt-2 w-full md:w-fit shadow-lg">
                      Start Ritual <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-8 pt-4">
                  <p className="text-primary/70 font-black uppercase tracking-[0.5em] text-[12px] leading-relaxed">
                    Based in Kolkata • Delivery Exclusively in Kolkata <br />
                  </p>
                  <div className="pt-8 border-t border-primary/10 flex flex-col gap-8">
                    <Link href="mailto:fableandforevercompany@gmail.com" className="text-2xl md:text-4xl font-headline text-primary hover:text-accent transition-all flex items-center gap-6 group">
                      Send an Email <ArrowRight className="w-8 h-8 group-hover:translate-x-6 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-8 md:space-y-10 reveal-on-scroll stagger-2 bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-primary/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-accent/20"></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-3 border-b-2 border-primary/80 pb-4 focus-within:border-accent transition-colors">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Your Name</label>
                    <Input 
                      required
                      placeholder="Your name" 
                      className="border-none bg-transparent p-0 text-lg md:text-2xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 font-headline h-auto text-primary font-bold" 
                    />
                  </div>
                  <div className="space-y-3 border-b-2 border-primary/80 pb-4 focus-within:border-accent transition-colors">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Email Address</label>
                    <Input 
                      required
                      type="email" 
                      placeholder="hello@example.com" 
                      className="border-none bg-transparent p-0 text-lg md:text-2xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 font-headline h-auto text-primary font-bold" 
                    />
                  </div>
               </div>
               <div className="space-y-3 border-b-2 border-primary/80 pb-4 focus-within:border-accent transition-colors">
                  <label className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Your Vision / Message</label>
                  <Textarea 
                    required
                    placeholder="Tell us about your dream crochet project..." 
                    className="border-none bg-transparent p-0 min-h-[120px] md:min-h-[140px] text-lg md:text-2xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 resize-none font-headline text-primary leading-relaxed font-bold" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-16 md:h-20 px-12 rounded-full text-[12px] font-black uppercase tracking-[0.8em] w-full transition-all active:scale-95 shadow-2xl shadow-primary/40 hover:scale-[1.02] group">
                 Manifest Message <Sparkles className="ml-4 w-5 h-5 group-hover:rotate-45 transition-transform" />
               </Button>
               
               <p className="text-center text-[9px] font-bold uppercase tracking-[0.4em] text-primary/40 pt-2">
                 Our studio typically responds within one moon cycle
               </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
