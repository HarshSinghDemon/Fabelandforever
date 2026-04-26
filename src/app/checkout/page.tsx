"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingBag, 
  Package, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  MapPin,
  Instagram,
  Mail,
  Navigation as NavIcon,
  Phone,
  Building
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Basic Kolkata Pincode Mapping for Area Detection (Fallback)
const KOLKATA_LOCALITIES: Record<string, string> = {
  "700001": "B.B.D. Bagh",
  "700019": "Ballygunge",
  "700027": "Alipore",
  "700091": "Salt Lake",
  "700156": "New Town",
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    email: '',
    flat: '',
    street: '',
    locality: '',
    city: '',
    pincode: '',
    gpsLocation: null as { lat: number, lng: number } | null
  });

  // Auto-detect area based on pincode manually
  useEffect(() => {
    if (formData.pincode.length === 6 && KOLKATA_LOCALITIES[formData.pincode] && !formData.locality) {
      setFormData(prev => ({ ...prev, locality: KOLKATA_LOCALITIES[formData.pincode], city: 'Kolkata' }));
    }
  }, [formData.pincode]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "GPS Error", description: "Your device does not support geolocation." });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ 
          ...prev, 
          gpsLocation: { lat: latitude, lng: longitude } 
        }));

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            setFormData(prev => ({
              ...prev,
              street: addr.road || addr.pedestrian || addr.suburb || prev.street,
              locality: addr.neighbourhood || addr.suburb || addr.city_district || addr.village || prev.locality,
              city: addr.city || addr.town || addr.state_district || 'Kolkata',
              pincode: addr.postcode || prev.pincode
            }));
            toast({ title: "Address Captured ✨", description: "Your destination details have been unrolled automatically." });
          } else {
            toast({ title: "Coordinates Recorded 📍", description: "GPS detected, but address lookup was shy. Please fill manually." });
          }
        } catch (err) {
          console.error("Geocoding failed", err);
          toast({ title: "Coordinates Recorded 📍", description: "Location captured. Address lookup failed." });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast({ variant: "destructive", title: "GPS Denied", description: "Please enable location services for precise delivery." });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pincode || !db) return;

    setIsSubmitting(true);
    const orderData = {
      userId: 'guest',
      customerName: formData.name,
      customerPhone: formData.phone,
      customerInstagram: formData.instagram,
      customerEmail: formData.email,
      address: {
        flat: formData.flat,
        street: formData.street,
        locality: formData.locality,
        city: formData.city,
        pincode: formData.pincode,
        gps: formData.gpsLocation
      },
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      total: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const ordersRef = collection(db, 'orders');
    addDoc(ordersRef, orderData)
      .then(() => {
        setOrderComplete(true);
        clearCart();
        toast({ title: "Order Received ✨", description: "Your selections are recorded in our studio scrolls." });
      })
      .catch((error) => {
        console.error("Order error:", error);
        toast({ variant: "destructive", title: "Magic Interrupted", description: "Glitch in the loom. Try again." });
      })
      .finally(() => setIsSubmitting(false));
  };

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-paper">
        <Navigation />
        <div className="pt-40 pb-24 container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-10 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="w-16 h-16 text-primary relative z-10" />
          </div>
          <h1 className="font-headline text-5xl md:text-7xl text-primary mb-6">Order Received! ✨</h1>
          <p className="text-xl text-muted-foreground italic mb-10 max-w-2xl leading-relaxed">
            "Thank you for adopting our loops. We will contact you shortly for confirmation."
          </p>
          <Button asChild className="rounded-full px-10 h-16 bg-primary hover:bg-primary/90 text-lg font-bold">
            <Link href="/">Return to Boutique</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <Navigation />
      
      <div className="pt-40 pb-24 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-12">
          <Link href="/shop" className="inline-flex items-center text-primary/60 hover:text-primary transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Back to Boutique
          </Link>
          <h1 className="font-headline text-4xl md:text-7xl text-primary mt-6">Manifest Scroll</h1>
          <p className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Recording your destination details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-accent/5 stitching-border sticky top-32">
              <h3 className="font-headline text-2xl text-primary mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" /> Selected Pieces
              </h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-accent/10">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-primary text-xs truncate uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-primary text-sm whitespace-nowrap">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-dashed border-primary/10">
                <div className="flex justify-between items-center text-2xl font-black text-primary font-headline">
                  <span>Total Magic</span>
                  <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <form onSubmit={handleSubmitOrder} className="space-y-12">
                <div className="space-y-8">
                  <h3 className="font-headline text-2xl text-primary">Identity Ritual</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Full Name</label>
                      <Input required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Phone Number</label>
                      <Input required type="tel" placeholder="For delivery call" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Instagram Handle</label>
                      <Input placeholder="@username" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Gmail (For Receipt)</label>
                      <Input required type="email" placeholder="hello@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pt-8 border-t border-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline text-2xl text-primary">Destination Scroll</h3>
                    <Button type="button" variant="outline" onClick={handleDetectGPS} disabled={isLocating} className="rounded-full h-12 border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest bg-accent/5 hover:bg-accent hover:text-white transition-all">
                      {isLocating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <NavIcon className="w-4 h-4 mr-2" />}
                      {formData.gpsLocation ? "Space Auto-Filled" : "Autofill via GPS"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Flat / House Number</label>
                      <Input required placeholder="e.g., Flat 4B, 2nd Floor" value={formData.flat} onChange={(e) => setFormData({...formData, flat: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Street / Building</label>
                      <Input required placeholder="e.g., Whispering Woods Apartments" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Area / Locality</label>
                      <Input required placeholder="e.g., Park Street" value={formData.locality} onChange={(e) => setFormData({...formData, locality: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4">Pincode</label>
                      <Input required maxLength={6} placeholder="7000xx" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-primary/50 ml-4 flex items-center gap-2"><Building className="w-3 h-3" /> City</label>
                      <Input required placeholder="e.g., Kolkata" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="bg-paper border-none h-14 rounded-2xl px-6 font-bold" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] group">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <div className="flex items-center gap-3">Submit Order <Sparkles className="w-6 h-6 group-hover:rotate-45 transition-transform" /></div>}
                  </Button>
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
