"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer id="footer" className="bg-[#050505] text-white py-12 md:py-24 relative overflow-hidden border-t border-white/5">
      {/* Subtle Artisanal Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at:20%_20%,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24 mb-12 md:mb-20">
          
          <div className="lg:col-span-5 space-y-8 md:space-y-10 reveal-on-scroll">
            <div className="flex items-center gap-6 md:gap-8">
              <Logo className="w-10 h-10 md:w-14 md:h-14 text-white" />
              <div className="flex flex-col">
                <h2 className="font-headline text-2xl md:text-5xl uppercase tracking-tighter leading-none">Fable & Forever</h2>
                <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-accent mt-1">সুতোয় বোনা প্রতিটি গল্প</span>
              </div>
            </div>
            
            <p className="text-white/40 max-w-sm leading-relaxed font-medium text-xs md:text-base italic">
              "Weaving heritage into every loop. Our boutique is a sanctuary for slow stitching, based in the heart of Kolkata."
            </p>

            <div className="pt-4">
               <Link 
                href="https://www.instagram.com/fable.and.forever/" 
                target="_blank" 
                className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 md:px-10 py-4 md:py-6 rounded-[2.5rem] hover:bg-white/10 transition-all group shadow-2xl w-full md:w-auto justify-center md:justify-start"
               >
                  <div className="bg-gradient-to-tr from-accent to-accent/50 p-3 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-white">Order via DM</span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-accent animate-pulse mt-0.5">Start the Ritual</span>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-20 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 md:space-y-10 reveal-on-scroll stagger-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent">Navigation</h4>
            <ul className="space-y-4 md:space-y-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
              <li><Link href="/shop" className="text-white/40 hover:text-white transition-colors">Shop Catalog</Link></li>
              <li><Link href="/about" className="text-white/40 hover:text-white transition-colors">The Weaver's Story</Link></li>
              <li><Link href="/#contact" className="text-white/40 hover:text-white transition-colors">Manifest Vision</Link></li>
              <li><Link href="mailto:fableandforevercompany@gmail.com" className="text-white/40 hover:text-white transition-colors">Send Email</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-10 reveal-on-scroll stagger-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent">Studio Residence</h4>
            <div className="space-y-8 md:space-y-12">
              <div className="flex items-start gap-4 md:gap-6 group">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-base md:text-lg font-headline italic text-white/90">
                    Fable & Forever
                  </p>
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/40 leading-relaxed">
                    Kolkata, India
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest text-accent">
                      Exclusive City Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-6 border-t border-white/5">
                <Link href="https://www.instagram.com/fable.and.forever/" className="text-white/20 hover:text-white transition-all hover:scale-125">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="mailto:fableandforevercompany@gmail.com" className="text-white/20 hover:text-white transition-all hover:scale-125">
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-10 md:pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-[8px] md:text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center md:text-left">
          <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center md:justify-start">
            <span>© 2024 Fable & Forever Studio • Kolkata Heritage</span>
            <Link href="/admin" className="inline-flex items-center gap-2 hover:text-accent transition-all group">
              <Lock className="w-3 h-3 group-hover:rotate-12 transition-transform" /> Studio Control
            </Link>
          </div>
          <div className="flex gap-6 md:gap-12">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Scrolls</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Studio Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
