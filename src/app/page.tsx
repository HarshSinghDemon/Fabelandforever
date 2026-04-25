"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CategoryGrid } from '@/components/CategoryGrid';
import { EditorialBanner } from '@/components/EditorialBanner';
import { Footer } from '@/components/Footer';
import { ArrowRight, Feather, Palette, Sparkles } from 'lucide-react';
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
      
      <div id="shop" className="space-y-0 relative z-10">
        <FeaturedProducts 
          title="New Arrivals" 
        />
        
        <FeaturedProducts 
          title="Bestsellers" 
          isBestseller 
        />

        <EditorialBanner 
          title="Hair Accessories"
          subtitle="LEGACY IN EVERY STITCH"
          imageUrl={heritageBanner?.imageUrl || "https://picsum.photos/seed/heritage/1920/800"}
          imageHint="crochet clips"
          link="/shop#hair accessories"
          className="reveal-on-scroll"
        />
        
        <FeaturedProducts 
          title="Most Loved Flowers" 
          categoryFilter="Flowers" 
        />

        <EditorialBanner 
          title="The Enchanted Garden"
          subtitle="PREMIUM COLLECTIONS"
          imageUrl={gardenBanner?.imageUrl || "https://picsum.photos/seed/garden/1920/800"}
          imageHint="crochet flowers"
          className="reveal-on-scroll"
        />
        
        <FeaturedProducts 
          title="Most Loved Amigurumi" 
          categoryFilter="Amigurumi" 
        />

        <CategoryGrid />
      </div>

      <section className="py-6 md:py-12 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <span className="text-accent font-bold tracking-[0.6em] uppercase text-[8px] md:text-[9px] mb-2 md:mb-4 block reveal-on-scroll">Our Ethos</span>
          <h2 className="font-headline text-3xl sm:text-6xl text-primary leading-none mb-6 md:mb-10 reveal-on-scroll">
            The <span className="italic">Process.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Feather, title: 'Pure Materials', desc: 'Sourced from local vendors, ensuring every loop starts with high quality fibers.' },
              { icon: Palette, title: 'Artisan Palette', desc: 'Colors chosen to evoke emotion and complement your heritage home.' },
              { icon: Sparkles, title: 'Slow Stitching', desc: 'Every creation is a labor of love, taking days to achieve perfection.' }
            ].map((item, idx) => (
              <div key={idx} className={`space-y-2 md:space-y-4 reveal-on-scroll stagger-${idx + 1}`}>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-paper rounded-full flex items-center justify-center mx-auto border border-primary/5 shadow-sm hover:scale-110 transition-transform duration-500 group">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="font-headline text-base md:text-xl text-primary uppercase tracking-tighter">{item.title}</h3>
                <p className="text-primary/50 text-[10px] md:text-[12px] leading-relaxed max-w-[220px] md:max-w-[260px] mx-auto italic">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="contact" className="py-12 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="reveal-on-scroll">
              <span className="text-accent font-bold tracking-[0.6em] uppercase text-[9px] mb-4 block">Connection</span>
              <h2 className="font-headline text-5xl md:text-8xl text-primary leading-none mb-6">
                Contact <br />
                <span className="italic">Us.</span>
              </h2>
              <div className="space-y-6">
                <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[10px]">Based in Kolkata • Delivery Exclusively in Kolkata</p>
                <div className="pt-4 border-t border-primary/5">
                  <Link href="mailto:fableandforevercompany@gmail.com" className="text-xl md:text-2xl font-headline text-primary hover:text-accent transition-all flex items-center gap-4 group">
                    Send an Email <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-8 reveal-on-scroll stagger-2 bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] border border-primary/5 shadow-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 border-b border-primary/10 pb-2">
                    <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Your Name</label>
                    <Input 
                      required
                      placeholder="Jane Doe" 
                      className="border-none bg-transparent p-0 text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline h-auto" 
                    />
                  </div>
                  <div className="space-y-2 border-b border-primary/10 pb-2">
                    <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Email</label>
                    <Input 
                      required
                      type="email" 
                      placeholder="you@domain.com" 
                      className="border-none bg-transparent p-0 text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 font-headline h-auto" 
                    />
                  </div>
               </div>
               <div className="space-y-2 border-b border-primary/10 pb-2">
                  <label className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/40">Message</label>
                  <Textarea 
                    required
                    placeholder="Tell us about your dream project..." 
                    className="border-none bg-transparent p-0 min-h-[80px] text-lg placeholder:text-primary/10 rounded-none focus-visible:ring-0 resize-none font-headline" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-full text-[8px] font-bold uppercase tracking-[0.6em] w-full transition-all active:scale-95 shadow-2xl shadow-primary/20 hover:scale-[1.02]">
                 Send Message
               </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
