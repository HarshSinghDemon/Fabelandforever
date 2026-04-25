"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Lock, Sparkles, Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple gatekeeper for demo purposes
    // In production, this would use Firebase Auth
    if (password === 'fableforever2024') {
      toast({ title: "Welcome, Master Weaver", description: "Accessing the studio controls." });
      router.push('/admin');
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "The grimoire remains sealed." });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[4rem] p-12 shadow-2xl border border-primary/5 stitching-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="text-center mb-10">
            <div className="inline-block p-6 bg-paper rounded-full mb-8 shadow-inner">
              <Logo className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-headline text-4xl text-primary mb-4">Studio Entry</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Master Weaver Consultation</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
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
              className="w-full h-20 rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold text-lg uppercase tracking-[0.3em] shadow-xl group"
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