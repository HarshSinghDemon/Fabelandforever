
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { AdminProductManager } from '@/components/AdminProductManager';
import { AdminOrderManager } from '@/components/AdminOrderManager';
import { AdminSettingsManager } from '@/components/AdminSettingsManager';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { 
  LogOut, 
  Package, 
  History, 
  Loader2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Settings,
  AlertCircle,
  Copy,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [copied, setCopied] = useState(false);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);

  const { data: products } = useCollection(productsQuery);
  const { data: orders } = useCollection(ordersQuery);

  const totalRevenue = orders?.reduce((acc, order: any) => acc + (Number(order.total) || 0), 0) || 0;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !db) return;
    
    const q = query(collection(db, 'products'), limit(1));
    const unsubscribe = onSnapshot(q, 
      () => setDbStatus('connected'),
      () => setDbStatus('error')
    );
    
    return () => unsubscribe();
  }, [db, user]);

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can see your treasures and site settings
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Only you can see and manage orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    // Only you can manage specific site configuration
    match /settings/{settingId} {
      allow write: if request.auth != null;
      allow read: if true;
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
    <div className="min-h-screen bg-paper pb-40 selection:bg-accent/20">
      <Navigation />
      
      <div className="pt-40 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="text-accent w-6 h-6 animate-pulse" />
              <span className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">The Inner Sanctum</span>
            </div>
            <h1 className="font-headline text-6xl md:text-7xl text-primary mb-4 leading-tight">Studio Control</h1>
            <p className="text-muted-foreground font-medium italic text-xl max-w-2xl">
              "Welcome back, Master Artisan. Ensure your 'Magic Boundaries' are open so the world can see your work."
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              asChild
              className="rounded-full px-8 h-14 border-accent/20 text-accent hover:bg-accent hover:text-white transition-all shadow-lg"
            >
              <a href={firebaseConsoleUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> Open Firestore Rules
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => auth && signOut(auth)}
              className="rounded-full px-8 h-14 border-primary/20 text-primary hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-lg active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* CRITICAL: Rules Warning */}
        <Alert variant="destructive" className="mb-10 rounded-[2rem] border-2 border-destructive bg-white p-8 shadow-2xl animate-in slide-in-from-top-4 duration-500 ring-4 ring-destructive/10">
          <Globe className="h-8 w-8 text-destructive mb-4" />
          <AlertTitle className="font-headline text-3xl mb-4">Make Your Site Global! 🌍</AlertTitle>
          <AlertDescription className="text-base space-y-6">
            <p className="font-medium text-lg">
              If visitors see an empty shop, it's because your <strong>Firestore Rules</strong> are set to private. 
              To fix this, you MUST copy the code below and publish it in your Firebase Console:
            </p>
            
            <div className="bg-slate-950 text-slate-50 p-6 rounded-2xl relative group border-2 border-white/10 shadow-inner">
              <pre className="text-xs overflow-x-auto font-mono leading-relaxed">
                {firestoreRules}
              </pre>
              <Button 
                size="sm"
                variant="secondary"
                onClick={handleCopyRules}
                className="absolute top-4 right-4 rounded-xl shadow-lg"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy These Rules"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 items-center">
              <Button asChild className="rounded-full h-16 px-10 bg-primary hover:bg-primary/90 text-lg shadow-xl">
                <a href={firebaseConsoleUrl} target="_blank" rel="noopener noreferrer">
                  1. Go to Firebase Rules Tab <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <div className="flex items-center text-sm font-bold text-muted-foreground uppercase tracking-widest bg-paper px-6 py-3 rounded-full border">
                2. Paste code & click "Publish"
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 ml-4">Navigation</label>
              {[
                { id: 'inventory', icon: Package, label: 'Inventory' },
                { id: 'orders', icon: History, label: 'Stitch Scrolls' },
                { id: 'settings', icon: Settings, label: 'Site Settings' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-10 py-6 rounded-[2.5rem] font-bold text-xs uppercase tracking-[0.2em] transition-all group ${
                    activeTab === item.id 
                      ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' 
                      : 'bg-white/60 text-primary/50 hover:bg-white hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-accent'}`} />
                    {item.label}
                  </div>
                  {activeTab === item.id ? <Sparkles className="w-4 h-4 animate-pulse" /> : <ChevronRight className="w-4 h-4 opacity-20" />}
                </button>
              ))}
            </div>

            <div className="p-10 bg-white/60 rounded-[3rem] border border-white/50 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-accent" />
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-primary/60">Studio Insights</h4>
              </div>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Revenue</span>
                  <span className="font-bold text-primary">₹ {totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Products</span>
                  <span className="font-bold text-primary">{products?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-[4.5rem] border border-white/50 shadow-inner">
              <div className="bg-transparent rounded-[4rem] overflow-hidden">
                {activeTab === 'inventory' && <AdminProductManager />}
                {activeTab === 'orders' && <AdminOrderManager />}
                {activeTab === 'settings' && <AdminSettingsManager />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
