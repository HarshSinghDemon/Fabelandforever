
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
  buttonText = "Shop Now",
  link = "/#shop",
  imageHint = "luxury artisan",
  className
}: EditorialBannerProps) {
  return (
    <section className={cn("relative w-full h-[400px] sm:h-[600px] flex items-center justify-center overflow-hidden my-0", className)}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-4 reveal-on-scroll">
          {subtitle && (
            <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/70 block mb-2">
              {subtitle}
            </span>
          )}
          <h2 className="font-headline text-4xl sm:text-7xl leading-tight mb-8 drop-shadow-xl">
            {title}
          </h2>
          <Button asChild className="bg-white text-black hover:bg-white/90 px-10 h-12 rounded-none text-[9px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl">
            <Link href={link}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
