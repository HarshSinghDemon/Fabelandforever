"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { CustomOrder } from '@/components/CustomOrder';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Send, Scissors, Star, BookOpen, Coffee, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
    const subject = encodeURIComponent(`Crochet Inquiry: ${contactForm.name}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\n` +
      `Email: ${contactForm.email}\n\n` +
      `Message:\n${contactForm.message}`
    );

    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-paper overflow-x-hidden selection:bg-accent/30">
      <Navigation />
      
      <div className="relative">
        <Hero />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
      </div>
      
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4 sm:gap-8 items-center">
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-accent/50"></div>
          <div className="flex gap-3 sm:gap-4">
            <Sparkles className="text-accent w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
            <Heart className="text-primary w-4 h-4 sm:w-5 sm:h-5 animate-bounce delay-100 fill-primary/10" />
            <Sparkles className="text-accent w-4 h-4 sm:w-6 sm:h-6 animate-pulse delay-200" />
          </div>
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-accent/50"></div>
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
        className="py-24 sm:py-40 bg-white relative overflow-hidden reveal-on-scroll"
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                <div className="relative bg-white p-6 sm:p-8 rounded-full shadow-2xl border border-accent/10 group-hover:rotate-12 transition-transform duration-500">
                  <BookOpen className="text-primary w-8 h-8 sm:w-12 sm:h-12" />
                </div>
              </div>
            </div>
            
            <h2 className="font-headline text-4xl sm:text-6xl md:text-8xl text-primary mb-8 sm:mb-12 leading-tight">
              A Fable in <span className="text-accent italic">every stitch,</span> <br />
              <span className="relative font-light text-primary/80">
                a Forever in every loop
                <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent/40 animate-weave" />
                </svg>
              </span>
            </h2>

            <div className="max-w-3xl mx-auto mb-20 space-y-6">
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed italic">
                "Fable & Forever didn't start in a workshop or a business meeting. It started in the quiet hours of 2 AM, with the rhythmic 'click-pull' of a single hook and a ball of yarn that felt like a promise."
              </p>
              
              <div className="py-6 space-y-4">
                <p className="text-2xl sm:text-3xl text-primary font-headline italic">
                  আমাদের প্রতিটি সৃষ্টি, ভালোবাসার রঙে রাঙানো এবং যত্নে বোনা।
                </p>
                <p className="text-xl sm:text-2xl text-accent font-medium italic">
                  গল্পের প্রতিটি স্টিচ, হৃদয়ের ছোঁয়ায়।
                </p>
                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  (Every stitch of the story, with a touch of the heart)
                </p>
              </div>

              <p className="text-lg text-primary/70 leading-relaxed font-medium">
                We believe that in a world of machines and 'fast' fashion, there is a profound magic in something that takes hours to grow. Our studio is built on the belief that a gift should hold the heartbeat of the person who made it. We don't just count stitches; we count memories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { 
                  icon: <Coffee className="w-8 h-8 text-primary" />, 
                  title: "Slow-Steeped Craft", 
                  desc: "ধীর গতির শৈল্পিকতা—Like a good cup of tea, our treasures can't be rushed. We embrace the slow, deliberate pace of hand-crochet to ensure every loop is intentional." 
                },
                { 
                  icon: <Wind className="w-8 h-8 text-primary" />, 
                  title: "Living Materials", 
                  desc: "প্রাণের সুতো—We source yarns that feel like a soft breeze—ethically farmed wools and organic cottons that get softer the more they are loved." 
                },
                { 
                  icon: <Scissors className="w-8 h-8 text-primary" />, 
                  title: "Artisanal Integrity", 
                  desc: "কারুশিল্পীর সততা—Our hands are our most important tools. From the initial chain to the final weave-in, every piece is finished with heirloom-quality precision." 
                }
              ].map((item, i) => (
                <div key={i} className="group bg-paper p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] stitching-border hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2 sm:hover:-translate-y-4">
                  <div className="flex justify-center mb-6 sm:mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h4 className="font-headline text-xl sm:text-2xl text-primary mb-4 sm:mb-6">{item.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section 
        id="contact" 
        className="py-24 sm:py-40 relative bg-background"
        ref={(el) => { if (el) scrollRefs.current[3] = el }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] sm:rounded-[5rem] p-8 sm:p-24 shadow-[0_50px_120px_-30px_rgba(45,115,107,0.2)] border-2 border-accent/5 relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">
               <div className="animate-fade-in-up">
                 <span className="text-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-4 sm:mb-6 block text-center lg:text-left">The Crochet Inbox</span>
                 <p className="text-primary font-bold text-xl sm:text-2xl mb-6 sm:mb-10 text-center lg:text-left italic">আমাদের সাথে যোগাযোগ করুন (Contact Us)</p>
                 <h2 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-primary mb-6 sm:mb-10 leading-[0.9] tracking-tight text-center lg:text-left">
                   Stitch <br className="hidden sm:block" />
                   <span className="italic text-accent relative inline-block">
                     With Us
                     <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                       <path d="M0 5 Q 25 10 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/30" />
                     </svg>
                   </span>
                 </h2>
                 <p className="text-muted-foreground font-medium italic mb-8 sm:mb-12 leading-relaxed text-lg sm:text-2xl max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
                   "Questions about a pattern, or just want to say hi? Drop us a line and let's start a new crochet story together."
                 </p>
               </div>

               <form onSubmit={handleContactSubmit} className="space-y-6 sm:space-y-8 bg-paper p-6 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] stitching-border shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Full Name</label>
                    <Input 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your lovely name" 
                      className="bg-white border-2 border-primary/5 h-14 sm:h-16 rounded-2xl sm:rounded-3xl focus:border-accent transition-all px-6 sm:px-8 text-base sm:text-lg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Email Address</label>
                    <Input 
                      required
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com" 
                      className="bg-white border-2 border-primary/5 h-14 sm:h-16 rounded-2xl sm:rounded-3xl focus:border-accent transition-all px-6 sm:px-8 text-base sm:text-lg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">The Story</label>
                    <Textarea 
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="What are we stitching today?" 
                      className="bg-white border-2 border-primary/5 min-h-[150px] sm:min-h-[180px] rounded-[2rem] sm:rounded-[2.5rem] focus:border-accent transition-all p-6 sm:p-8 text-base sm:text-lg leading-relaxed" 
                    />
                  </div>
                  <Button type="submit" className="w-full h-16 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.97] group">
                    Send Message <Send className="ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
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