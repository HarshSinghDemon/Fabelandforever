
"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-headline text-3xl mb-6">The Crochet Studio</h2>
            <p className="text-primary-foreground/70 max-w-sm mb-8 leading-relaxed">
              Preserving the art of handcrafting in a digital world. Every stitch tells a story of patience, quality, and timeless design.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#shop" className="hover:text-secondary transition-colors">Collections</Link></li>
              <li><Link href="#custom" className="hover:text-secondary transition-colors">Custom Orders</Link></li>
              <li><Link href="#story" className="hover:text-secondary transition-colors">Our Process</Link></li>
              <li><Link href="#contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">The Studio</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>123 Artisan Way,<br />Portland, OR 97201</span>
              </li>
              <li>Mon - Fri: 9am - 5pm</li>
              <li>Sat: 10am - 4pm</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:row items-center justify-between gap-4 text-xs text-white/40 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} The Crochet Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
