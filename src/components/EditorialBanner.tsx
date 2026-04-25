"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EditorialBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  link?: string;
  imageHint?: string;
  className?: string;
}

export function EditorialBanner({
  title,
  subtitle,
  imageUrl,
  buttonText = "Shop Collection",
  link = "/#shop",
  imageHint = "luxury artisan",
  className
}: EditorialBannerProps) {
  return (
    <section className={cn("relative w-full h-[160px] sm:h-[220px] flex items-center justify-center overflow-hidden my-0", className)}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 reveal-on-scroll">
          {subtitle && (
            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.5em] text-white/80 block">
              {subtitle}
            </span>
          )}
          <h2 className="font-headline text-2xl sm:text-4xl leading-tight mb-2 sm:mb-4 drop-shadow-lg">
            {title}
          </h2>
          <Button asChild className="bg-white text-black hover:bg-white/90 px-6 sm:px-8 h-8 sm:h-10 rounded-full text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-lg">
            <Link href={link}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
