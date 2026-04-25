"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CategoryGrid } from '@/components/CategoryGrid';
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
    <main className="min-h-screen bg-background selection:bg-accent/20 relative pb-20 md:pb-0">
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

        <CategoryGrid />
      </div>

      <section className="py-12 md:py-24 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-4 md:mb-6 block reveal-on-scroll">Our Ethos</span>
          <h2 className="font-headline text-4xl sm:text-7xl text-primary leading-none mb-10 md:mb-16 reveal-on-scroll">
            The <span className="italic">Process.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {[
              { icon: Feather, title: 'Pure Materials', desc: 'Sourced from local vendors, ensuring every loop starts with high quality fibers.' },
              { icon: Palette, title: 'Artisan Palette', desc: 'Colors chosen to evoke emotion and complement your heritage home.' },
              { icon: Sparkles, title: 'Slow Stitching', desc: 'Every creation is a labor of love, taking days to achieve perfection.' }
            ].map((item, idx) => (
              <div key={idx} className={`space-y-4 md:space-y-6 reveal-on-scroll stagger-${idx + 1}`}>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm hover:scale-110 transition-transform duration-500 group">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="font-headline text-xl md:text-3xl text-primary uppercase tracking-tighter">{item.title}</h3>
                <p className="text-primary/60 text-xs md:text-sm leading-relaxed max-w-[260px] mx-auto italic font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-24 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="reveal-on-scroll">
              <span className="text-accent font-black tracking-[0.6em] uppercase text-[10px] mb-6 block">Direct Connection</span>
              <h2 className="font-headline text-6xl md:text-[9rem] text-primary leading-none mb-10">
                Contact <br />
                <span className="italic text-accent">Us.</span>
              </h2>
              <div className="space-y-8">
                <p className="text-primary/60 font-black uppercase tracking-[0.4em] text-[11px] leading-relaxed">
                  Based in Kolkata • Delivery Exclusively in Kolkata <br />
                  <span className="text-accent">Custom inquiries via Instagram DMs</span>
                </p>
                <div className="pt-8 border-t border-primary/10 flex flex-col gap-8">
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-2xl md:text-4xl font-headline text-primary hover:text-accent transition-all flex items-center gap-6 group">
                    Send an Email <ArrowRight className="w-8 h-8 group-hover:translate-x-6 transition-transform" />
                  </Link>
                  <Link href="https://www.instagram.com/fable.and.forever/" target="_blank" className="text-2xl md:text-4xl font-headline text-accent hover:text-primary transition-all flex items-center gap-6 group">
                    DM on Instagram <Instagram className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-10 reveal-on-scroll stagger-2 bg-white p-8 md:p-16 rounded-[4rem] border border-primary/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent/20 rounded-full mt-6"></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 border-b-2 border-primary/10 pb-4 focus-within:border-accent transition-colors">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Your Name</label>
                    <Input 
                      required
                      placeholder="Enter your name" 
                      className="border-none bg-transparent p-0 text-xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 font-headline h-auto text-primary" 
                    />
                  </div>
                  <div className="space-y-3 border-b-2 border-primary/10 pb-4 focus-within:border-accent transition-colors">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Email Address</label>
                    <Input 
                      required
                      type="email" 
                      placeholder="hello@example.com" 
                      className="border-none bg-transparent p-0 text-xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 font-headline h-auto text-primary" 
                    />
                  </div>
               </div>
               <div className="space-y-3 border-b-2 border-primary/10 pb-4 focus-within:border-accent transition-colors">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Your Vision / Message</label>
                  <Textarea 
                    required
                    placeholder="Tell us about your dream crochet project..." 
                    className="border-none bg-transparent p-0 min-h-[120px] text-xl placeholder:text-primary/20 rounded-none focus-visible:ring-0 resize-none font-headline text-primary" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-20 px-12 rounded-full text-[10px] font-black uppercase tracking-[0.6em] w-full transition-all active:scale-95 shadow-2xl shadow-primary/30 hover:scale-[1.02] group">
                 Manifest Message <Sparkles className="ml-4 w-5 h-5 group-hover:rotate-45 transition-transform" />
               </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
