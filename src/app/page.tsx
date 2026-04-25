"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';
import { Send, ArrowRight, Mail, Sparkles, Feather, Palette } from 'lucide-react';
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
    const subject = encodeURIComponent(`New Inquiry: ${contactForm.name}`);
    const body = encodeURIComponent(contactForm.message);
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background selection:bg-accent/20">
      <Navigation />
      
      <Hero />
      
      <div className="py-20 border-y border-primary/5 overflow-hidden whitespace-nowrap bg-white">
        <div className="flex animate-marquee gap-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Handmade with care</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">100% Quality Yarn</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Unique Designs</span>
            </div>
          ))}
        </div>
      </div>

      <section ref={(el) => { if (el) scrollRefs.current[0] = el }} className="reveal-on-scroll">
        <FeaturedProducts />
      </section>

      <section className="py-40 bg-white border-y border-primary/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12">
            {[
              { icon: Feather, title: 'Fine Materials', desc: 'We only use soft, durable, and ethically sourced yarns.' },
              { icon: Palette, title: 'Artisan Colors', desc: 'Each color combination is picked to look beautiful in your home.' },
              { icon: Sparkles, title: 'Perfect Finish', desc: 'Detailed craftsmanship ensures every piece is built to last.' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-6 group">
                <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-headline text-2xl text-primary">{item.title}</h3>
                <p className="text-primary/60 text-sm leading-relaxed max-w-[250px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={(el) => { if (el) scrollRefs.current[1] = el }} className="reveal-on-scroll">
        <CustomOrder />
      </section>
      
      <section 
        id="contact" 
        className="py-40 bg-white"
        ref={(el) => { if (el) scrollRefs.current[3] = el }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] mb-8 block">Get in Touch</span>
              <h2 className="font-headline text-6xl sm:text-8xl text-primary leading-none mb-12">
                Contact <br />
                <span className="italic">Us.</span>
              </h2>
              <p className="text-xl text-primary/60 italic leading-relaxed max-w-sm">
                Have questions about a product or a custom order? We are here to help.
              </p>
              
              <div className="mt-20 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Email Us</p>
                <Link href="mailto:fableandforevercompany@gmail.com" className="text-2xl font-headline text-primary hover:text-accent transition-colors flex items-center gap-4">
                  fableandforevercompany@gmail.com <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4 border-b border-primary/10 pb-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Full Name</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Message</label>
                  <Textarea 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we help you?" 
                    className="border-none bg-transparent p-0 min-h-[150px] text-xl placeholder:text-primary/10 rounded-none focus-visible:ring-0 resize-none" 
                  />
               </div>
               <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-16 px-16 rounded-none text-[11px] font-bold uppercase tracking-[0.3em] w-full sm:w-auto">
                 Send Message <Send className="ml-4 w-4 h-4" />
               </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
