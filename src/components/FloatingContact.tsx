
"use client";

import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

export function FloatingContact() {
  return (
    <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[100] flex flex-col items-end gap-4">
      <a 
        href="https://www.instagram.com/fable.and.forever/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 bg-white/90 backdrop-blur-xl p-2 pr-6 rounded-full shadow-2xl border border-primary/5 hover:scale-105 transition-all active:scale-95 animate-float"
        aria-label="Connect with us on Instagram"
      >
        <div className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-3 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
          <Instagram className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 leading-none mb-1">Ritual</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">DM Us</span>
        </div>
        
        {/* Animated notification dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse"></span>
      </a>
    </div>
  );
}
