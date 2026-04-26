
"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Lock, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer id="footer" className="bg-[#050505] text-white py-12 md:py-16 relative overflow-hidden border-t border-white/10">
      {/* Subtle Artisanal Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12">
          
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            <div className="flex items-center gap-4 md:gap-6">
              <Logo className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <div className="flex flex-col">
                <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tighter leading-none text-white">Fable & Forever</h2>
                <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-accent mt-1">সুতোয় বোনা প্রতিটি গল্প</span>
              </div>
            </div>
            
            <p className="text-white/70 max-w-sm leading-relaxed font-medium text-xs md:text-sm italic">
              "Weaving heritage into every loop. Our boutique is a sanctuary for slow stitching, based in the heart of Kolkata."
            </p>

            <div className="pt-2">
               <Link 
                href="https://www.instagram.com/fable.and.forever/" 
                target="_blank" 
                className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 transition-all group shadow-2xl w-full md:w-auto justify-center md:justify-start"
               >
                  <div className="bg-gradient-to-tr from-accent to-accent/50 p-2 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white">Order via DM</span>
                    <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-accent animate-pulse">Start the Ritual</span>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-20 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 reveal-on-scroll stagger-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent">Navigation</h4>
            <ul className="space-y-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
              <li><Link href="/shop" className="text-white/70 hover:text-white transition-colors">Shop Catalog</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">The Weaver's Story</Link></li>
              <li><Link href="/#contact" className="text-white/70 hover:text-white transition-colors">Manifest Vision</Link></li>
              <li><Link href="mailto:fableandforevercompany@gmail.com" className="text-white/70 hover:text-white transition-colors">Send Email</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6 reveal-on-scroll stagger-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent">Studio Residence</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="w-4 h-4 text-accent animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-headline italic text-white/90">Fable & Forever</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Kolkata, India</p>
                  <div className="pt-1">
                    <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[7px] font-black uppercase tracking-widest text-accent">
                      Exclusive City Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[8px] md:text-[9px] font-bold text-white/40 uppercase tracking-[0.4em] md:tracking-[0.6em] text-center md:text-left">
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
            <span className="text-white/40">© 2024 Fable & Forever Studio • Kolkata Heritage</span>
            <Link href="/admin" className="inline-flex items-center gap-2 hover:text-accent transition-all group text-white/40">
              <Lock className="w-3 h-3 group-hover:rotate-12 transition-transform" /> Studio Control
            </Link>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy Scrolls</Link>
            <Link href="/terms" className="text-white/40 hover:text-white transition-colors">Studio Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
