"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer id="footer" className="bg-[#0a0a0a] text-white py-40 sm:py-60">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-40">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="flex items-center gap-8">
              <Logo className="w-12 h-12 text-white" />
              <h2 className="font-headline text-4xl uppercase tracking-tighter">Fable & Forever</h2>
            </div>
            <p className="text-white/30 max-w-sm leading-relaxed font-bold text-sm uppercase tracking-widest italic">
              "Weaving history into every loop. Slow-made for those who value the touch of the hand."
            </p>
            <div className="flex gap-10">
              <Link href="https://www.instagram.com/fable.and.forever/" className="text-white/40 hover:text-white transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="mailto:fableandforevercompany@gmail.com" className="text-white/40 hover:text-white transition-all hover:scale-110">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-accent">Menu</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.3em]">
              <li><Link href="/#shop" className="text-white/30 hover:text-white transition-colors">Collection</Link></li>
              <li><Link href="/about" className="text-white/30 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/#contact" className="text-white/30 hover:text-white transition-colors">Connect</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-accent">Studio</h4>
            <div className="flex items-start gap-6 text-white/30">
              <MapPin className="w-5 h-5 shrink-0 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest leading-loose">
                Bespoke Artisanal Studio<br />
                Hand-Stitched in Kolkata
              </p>
            </div>
          </div>

        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 text-[9px] font-bold text-white/10 uppercase tracking-[0.6em]">
          <span>© 2024 Fable & Forever • সুতোয় বোনা প্রতিটি গল্প</span>
          <div className="flex gap-12">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}