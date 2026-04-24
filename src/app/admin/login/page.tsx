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
import { KeyRound, Mail } from 'lucide-react';

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
        description: "The looms do not recognize these credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="bg-primary text-white text-center py-12">
          <div className="flex justify-center mb-6">
            <Logo className="w-20 h-20 text-white" />
          </div>
          <CardTitle className="font-headline text-3xl">Master Weaver Portal</CardTitle>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">Restricted Access</p>
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
                  className="pl-14 h-16 rounded-3xl border-2 border-primary/5 focus:border-accent"
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
                  className="pl-14 h-16 rounded-3xl border-2 border-primary/5 focus:border-accent"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              {loading ? "Verifying..." : "Unlock Vault"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}