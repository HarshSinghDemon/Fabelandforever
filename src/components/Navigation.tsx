"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles } from 'lucide-react';
import { CartDrawer } from './CartDrawer';

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
    { name: 'The Shop 🎁', href: '#shop' },
    { name: 'Custom Tales ✨', href: '#custom' },
    { name: 'Our Story 📖', href: '#story' },
    { name: 'Contact 👋', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-4 left-0 right-0 z-50 transition-all duration-500 px-6",
    )}>
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-xl border border-white/20 py-3" 
          : "bg-white/40 backdrop-blur-sm border border-white/10"
      )}>
        <Link href="/" className="font-fancy text-3xl text-primary flex items-center gap-2 hover:scale-105 transition-transform">
          Cloudy <Sparkles className="text-accent fill-accent w-5 h-5 animate-pulse" /> Tale
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest text-primary/70 hover:text-accent transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <CartDrawer />
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <CartDrawer />
          <button 
            className="text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col space-y-6 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-2xl font-fancy text-primary hover:text-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}