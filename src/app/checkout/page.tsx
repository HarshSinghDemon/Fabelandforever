
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ArrowLeft, 
  Copy, 
  Check,
  Instagram,
  Sparkles,
  Scroll,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  // Generate a simple order message
  const generateMessage = () => {
    const itemsList = cart.map(item => `- ${item.title} (x${item.quantity})`).join('\n');
    return `Hi Fable & Forever! ✨\n\nI'd like to order the following items:\n\n${itemsList}\n\nPlease let me know the next steps. Thanks! 🧶`;
  };

  const orderMessage = generateMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    toast({
      title: "Order Details Copied! ✨",
      description: "Paste this into our Instagram DMs.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-paper">
        <Navigation />
        <div className="pt-40 pb-24 container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-10">
            <Package className="w-16 h-16 text-primary/20" />
          </div>
          <h1 className="font-headline text-4xl text-primary mb-6">Your basket is light as air</h1>
          <Button asChild className="rounded-full px-10 h-16 bg-primary hover:bg-primary/90">
            <Link href="/shop">Return to Boutique</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      
      <div className="pt-32 md:pt-40 pb-24 container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-12 text-center">
          <Link href="/shop" className="inline-flex items-center text-primary/60 hover:text-primary transition-colors gap-2 font-black uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Back to Boutique
          </Link>
          <h1 className="font-headline text-5xl md:text-8xl text-primary mt-8 tracking-tighter">
            Order <span className="italic">Details.</span>
          </h1>
          <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] mt-4">Preparing your signature request</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Summary Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-primary/5 stitching-border">
              <h3 className="font-headline text-2xl text-primary mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" /> Your Selections
              </h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/5">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-primary text-xs truncate uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy/Action Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl border border-primary/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
               
               <div className="space-y-10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                       <MessageSquare className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-headline text-3xl text-primary">Place Your Order</h3>
                    <p className="text-sm text-primary/60 italic leading-relaxed max-w-md mx-auto">
                      "We've made it easy for you! Just copy the order details below and paste them into our Instagram DM to place your order."
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-2 bg-primary/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                    <div className="relative bg-paper p-8 rounded-[2.5rem] border border-primary/5 font-sans text-base md:text-lg text-primary leading-relaxed whitespace-pre-wrap shadow-inner min-h-[180px] font-medium italic">
                      {orderMessage}
                    </div>
                    
                    <button 
                      onClick={handleCopy}
                      className="absolute bottom-4 right-4 bg-white shadow-xl px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-primary/5 hover:scale-105 active:scale-95 transition-all text-primary"
                    >
                      {copied ? (
                        <>Copied! <Check className="w-4 h-4 text-emerald-500" /></>
                      ) : (
                        <>Copy Order <Copy className="w-4 h-4 text-accent" /></>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button 
                      asChild
                      className="w-full h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] group"
                    >
                      <Link href="https://www.instagram.com/fable.and.forever/" target="_blank" className="flex items-center justify-center gap-4">
                        DM us on Instagram <Instagram className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                      </Link>
                    </Button>
                    <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-primary/30">
                      We'll respond to your DM to finalize the payment and delivery.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
