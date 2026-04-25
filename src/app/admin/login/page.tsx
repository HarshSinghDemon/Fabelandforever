
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from 'firebase/auth';
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Lock, Sparkles, Loader2, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const db = useFirestore();

  useEffect(() => {
    // Redirect if already logged in and verified
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
        const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
        if (adminDoc.exists()) {
          router.push('/admin');
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify admin role in Firestore
      if (db) {
        const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
        if (adminDoc.exists()) {
          toast({ title: "Welcome, Master Weaver", description: "Accessing the studio controls." });
          router.push('/admin');
        } else {
          // Not an admin
          await auth.signOut();
          toast({ variant: "destructive", title: "Forbidden", description: "Your soul is not recorded as a Master Weaver." });
        }
      }
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Access Denied", 
        description: error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
          ? "Invalid credentials for the Master Weaver."
          : "The grimoire remains sealed. Please check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24">
        <div className="w-full max-w-md bg-white rounded-[4rem] p-12 shadow-2xl border border-primary/5 stitching-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="text-center mb-10">
            <div className="inline-block p-6 bg-paper rounded-full mb-8 shadow-inner">
              <Logo className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-headline text-4xl text-primary mb-4">Studio Entry</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Master Weaver Consultation</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Weaver Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                <Input 
                  type="email"
                  placeholder="master@fableforever.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-paper border-none h-16 pl-14 pr-8 rounded-3xl font-bold text-sm focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                <Input 
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-paper border-none h-16 pl-14 pr-8 rounded-3xl font-bold tracking-widest text-lg focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-20 rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold text-lg uppercase tracking-[0.3em] shadow-xl group mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-4">
                  Unlock Studio <Sparkles className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-12 text-center text-[9px] text-primary/20 font-bold uppercase tracking-widest">
            Authorized Personnel Only • Fable & Forever Studio
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
