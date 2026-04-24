"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Lock } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/fable.and.forever/", label: "Instagram" },
    { Icon: Mail, href: "mailto:fableandforevercompany@gmail.com", label: "Email" },
  ];

  return (
    <footer id="footer" className="bg-primary text-primary-foreground py-16 sm:py-24 relative overflow-hidden">
      {/* Wave shape divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-8 sm:h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
          </svg>
      </div>

      <div className="container mx-auto px-6 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Logo className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              <div className="flex flex-col">
                <h2 className="font-headline text-3xl sm:text-5xl">Fable & Forever</h2>
                <span className="text-accent font-bold text-xs sm:text-sm tracking-widest mt-1 sm:mt-2 uppercase">সুতোয় বোনা প্রতিটি গল্প</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-sm mb-8 sm:mb-10 leading-relaxed font-medium text-base sm:text-lg italic mx-auto md:mx-0">
              "Weaving the whispers of your imagination into hand-stitched treasures that carry heartbeat and history. Every loop tells a story."
            </p>
            <div className="flex justify-center md:justify-start gap-4 sm:gap-5">
              {socialLinks.map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:text-accent-foreground transition-all shadow-lg backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <social.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] mb-6 sm:mb-10 text-accent">Navigation</h4>
            <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <li><Link href="/#shop" className="text-primary-foreground/60 hover:text-accent transition-colors">Collections</Link></li>
              <li><Link href="/#story" className="text-primary-foreground/60 hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link href="/#contact" className="text-primary-foreground/60 hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/admin/login" className="text-primary-foreground/20 hover:text-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                <Lock className="w-3 h-3" /> Weaver Portal
              </Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] mb-6 sm:mb-10 text-accent">The Studio</h4>
            <ul className="space-y-4 sm:space-y-6 text-xs sm:text-sm font-medium text-primary-foreground/70">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-2 sm:gap-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-accent" />
                <span>Handcrafted with Love<br className="hidden md:block" />Bespoke Crochet Studio</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-2 sm:gap-4">
                <span className="text-accent font-bold uppercase text-[8px] sm:text-[10px] tracking-widest">Status:</span>
                <span>Creating magic one loop at a time.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-[8px] sm:text-[10px] font-bold text-primary-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <span>Fable & Forever • সুতোয় বোনা গল্প</span>
          </div>
          <div className="flex gap-6 sm:gap-10">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy ✨</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
