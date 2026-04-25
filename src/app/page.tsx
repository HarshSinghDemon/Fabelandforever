
"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CategoryGrid } from '@/components/CategoryGrid';
import { EditorialBanner } from '@/components/EditorialBanner';
import { Footer } from '@/components/Footer';
import { ArrowRight, Sparkles, Feather, Palette, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heritageBanner = PlaceHolderImages.find(img => img.id === 'heritage-banner');
  const gardenBanner = PlaceHolderImages.find(img => img.id === 'garden-banner');

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

  return (
    <main className="min-h-screen bg-background selection:bg-accent/20 relative pb-20 md:pb-0">
      <Navigation />
      
      <Hero />
      
      <div id="shop" className="space-y-0">
        <FeaturedProducts 
          title="New Arrivals" 
        />
        
        <FeaturedProducts 
          title="Bestsellers" 
          isBestseller 
        />

        <EditorialBanner 
          title="The Heritage Edit"
          subtitle="LEGACY IN EVERY STITCH"
          imageUrl={heritageBanner?.imageUrl || "https://picsum.photos/seed/heritage/1920/800"}
          imageHint="vintage crochet"
        />
        
        <FeaturedProducts 
          title="Most Loved Flowers" 
          categoryFilter="Flowers" 
          sideImage="https://picsum.photos/seed/flower-banner/800/1000"
          sideTitle="Flowers"
        />

        <EditorialBanner 
          title="The Enchanted Garden"
          subtitle="PREMIUM FLOWERS"
          imageUrl={gardenBanner?.imageUrl || "https://picsum.photos/seed/garden/1920/800"}
          imageHint="crochet flowers"
        />
        
        <FeaturedProducts 
          title="Most Loved Candles" 
          categoryFilter="Candles" 
          sideImage="https://picsum.photos/seed/candle-banner/800/1000"
          sideTitle="Candles"
        />

        <CategoryGrid />
      </div>

      <section className="py-12 md:py-24 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[8px] md:text-[9px] mb-6 md:mb-8 block reveal-on-scroll">Our Ethos</span>
          <h2 className="font-headline text-4xl sm:text-7xl text-primary leading-none mb-12 md:mb-24 reveal-on-scroll">
            The <span className="italic">Process.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              { icon: Feather, title: 'Pure Materials', desc: 'Sourced from local vendors, ensuring every loop starts with high quality fibers.' },
              { icon: Palette, title: 'Artisan Palette', desc: 'Colors chosen to evoke emotion and complement your heritage home.' },
              { icon: Sparkles, title: 'Slow Stitching', desc: 'Every treasure is a labor of love, taking days to achieve perfection.' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 md:space-y-6 reveal-on-scroll">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <h3 className="font-headline text-xl md:text-2xl text-primary uppercase tracking-tighter">{item.title}</h3>
                <p className="text-primary/50 text-[11px] md:text-[13px] leading-relaxed max-w-[200px] md:max-w-[240px] mx-auto italic">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="reveal-on-scroll">
              <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-6 md:mb-8 block">Connection</span>
              <h2 className="font-headline text-5xl md:text-6xl text-primary leading-none mb-8 md:mb-12">
                Contact <br />
                <span className="italic">Us.</span>
              </h2>
              <div className="space-y-6 md:space-y-8">
                <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">Based in Kolkata • Delivery Exclusively in Kolkata</p>
                <div className="pt-6 md:pt-8 border-t border-primary/5">
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-lg md:text-xl font-headline text-primary hover:text-accent transition-all flex items-center gap-4 md:gap-6 group">
                    Send an Email <ArrowRight className="w-4 h-4 md:w-5 h-5 group-hover:translate-x-4 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-8 md:space-y-12 reveal-on-scroll">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-3 border-b border-primary/10 pb-3">
                    <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Your Name</label>
                    <Input 
                      required
                      placeholder="Jane Doe" 
                      className="border-none bg-transparent p-0 text-base md:text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline h-auto" 
                    />
                  </div>
                  <div className="space-y-3 border-b border-primary/10 pb-3">
                    <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Email</label>
                    <Input 
                      required
                      type="email" 
                      placeholder="you@domain.com" 
                      className="border-none bg-transparent p-0 text-base md:text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline h-auto" 
                    />
                  </div>
               </div>
               <div className="space-y-3 border-b border-primary/10 pb-3">
                  <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Message</label>
                  <Textarea 
                    required
                    placeholder="Tell us about your dream project..." 
                    className="border-none bg-transparent p-0 min-h-[60px] md:min-h-[80px] text-base md:text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 resize-none font-headline" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-12 md:h-14 px-10 md:px-12 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-[0.5em] w-full sm:w-auto transition-all active:scale-95 shadow-lg">
                 Send Message
               </Button>
            </form>
          </div>
        </div>
      </section>

      <a 
        href="https://wa.me/910000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] bg-[#25D366] text-white p-2.5 md:p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-white text-[#25D366]" />
      </a>

      <Footer />
    </main>
  );
}
