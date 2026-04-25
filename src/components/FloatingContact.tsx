"use client";

import React from 'react';
import { Instagram } from 'lucide-react';

export function FloatingContact() {
  return (
    <a 
      href="https://www.instagram.com/fable.and.forever/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[100] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90 animate-float"
      aria-label="Connect with us on Instagram"
    >
      <Instagram className="w-7 h-7" />
    </a>
  );
}
