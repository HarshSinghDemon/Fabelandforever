"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { AdminProductManager } from '@/components/AdminProductManager';
import { AdminOrderManager } from '@/components/AdminOrderManager';
import { AdminSettingsManager } from '@/components/AdminSettingsManager';
import { Button } from '@/components/ui/button';
import { collection, orderBy, query } from 'firebase/firestore';
import { 
  LogOut, 
  Package, 
  History, 
  Loader2, 
  Sparkles,
  ChevronRight,
  BarChart3,
  Settings,
  Copy,
  CheckCircle2,
  Globe,
  Home
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { user, isUserLoading: loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');
  const [copied, setCopied] = useState(false);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products } = useCollection(productsQuery);
  const { data: orders } = useCollection(ordersQuery);

  const totalRevenue = orders?.reduce((acc, order: any) => acc + (Number(order.total) || 0), 0) || 0;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow get, list: if true;
      allow write: if isAdmin();
    }
    match /settings/{settingId} {
      allow get, list: if true;
      allow write: if isAdmin();
    }
    match /orders/{orderId} {
      allow create: if true;
      allow get: if isAdmin() || (request.auth != null && resource.data.userId == request.auth.uid);
      allow list, update, delete: if isAdmin();
    }
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email == "harshroop100@gmail.com" ||
        exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid))
      );
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse">Authenticating Artisan...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/rules`;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row selection:bg-accent/20">
      <aside className="w-full md:w-80 bg-white md:border-r border-primary/5 p-6 md:p-10 flex flex-col justify-between sticky top-0 h-auto md:h-screen z-50">
        <div className="space-y-12">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-headline text-xl text-primary leading-none">Studio</h2>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent">Master Portal</span>
            </div>
          </Link>

          <nav className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/30 ml-4 mb-2 block">Menu</label>
            {[
              { id: 'inventory', icon: Package, label: 'Treasures' },
              { id: 'orders', icon: History, label: 'Scrolls' },
              { id: 'settings', icon: Settings, label: 'Site Visuals' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.1em] transition-all",
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                    : "text-primary/50 hover:bg-paper hover:text-primary"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
          </nav>

          <div className="p-6 bg-paper rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-accent" />
              <h4 className="font-bold text-[9px] uppercase tracking-[0.2em] text-primary/60">Insights</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Revenue</span>
                <span className="font-bold text-primary text-xs">₹ {totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Stock</span>
                <span className="font-bold text-primary text-xs">{products?.length || 0} items</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/5 space-y-4 mt-12 md:mt-0">
          <Button 
            variant="ghost" 
            onClick={() => auth && signOut(auth)}
            className="w-full justify-start text-primary/50 hover:text-destructive hover:bg-destructive/5 rounded-2xl px-6 h-12"
          >
            <LogOut className="w-4 h-4 mr-3" /> Sign Out
          </Button>
          <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-primary/10">
            <Link href="/"><Home className="w-4 h-4 mr-3" /> Visit Boutique</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-16 pb-32">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-accent font-bold uppercase tracking-[0.4em] text-[9px]">Portal Active</span>
              </div>
              <h1 className="font-headline text-5xl md:text-6xl text-primary leading-tight">Master Weaver Control</h1>
            </div>
            <Button asChild className="rounded-full px-8 h-14 bg-primary text-white shadow-xl hover:scale-105 transition-transform">
              <a href={firebaseConsoleUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" /> Firestore Rules
              </a>
            </Button>
          </header>

          <Alert variant="destructive" className="rounded-3xl border-2 border-primary/5 bg-white p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
            <AlertTitle className="font-headline text-2xl text-primary mb-4 flex items-center gap-3">
              <Globe className="h-6 w-6 text-accent" /> Set Your Studio Live 🌍
            </AlertTitle>
            <AlertDescription className="space-y-6">
              <p className="text-sm font-medium text-primary/60 italic leading-relaxed">
                If the boutique looks empty to visitors, your "Magic Boundaries" (Firestore Rules) are closed. 
                Copy these rules and publish them in your Firebase Console to ensure your treasures are visible and your admin access is secure.
              </p>
              
              <div className="bg-slate-950 text-slate-50 p-6 rounded-2xl relative font-mono text-[10px] leading-relaxed shadow-inner border border-white/10">
                <pre className="overflow-x-auto no-scrollbar">{firestoreRules}</pre>
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={handleCopyRules}
                  className="absolute top-4 right-4 rounded-xl shadow-lg"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                  {copied ? "Copied" : "Copy Rules"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'inventory' && <AdminProductManager />}
            {activeTab === 'orders' && <AdminOrderManager />}
            {activeTab === 'settings' && <AdminSettingsManager />}
          </div>
        </div>
      </main>
    </div>
  );
}