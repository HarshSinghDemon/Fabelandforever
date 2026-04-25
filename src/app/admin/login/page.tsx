
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { KeyRound, Mail, Info, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminLoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Configuration Missing",
        description: "Firebase is not initialized. Please check your environment variables.",
      });
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created ✨",
          description: "Welcome to the circle of weavers.",
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
      } else if (error.code === 'auth/invalid-credential') {
        message = "Incorrect email or password. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Access Denied",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md rounded-[2rem] border-2 shadow-2xl bg-white">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-headline text-xl">Loom Not Connected</AlertTitle>
          <AlertDescription className="mt-4 space-y-4">
            <p>The magic threads are disconnected. You need to add your Firebase configuration to the project environment variables.</p>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="bg-primary text-white text-center py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <Logo className="w-20 h-20 text-white" />
          </div>
          <CardTitle className="font-headline text-3xl relative z-10">
            {isRegistering ? "Register Master Weaver" : "Master Weaver Portal"}
          </CardTitle>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 relative z-10">
            {isRegistering ? "Create New Access" : "Restricted Access"}
          </p>
        </CardHeader>
        
        <CardContent className="p-10 pt-12 space-y-8 bg-white">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fable.com" 
                  className="pl-14 h-16 rounded-3xl border-2 border-primary/5 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Passkey</label>
              <div className="relative">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-14 h-16 rounded-3xl border-2 border-primary/5 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98"
            >
              {loading ? "Warping Threads..." : (isRegistering ? "Register ✨" : "Unlock Vault ✨")}
            </Button>
          </form>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <><LogIn className="w-3 h-3" /> Already have access? Log In</>
              ) : (
                <><UserPlus className="w-3 h-3" /> No access? Register as Weaver</>
              )}
            </button>
          </div>

          <div className="pt-8 border-t border-primary/5 flex items-start gap-4 text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 text-accent mt-0.5" />
            <p className="text-xs leading-relaxed font-medium italic">
              Use the Register option above to create your account if you haven't set one up in the <a href="https://console.firebase.google.com" target="_blank" className="text-accent underline decoration-accent/30 hover:text-accent/80 transition-colors">Firebase Console</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
