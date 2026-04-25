"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/fable.and.forever/", label: "Instagram" },
    { Icon: Mail, href: "mailto:fableandforevercompany@gmail.com", label: "Email" },
  ];

  return (
    <footer id="footer" className="bg-[#111111] text-white py-24 sm:py-40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
          
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-6">
              <Logo className="w-12 h-12 text-white" />
              <h2 className="font-headline text-4xl">Fable & Forever</h2>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed font-medium text-lg italic">
              "Weaving the whispers of your imagination into hand-stitched treasures that carry heartbeat and history."
            </p>
            <div className="flex gap-6">
              {socialLinks.map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Menu</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-[0.2em]">
              <li><Link href="/#shop" className="text-white/40 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/#custom" className="text-white/40 hover:text-white transition-colors">Commissions</Link></li>
              <li><Link href="/#story" className="text-white/40 hover:text-white transition-colors">History</Link></li>
              <li><Link href="/#contact" className="text-white/40 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Studio</h4>
            <div className="flex items-start gap-4 text-white/40">
              <MapPin className="w-6 h-6 shrink-0 opacity-40" />
              <p className="text-sm font-medium leading-relaxed">
                Hand-Crocheted Boutique<br />
                Bespoke Artisanal Studio
              </p>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">
          <span>© 2024 Fable & Forever • সুতোয় বোনা প্রতিটি গল্প</span>
          <div className="flex gap-12">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Artisan Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}