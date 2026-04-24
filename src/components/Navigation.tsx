
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles } from 'lucide-react';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Shop 🛍️', href: '#shop' },
    { name: 'Our Story 📖', href: '#story' },
    { name: 'Contact 💌', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-6 left-0 right-0 z-50 transition-all duration-700 px-6",
    )}>
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between px-10 py-5 rounded-[2.5rem] transition-all duration-700",
        isScrolled 
          ? "bg-white/85 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/40 py-3 scale-[0.98]" 
          : "bg-white/50 backdrop-blur-md border border-white/20"
      )}>
        <Link href="/" className="flex items-center gap-4 hover:scale-105 transition-all group">
          <Logo className="w-10 h-10 text-primary" />
          <span className="font-headline text-xl md:text-2xl text-primary hidden sm:block">
            Fable and Forever
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-colors relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-accent/40 rounded-full transition-all group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
          <div className="pl-4 border-l border-primary/10">
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-5 md:hidden">
          <CartDrawer />
          <button 
            className="text-primary p-2 hover:bg-accent/20 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 flex flex-col space-y-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-white/30 animate-in fade-in zoom-in-95 duration-500">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-2xl font-headline text-primary hover:text-accent transition-all flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
              <Sparkles className="w-6 h-6 opacity-0 group-hover:opacity-100 text-accent transition-all" />
            </Link>
          ))}
          <div className="pt-8 border-t border-primary/10">
            <button className="w-full bg-primary text-white py-6 rounded-3xl font-bold text-xl shadow-xl shadow-primary/20">
              Visit Boutique ✨
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
