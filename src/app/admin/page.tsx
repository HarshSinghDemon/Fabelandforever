
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { AdminProductManager } from '@/components/AdminProductManager';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Package, History, Settings, Loader2, Sparkles } from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse">Authenticating Weaver...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper pb-40 selection:bg-accent/20">
      <Navigation />
      
      <div className="pt-40 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="text-accent w-6 h-6 animate-pulse" />
              <span className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">The Inner Sanctum</span>
            </div>
            <h1 className="font-headline text-6xl md:text-7xl text-primary mb-4 leading-tight">Studio Control</h1>
            <p className="text-muted-foreground font-medium italic text-xl">
              "Welcome back, Master Weaver. The threads of fate await your command."
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut(auth)}
            className="rounded-full px-10 h-14 border-primary/20 text-primary hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-lg active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Menu - Magical Style */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up [animation-delay:200ms]">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true },
              { icon: Package, label: 'Inventory', active: false },
              { icon: History, label: 'Order Scrolls', active: false },
              { icon: Settings, label: 'Studio Settings', active: false },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center justify-between px-10 py-6 rounded-[2.5rem] font-bold text-xs uppercase tracking-[0.2em] transition-all group ${
                  item.active 
                    ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' 
                    : 'bg-white/60 text-primary/50 hover:bg-white hover:text-primary hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-5">
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-accent group-hover:text-primary'}`} />
                  {item.label}
                </div>
                {item.active && <Sparkles className="w-4 h-4 animate-pulse" />}
              </button>
            ))}
            
            <div className="p-10 bg-accent/5 rounded-[3rem] border border-dashed border-accent/20 mt-12">
               <h4 className="font-headline text-xl text-primary mb-4 italic">Studio Health</h4>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <span>Loom Status</span>
                    <span className="text-primary">Perfect</span>
                  </div>
                  <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-accent rounded-full animate-weave"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 animate-fade-in-up [animation-delay:400ms]">
            <AdminProductManager />
          </div>
        </div>
      </div>
    </div>
  );
}
