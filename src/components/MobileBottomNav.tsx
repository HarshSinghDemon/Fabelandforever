
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Slimmer, mobile-only bottom navigation bar for easy access to core studio rituals.
 * Meticulously slimmed for a sophisticated, app-like profile with larger, highlighted icons.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Shop', icon: ShoppingBag, href: '/shop' },
  ];

  const handleSearchClick = () => {
    // Dispatch a custom event to open the search dialog in the main Navigation component
    window.dispatchEvent(new CustomEvent('open-search-dialog'));
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-primary/5 px-6 py-2 pb-5 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] translate-y-0 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-500 relative py-1",
                isActive ? "text-accent scale-110" : "text-primary/30"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.2em] transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-40"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full animate-in zoom-in duration-500"></div>
              )}
            </Link>
          );
        })}
        
        <button 
          onClick={handleSearchClick}
          className="flex flex-col items-center gap-1 text-primary/30 hover:text-accent transition-all active:scale-90 py-1"
        >
          <Search className="w-5 h-5 stroke-2" />
          <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40">Search</span>
        </button>
      </div>
    </nav>
  );
}
