"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { AdminProductManager } from '@/components/AdminProductManager';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Package, History, Settings, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper pb-20">
      <Navigation />
      
      <div className="pt-40 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="font-headline text-5xl text-primary mb-4">Studio Control</h1>
            <p className="text-muted-foreground font-medium italic">Welcome back, Master Weaver. What shall we create today?</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut(auth)}
            className="rounded-full px-8 h-12 border-primary/20 text-primary hover:bg-destructive hover:text-white hover:border-destructive transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1 space-y-4">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true },
              { icon: Package, label: 'Inventory', active: false },
              { icon: History, label: 'Order Scrolls', active: false },
              { icon: Settings, label: 'Studio Settings', active: false },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest transition-all ${
                  item.active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/50 text-primary/60 hover:bg-white hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AdminProductManager />
          </div>
        </div>
      </div>
    </div>
  );
}