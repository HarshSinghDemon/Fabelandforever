"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "w-12 h-12", showText = false }: LogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", showText ? "scale-100" : "")}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
      >
        {/* Outer decorative frame scrolls from provided image */}
        <path 
          d="M30 25 C15 25 10 40 10 50 C10 60 15 75 30 75 M70 25 C85 25 90 40 90 50 C90 60 85 75 70 75" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          strokeLinecap="round" 
        />
        <path 
          d="M35 22 Q 50 15 65 22 M35 78 Q 50 85 65 78" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          strokeDasharray="1 2" 
        />
        
        {/* Decorative leafy crest from provided image */}
        <path d="M50 8 C52 14 55 16 50 22 C45 16 48 14 50 8Z" fill="currentColor" />
        <path d="M44 11 C46 15 47 16 44 19 C41 16 42 15 44 11Z" fill="currentColor" opacity="0.7" />
        <path d="M56 11 C54 15 53 16 56 19 C59 16 58 15 56 11Z" fill="currentColor" opacity="0.7" />
        
        {/* Gift Box at bottom from provided image */}
        <g transform="translate(46, 75)">
          <rect x="0" y="0" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M0 4 H8 M4 0 V8" stroke="currentColor" strokeWidth="0.5" />
          <path d="M2 -2 Q 4 -5 6 -2" stroke="currentColor" strokeWidth="1" fill="none" />
        </g>

        {/* The f&f text calligraphy */}
        <text 
          x="50" 
          y="56" 
          textAnchor="middle" 
          className="font-fancy" 
          fill="currentColor" 
          style={{ fontSize: '22px', fontStyle: 'italic' }}
        >
          f&amp;f
        </text>
      </svg>
      {showText && (
        <span className="font-headline text-[10px] tracking-[0.4em] uppercase text-primary mt-1">
          Fable & Forever
        </span>
      )}
    </div>
  );
}
