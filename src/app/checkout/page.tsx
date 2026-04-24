
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, Package, Truck, Heart, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipient = "fableandforevercompany@gmail.com";
    const subject = encodeURIComponent(`New Order Inquiry: ${formData.name}`);
    
    const itemsList = cart.map(item => `- ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    
    const body = encodeURIComponent(
      `ORDER DETAILS\n` +
      `-------------\n` +
      `Customer Name: ${formData.name}\n` +
      `Phone Number: ${formData.phone}\n` +
      `Delivery Address: ${formData.address}\n\n` +
      `ITEMS TO ADOPT:\n` +
      `${itemsList}\n\n` +
      `TOTAL MAGIC: ₹${cartTotal.toLocaleString('en-IN')}\n\n` +
      `Message from Customer: Please finalize my order for these hand-stitched treasures.`
    );

    // Open mail client
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, '_blank');
    
    // Optional: clear cart and redirect after a delay
    // clearCart();
    // router.push('/');
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
          <Link href="/" className="inline-flex items-center text-primary/60 hover:text-primary transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Back to Boutique
          </Link>
          <h1 className="font-headline text-5xl md:text-7xl text-primary mt-6">Order Details</h1>
          <p className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Finalizing Your Forever Loop</p>
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
                <div className="mt-6 p-4 bg-paper rounded-2xl flex items-center gap-4 border border-primary/5">
                  <Truck className="w-5 h-5 text-accent" />
                  <p className="text-xs font-medium italic text-muted-foreground">
                    "Orders over ₹2000 receive complimentary artisanal shipping."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <div className="mb-10 text-center md:text-left">
                <h3 className="font-headline text-3xl text-primary mb-3">Customer Information</h3>
                <p className="text-muted-foreground font-medium italic">"Tell us where these treasures should travel."</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
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
                    className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-lg uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.97] group"
                  >
                    Adopt My Treasures <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <p className="text-center mt-8 text-xs text-muted-foreground italic flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-accent fill-accent" /> "This action will open your mail app to finalize the order with our studio."
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
