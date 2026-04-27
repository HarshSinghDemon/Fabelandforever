"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Shop', icon: ShoppingBag, href: '/shop' },
  ];

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-search-dialog'));
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-2xl border-t border-primary/10 px-6 py-2 pb-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] translate-y-0 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-500 relative py-1",
                isActive ? "text-accent scale-110" : "text-foreground/70"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-60"
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
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-accent transition-all active:scale-90 py-1"
        >
          <Search className="w-6 h-6 stroke-2" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Search</span>
        </button>
      </div>
    </nav>
  );
}