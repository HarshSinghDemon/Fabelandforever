"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Lock } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer id="footer" className="bg-[#050505] text-white py-10 md:py-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle Artisanal Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-white" />
              <div className="flex flex-col">
                <span className="font-headline text-xl text-white tracking-tighter leading-none">
                   <span className="text-[#FBBF24] text-[1.3em] inline-block leading-none">F</span>able & <span className="text-[#FBBF24] text-[1.3em] inline-block leading-none">F</span>orever
                </span>
                <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-accent mt-1">সুতোয় বোনা প্রতিটি গল্প</span>
              </div>
            </Link>
            <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>
            <p className="hidden md:block text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 max-w-[200px]">
              Artisanal Crochet Studio • Kolkata Heritage
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
            {['Shop', 'Story', 'Connect'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Shop' ? '/shop' : item === 'Story' ? '/about' : '/#contact'}
                className="text-[9px] font-black uppercase tracking-[0.5em] text-white/60 hover:text-white transition-all"
              >
                {item}
              </Link>
            ))}
            <Link 
              href="https://www.instagram.com/fable.and.forever/" 
              target="_blank"
              className="text-[9px] font-black uppercase tracking-[0.5em] text-accent hover:text-white transition-all flex items-center gap-2"
            >
              Order via DM <Instagram className="w-3 h-3" />
            </Link>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-6 text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">
              <span>© 2024 F&F Studio • All Rights Reserved</span>
              <Link href="/admin" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Lock className="w-2.5 h-2.5" /> Studio Control
              </Link>
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/40">
              Site Developed by Harsh Singh
            </p>
          </div>
          <div className="flex gap-6 text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}