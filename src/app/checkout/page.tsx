
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, Package, Truck, Heart, ArrowLeft, Send, Mail, Instagram, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const getOrderSummaryText = () => {
    const itemsList = cart.map(item => `- ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    return (
      `NEW ORDER INQUIRY\n` +
      `-----------------\n` +
      `Customer: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n\n` +
      `ITEMS:\n` +
      `${itemsList}\n\n` +
      `TOTAL: ₹${cartTotal.toLocaleString('en-IN')}`
    );
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.address) {
      setStep(2);
    }
  };

  const handleEmailFinish = () => {
    const recipient = "fableandforevercompany@gmail.com";
    const subject = encodeURIComponent(`Order Inquiry: ${formData.name}`);
    const body = encodeURIComponent(getOrderSummaryText());
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleInstagramFinish = async () => {
    try {
      await navigator.clipboard.writeText(getOrderSummaryText());
      toast({
        title: "Details Copied! ✨",
        description: "Your order info is on your clipboard. Just paste it in our DM!",
      });
      setTimeout(() => {
        window.open('https://www.instagram.com/fable.and.forever/', '_blank');
      }, 1000);
    } catch (err) {
      window.open('https://www.instagram.com/fable.and.forever/', '_blank');
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-paper">
        <Navigation />
        <div className="pt-40 pb-24 container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-8">
            <ShoppingBag className="w-12 h-12 text-primary/40" />
          </div>
          <h1 className="font-headline text-5xl text-primary mb-6">Your Basket is Airy...</h1>
          <p className="text-muted-foreground italic mb-10 max-w-md">
            "It seems you haven't chosen any treasures to bring home yet. Let's find something magical."
          </p>
          <Button asChild className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90">
            <Link href="/#shop">Explore Collections</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      
      <div className="pt-40 pb-24 container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <button 
            onClick={() => step === 1 ? undefined : setStep(1)} 
            className="inline-flex items-center text-primary/60 hover:text-primary transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            {step === 1 ? (
              <Link href="/" className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Boutique</Link>
            ) : (
              <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Edit Details</span>
            )}
          </button>
          <h1 className="font-headline text-5xl md:text-7xl text-primary mt-6">
            {step === 1 ? "Order Details" : "Complete Adoption"}
          </h1>
          <p className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mt-4">
            {step === 1 ? "Finalizing Your Forever Loop" : "Choose your preferred platform"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-accent/5 stitching-border overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              
              <h3 className="font-headline text-2xl text-primary mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" /> Selected Treasures
              </h3>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-accent/10">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-sm leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-dashed border-primary/10">
                <div className="flex justify-between items-center text-xl font-bold text-primary">
                  <span>Total Magic</span>
                  <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Step or Platform Choice Step */}
          <div className="lg:col-span-7">
            {step === 1 ? (
              <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                <div className="mb-10 text-center md:text-left">
                  <h3 className="font-headline text-3xl text-primary mb-3">Customer Information</h3>
                  <p className="text-muted-foreground font-medium italic">"Tell us where these treasures should travel."</p>
                </div>

                <form onSubmit={handleNext} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Full Name</label>
                      <Input 
                        required
                        placeholder="Your lovely name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-paper border-2 border-primary/5 h-16 rounded-3xl focus:border-accent transition-all px-8 text-lg" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Phone Number</label>
                      <Input 
                        required
                        type="tel"
                        placeholder="For delivery updates" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-paper border-2 border-primary/5 h-16 rounded-3xl focus:border-accent transition-all px-8 text-lg" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Delivery Address</label>
                    <Textarea 
                      required
                      placeholder="Where should we send your package?" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-paper border-2 border-primary/5 min-h-[150px] rounded-[2.5rem] focus:border-accent transition-all p-8 text-lg leading-relaxed" 
                    />
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-lg uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-97 group"
                    >
                      Continue to Finalize <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                
                <div className="mb-12 text-center md:text-left">
                  <h3 className="font-headline text-3xl text-primary mb-3">How should we connect?</h3>
                  <p className="text-muted-foreground font-medium italic">"Pick your preferred way to send us the order details."</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <button 
                    onClick={handleEmailFinish}
                    className="flex items-center gap-6 p-8 bg-paper rounded-[2.5rem] border-2 border-primary/5 hover:border-primary/20 hover:bg-white transition-all group text-left"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-xl">Continue with Email</h4>
                      <p className="text-sm text-muted-foreground font-medium">Opens your mail app with pre-filled details.</p>
                    </div>
                  </button>

                  <button 
                    onClick={handleInstagramFinish}
                    className="flex items-center gap-6 p-8 bg-paper rounded-[2.5rem] border-2 border-primary/5 hover:border-accent/20 hover:bg-white transition-all group text-left"
                  >
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Instagram className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-xl">Continue with Instagram</h4>
                      <p className="text-sm text-muted-foreground font-medium">Copies details & opens our Instagram DM.</p>
                    </div>
                  </button>
                </div>

                <div className="mt-12 p-8 bg-accent/5 rounded-[2rem] border border-dashed border-accent/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
                      "After you send the details, we'll confirm stock availability and send payment instructions to finalize your treasures."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
