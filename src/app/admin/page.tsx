
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDoc, doc } from 'firebase/firestore';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminProductManager } from '@/components/AdminProductManager';
import { AdminOrderManager } from '@/components/AdminOrderManager';
import { AdminSettingsManager } from '@/components/AdminSettingsManager';
import { Loader2, Lock } from 'lucide-react';

type AdminView = 'dashboard' | 'products' | 'orders' | 'settings';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isUserLoading) return;
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // Check if user is in the admin_users collection
    const checkAdmin = async () => {
      if (!db || !user) return;
      try {
        const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push('/');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user, isUserLoading, db, router]);

  if (isUserLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Verifying Master Weaver Status</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-12 text-center">
        <Lock className="w-16 h-16 text-destructive mb-6" />
        <h1 className="font-headline text-4xl text-primary mb-4">Sealed Grimoire</h1>
        <p className="text-muted-foreground italic mb-8 max-w-md">Your soul is not recognized as a Master Weaver. Access to the studio controls is forbidden.</p>
        <button onClick={() => router.push('/')} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent border-b border-primary/20 pb-1">Return to Boutique</button>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProductManager />;
      case 'orders': return <AdminOrderManager />;
      case 'settings': return <AdminSettingsManager />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] flex">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-primary/5 flex items-center justify-between px-12 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Master Weaver Workspace</h2>
            <p className="font-headline text-2xl text-primary capitalize">{activeView}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Active Weaver</p>
              <p className="text-xs font-bold text-primary">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/5 flex items-center justify-center text-primary font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 no-scrollbar bg-paper">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {renderView()}
          </div>
        </div>
      </div>
    </main>
  );
}
