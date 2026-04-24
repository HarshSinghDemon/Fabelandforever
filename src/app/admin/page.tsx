
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { AdminProductManager } from '@/components/AdminProductManager';
import { AdminOrderManager } from '@/components/AdminOrderManager';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Package, 
  History, 
  Settings, 
  Loader2, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');

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
            <p className="text-muted-foreground font-medium italic text-xl max-w-2xl">
              "Welcome back, Master Weaver. The threads of your boutique await your command."
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              asChild
              className="rounded-full px-8 h-14 border-accent/20 text-accent hover:bg-accent hover:text-white transition-all shadow-lg"
            >
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> Firebase Console
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => signOut(auth)}
              className="rounded-full px-8 h-14 border-primary/20 text-primary hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-lg active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1 space-y-4 animate-fade-in-up [animation-delay:200ms]">
            {[
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'orders', icon: History, label: 'Order Scrolls' },
              { id: 'settings', icon: Settings, label: 'Studio Settings' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-10 py-6 rounded-[2.5rem] font-bold text-xs uppercase tracking-[0.2em] transition-all group ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' 
                    : 'bg-white/60 text-primary/50 hover:bg-white hover:text-primary hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-5">
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-accent group-hover:text-primary'}`} />
                  {item.label}
                </div>
                {activeTab === item.id ? <Sparkles className="w-4 h-4 animate-pulse" /> : <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
            
            <div className="p-10 bg-accent/5 rounded-[3rem] border border-dashed border-accent/20 mt-12 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <h4 className="font-headline text-xl text-primary mb-4 italic relative z-10">Backend Blueprint</h4>
               <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold mb-4 relative z-10">
                 Config: docs/backend.json
               </p>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <span>Database Status</span>
                    <span className="text-primary">Connected</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div className="h-full w-full bg-accent rounded-full animate-weave shadow-[0_0_10px_rgba(265,50,70,0.5)]"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-[4.5rem] border border-white/50 shadow-inner">
              <div className="bg-transparent rounded-[4rem] overflow-hidden">
                {activeTab === 'inventory' && <AdminProductManager />}
                {activeTab === 'orders' && <AdminOrderManager />}
                {activeTab === 'settings' && (
                  <div className="bg-white p-20 rounded-[4rem] shadow-xl text-center stitching-border m-8">
                    <Settings className="w-20 h-20 text-accent mx-auto mb-8 animate-[spin_10s_linear_infinite]" />
                    <h3 className="font-headline text-4xl text-primary mb-6">Studio Configuration</h3>
                    <p className="text-muted-foreground italic text-lg max-w-md mx-auto leading-relaxed">
                      To manage advanced settings like Security Rules or Authentication providers, please use the 
                      <a href="https://console.firebase.google.com" target="_blank" className="text-accent underline ml-1 hover:text-primary transition-colors">Firebase Console</a>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
