
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Scroll, 
  Settings, 
  LogOut, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminView = 'dashboard' | 'products' | 'orders' | 'settings';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/admin/login');
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Boutique', icon: ShoppingBag },
    { id: 'orders', label: 'Scrolls', icon: Scroll },
    { id: 'settings', label: 'Curation', icon: Settings },
  ];

  return (
    <aside className="w-80 h-screen bg-primary flex flex-col shrink-0 relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#fff_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className="p-12 relative z-10 flex flex-col h-full">
        {/* Branding */}
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/5">
            <Logo className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-headline text-2xl text-white tracking-tighter">Studio Control</h1>
          <span className="text-[8px] font-bold uppercase tracking-[0.6em] text-white/30 mt-2">Kolkata Heritage</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AdminView)}
              className={cn(
                "w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all duration-500 group relative",
                activeView === item.id 
                  ? "bg-white text-primary shadow-2xl" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                activeView === item.id ? "text-accent" : ""
              )} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{item.label}</span>
              {activeView === item.id && (
                <div className="absolute right-6 w-1.5 h-1.5 bg-accent rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="pt-8 mt-8 border-t border-white/5 space-y-3">
          <Link 
            href="/" 
            target="_blank"
            className="w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Live Site</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] text-white/40 hover:text-destructive transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Seal Workspace</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/10">Version 2.5.0 • F&F Studio</p>
        </div>
      </div>
    </aside>
  );
}
