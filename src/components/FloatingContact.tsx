"use client";

import React from 'react';
import { Instagram } from 'lucide-react';

export function FloatingContact() {
  return (
    <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[100] flex flex-col items-end gap-4">
      <a 
        href="https://www.instagram.com/fable.and.forever/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 md:gap-4 bg-white/95 backdrop-blur-2xl p-2 pr-5 md:p-3 md:pr-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-primary/10 hover:scale-110 transition-all active:scale-95 animate-float"
        aria-label="Order via DM on Instagram"
      >
        <div className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-2 md:p-4 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
          <Instagram className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-accent leading-none mb-1 md:mb-1.5 animate-pulse">Ritual</span>
          <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-primary">Order via DM</span>
        </div>
        
        {/* Animated notification glow */}
        <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full border-2 border-white shadow-sm"></span>
      </a>
    </div>
  );
}
