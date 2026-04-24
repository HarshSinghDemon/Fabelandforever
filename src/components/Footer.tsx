"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-primary/10 text-foreground py-24 relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-white rounded-b-[3rem]"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="font-fancy text-4xl text-primary mb-6">Cloudy Crochet ☁️</h2>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed font-medium">
              We make the world a little softer, one stitch at a time. Join our fluffy community and stay sweet!
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-full bg-white border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-primary">Lovely Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="#shop" className="text-muted-foreground hover:text-primary transition-colors">Treat Yourself</Link></li>
              <li><Link href="#custom" className="text-muted-foreground hover:text-primary transition-colors">Custom Magic</Link></li>
              <li><Link href="#story" className="text-muted-foreground hover:text-primary transition-colors">The Maker</Link></li>
              <li><Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Say Hi!</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-primary">The Studio</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                <span>123 Pastel Lane,<br />Dreamy Valley, OR 97201</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">Hours:</span>
                <span>Whenever we're not napping! (9am - 4pm)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
          <p className="flex items-center gap-2">Made with <Heart className="fill-primary text-primary w-4 h-4" /> & Yarn</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Privacy ✨</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms 🎀</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}