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
  imageClassName?: string;
}

export function EditorialBanner({
  title,
  subtitle,
  imageUrl,
  buttonText = "Shop Collection",
  link = "/#shop",
  imageHint = "luxury artisan",
  className,
  imageClassName
}: EditorialBannerProps) {
  return (
    <section className={cn("relative w-full h-[160px] md:h-[220px] flex items-center justify-center overflow-hidden my-0", className)}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          quality={100}
          className={cn("object-cover transition-transform duration-[10s] hover:scale-105", imageClassName)}
          data-ai-hint={imageHint}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3 reveal-on-scroll">
          {subtitle && (
            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.5em] text-white/80 block mb-1">
              {subtitle}
            </span>
          )}
          <h2 className="font-headline text-2xl sm:text-4xl lg:text-5xl leading-tight mb-3 md:mb-5 drop-shadow-lg">
            {title}
          </h2>
          <Button asChild className="bg-white text-black hover:bg-white/90 px-6 sm:px-10 h-9 sm:h-11 rounded-full text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-lg">
            <Link href={link}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
