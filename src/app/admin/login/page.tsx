
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { KeyRound, Mail, Info } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome Back, Weaver ✨",
        description: "Opening the master grimoire...",
      });
      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "The looms do not recognize these credentials. Ensure you have added your user in the Firebase Console.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="bg-primary text-white text-center py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <Logo className="w-20 h-20 text-white" />
          </div>
          <CardTitle className="font-headline text-3xl relative z-10">Master Weaver Portal</CardTitle>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 relative z-10">Restricted Access</p>
        </CardHeader>
        
        <CardContent className="p-10 pt-12 space-y-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Unlock Vault ✨"}
            </Button>
          </form>

          <div className="pt-8 border-t border-primary/5 flex items-start gap-4 text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 text-accent mt-0.5" />
            <p className="text-xs leading-relaxed font-medium italic">
              Don't have a login? Create your account in the <a href="https://console.firebase.google.com" target="_blank" className="text-accent underline decoration-accent/30 hover:text-accent/80 transition-colors">Firebase Console</a> under Authentication to grant yourself access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
