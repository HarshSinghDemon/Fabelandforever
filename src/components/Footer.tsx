"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, MapPin, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
      {/* Wave shape divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
      </div>

      <div className="container mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <h2 className="font-headline text-5xl mb-8">Fable & Forever</h2>
            <p className="text-primary-foreground/70 max-w-sm mb-10 leading-relaxed font-medium text-lg italic">
              "Every loop holds a memory, and every stitch tells a story that lasts forever."
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-accent-foreground transition-all shadow-lg backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-10 text-accent">Archive Index</h4>
            <ul className="space-y-5 text-sm font-bold uppercase tracking-widest">
              <li><Link href="#shop" className="text-primary-foreground/60 hover:text-accent transition-colors">The Boutique</Link></li>
              <li><Link href="#custom" className="text-primary-foreground/60 hover:text-accent transition-colors">Custom Heirlooms</Link></li>
              <li><Link href="#story" className="text-primary-foreground/60 hover:text-accent transition-colors">The Artisan</Link></li>
              <li><Link href="#contact" className="text-primary-foreground/60 hover:text-accent transition-colors">Write to Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-10 text-accent">The Atelier</h4>
            <ul className="space-y-6 text-sm font-medium text-primary-foreground/70">
              <li className="flex gap-4">
                <MapPin className="w-6 h-6 shrink-0 text-accent" />
                <span>888 Weaver's Way,<br />Mystic Hollow, OR 97201</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-bold uppercase text-[10px] tracking-widest mt-1">Hours:</span>
                <span>By appointment & moon-rise (10am - 5pm)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-bold text-primary-foreground/40 uppercase tracking-[0.4em]">
          <p className="flex items-center gap-3">Curated with <Sparkles className="text-accent fill-accent w-4 h-4" /> & Golden Thread</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Scrolls ✨</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Forever 📜</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
