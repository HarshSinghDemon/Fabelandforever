"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Mobile-only bottom navigation bar for easy access to core studio rituals.
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-t border-primary/5 px-6 py-4 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] translate-y-0 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-accent scale-110" : "text-primary/30 hover:text-primary/60"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.name}</span>
            </Link>
          );
        })}
        
        <button 
          onClick={handleSearchClick}
          className="flex flex-col items-center gap-1.5 text-primary/30 hover:text-primary/60 transition-all active:scale-90"
        >
          <Search className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Search</span>
        </button>
      </div>
    </nav>
  );
}
