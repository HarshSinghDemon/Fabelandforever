"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { KeyRound, Mail, Info, UserPlus, LogIn, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminLoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Magic Disconnected",
        description: "Firebase is not initialized. Please check your project environment.",
      });
      return;
    }

    setIsBusy(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Access Woven ✨",
          description: "Welcome to the circle of master weavers.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome Back, Weaver ✨",
          description: "Opening the master grimoire...",
        });
      }
      router.push('/admin');
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "The looms do not recognize these credentials.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already woven into our scrolls. Try logging in.";
      } else if (error.code === 'auth/weak-password') {
        message = "That password is too frail. Make it stronger.";
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "Incorrect email or password. Please try again.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email/Password auth is not enabled in your Firebase Console.";
      }

      toast({
        variant: "destructive",
        title: "Vault Locked 🔒",
        description: message,
      });
    } finally {
      setIsBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md rounded-[3rem] border-2 shadow-2xl bg-white p-8">
          <AlertCircle className="h-6 w-6 text-accent mb-4" />
          <AlertTitle className="font-headline text-2xl text-primary">Loom Not Connected</AlertTitle>
          <AlertDescription className="mt-4 space-y-6">
            <p className="text-sm font-medium italic text-primary/60">
              The magic threads are disconnected. You need to ensure your Firebase configuration is correctly added to your project's environment variables.
            </p>
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-primary/10 hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]" 
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      
      <Card className="w-full max-w-md border-none shadow-[0_50px_100px_-20px_rgba(45,115,107,0.15)] rounded-[4rem] overflow-hidden relative z-10 bg-white">
        <CardHeader className="bg-primary text-white text-center py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex justify-center mb-8 relative z-10 group">
            <div className="p-5 bg-white/10 rounded-[2rem] backdrop-blur-sm group-hover:scale-110 transition-transform duration-700">
              <Logo className="w-16 h-16 text-white" />
            </div>
          </div>
          <CardTitle className="font-headline text-4xl relative z-10 tracking-tight">
            {isRegistering ? "Register Artisan" : "Master Weaver"}
          </CardTitle>
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.5em] mt-3 relative z-10">
            {isRegistering ? "Create Master Access" : "The Inner Circle"}
          </p>
        </CardHeader>
        
        <CardContent className="p-10 md:p-14 space-y-10">
          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 ml-4">Email Scroll</label>
              <div className="relative group">
                <Mail className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="weaver@fable.com" 
                  className="pl-16 h-16 rounded-[2rem] border-2 border-primary/5 bg-paper/30 focus:border-accent focus:bg-white transition-all text-primary font-medium"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 ml-4">Access Key</label>
              <div className="relative group">
                <KeyRound className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-16 h-16 rounded-[2rem] border-2 border-primary/5 bg-paper/30 focus:border-accent focus:bg-white transition-all text-primary font-medium"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isBusy}
              className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {isBusy ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  {isRegistering ? "Grant Access ✨" : "Unlock Vault ✨"}
                </div>
              )}
            </Button>
          </form>

          <div className="flex flex-col gap-6 pt-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent hover:opacity-70 transition-opacity flex items-center justify-center gap-3 group"
            >
              {isRegistering ? (
                <><LogIn className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Already recognized? Log In</>
              ) : (
                <><UserPlus className="w-3 h-3 group-hover:scale-125 transition-transform" /> New Weaver? Request Access</>
              )}
            </button>
          </div>

          <div className="pt-10 border-t border-primary/5 flex items-start gap-5 text-primary/40">
            <div className="p-3 bg-paper rounded-2xl shrink-0">
              <Info className="w-4 h-4 text-accent" />
            </div>
            <p className="text-[10px] leading-relaxed font-medium italic">
              Access is restricted to authorized artisans. If this is your first time, use the "Request Access" option. Ensure Email Auth is enabled in your <a href="https://console.firebase.google.com" target="_blank" className="text-accent underline decoration-accent/20 hover:text-accent transition-colors">Firebase Console</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
