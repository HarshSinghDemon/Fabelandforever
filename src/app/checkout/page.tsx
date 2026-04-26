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
  Phone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Basic Kolkata Pincode Mapping for Area Detection
const KOLKATA_LOCALITIES: Record<string, string> = {
  "700001": "B.B.D. Bagh / Dalhousie",
  "700002": "Cossipore",
  "700003": "Baghbazar",
  "700004": "Shambazar",
  "700006": "Beadon Street",
  "700007": "Burrabazar",
  "700009": "Amherst Street",
  "700010": "Beleghata",
  "700012": "Bowbazar",
  "700013": "Dharamtala",
  "700016": "Park Street",
  "700017": "Circus Avenue",
  "700019": "Ballygunge",
  "700020": "Lala Lajpat Rai Sarani",
  "700025": "Bhawanipur",
  "700026": "Kalighat",
  "700027": "Alipore",
  "700029": "Sarat Bose Road",
  "700031": "Dhakuria",
  "700032": "Jadavpur University",
  "700033": "Tollygunge",
  "700045": "Lake Gardens",
  "700047": "Naktala",
  "700048": "Lake Town",
  "700053": "New Alipore",
  "700068": "Golf Green",
  "700078": "Haltu",
  "700091": "Salt Lake Sector V",
  "700102": "Baguihati",
  "700107": "Kasba",
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
    pincode: '',
    gpsLocation: null as { lat: number, lng: number } | null
  });

  // Auto-detect area based on pincode
  useEffect(() => {
    if (formData.pincode.length === 6 && KOLKATA_LOCALITIES[formData.pincode]) {
      setFormData(prev => ({ ...prev, locality: KOLKATA_LOCALITIES[formData.pincode] }));
      toast({
        title: "Area Detected ✨",
        description: `Localizing your address to ${KOLKATA_LOCALITIES[formData.pincode]}.`,
      });
    }
  }, [formData.pincode, toast]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "GPS Error", description: "Your device does not support geolocation." });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({ 
          ...prev, 
          gpsLocation: { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          } 
        }));
        setIsLocating(false);
        toast({ title: "Coordinates Recorded 📍", description: "Your precise location has been added to the scroll." });
      },
      (error) => {
        setIsLocating(false);
        toast({ variant: "destructive", title: "GPS Denied", description: "Please enable location services for precise delivery." });
      }
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
        city: 'Kolkata',
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
        toast({
          title: "Order Received ✨",
          description: "Your selections are being prepared in our scrolls.",
        });
      })
      .catch((error) => {
        console.error("Order error:", error);
        toast({
          variant: "destructive",
          title: "Magic Interrupted",
          description: "There was a glitch in the loom. Please try again.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
            "Thank you for adopting our loops. We have safely recorded your details in our studio scrolls. We will contact you shortly via phone for confirmation and payment instructions."
          </p>
          <Button asChild className="rounded-full px-10 h-16 bg-primary hover:bg-primary/90 text-lg font-bold">
            <Link href="/">Return to Boutique</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

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
            "It seems you haven't chosen any loops to bring home yet. Let's find something magical."
          </p>
          <Button asChild className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90">
            <Link href="/shop">Explore Collections</Link>
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
          <Link 
            href="/shop" 
            className="inline-flex items-center text-primary/60 hover:text-primary transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Boutique
          </Link>
          <h1 className="font-headline text-4xl md:text-7xl text-primary mt-6">Manifest Scroll</h1>
          <p className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Recording your heritage loop details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-accent/5 stitching-border overflow-hidden relative">
              <h3 className="font-headline text-2xl text-primary mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-accent" /> Selected Pieces
              </h3>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-accent/10">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary text-xs md:text-sm leading-tight">{item.title}</h4>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-primary text-sm">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
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

          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <form onSubmit={handleSubmitOrder} className="space-y-12">
                {/* Identity Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-headline text-2xl text-primary">Identity Ritual</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4 flex items-center gap-2">Full Name</label>
                      <Input 
                        required
                        placeholder="Your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4 flex items-center gap-2"><Phone className="w-3 h-3" /> Phone Number</label>
                      <Input 
                        required
                        type="tel"
                        placeholder="For delivery call" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4 flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram Handle</label>
                      <Input 
                        placeholder="@username" 
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4 flex items-center gap-2"><Mail className="w-3 h-3" /> Gmail (For Receipt)</label>
                      <Input 
                        required
                        type="email"
                        placeholder="hello@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                  </div>
                </div>

                {/* Destination Section */}
                <div className="space-y-8 pt-8 border-t border-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h3 className="font-headline text-2xl text-primary">Destination Scroll</h3>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDetectGPS}
                      disabled={isLocating}
                      className="rounded-full h-10 border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest bg-accent/5 hover:bg-accent hover:text-white transition-all"
                    >
                      {isLocating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <NavIcon className="w-3 h-3 mr-2" />}
                      {formData.gpsLocation ? "Space Detected" : "Locate My Space"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4">Flat / House / Floor Number</label>
                      <Input 
                        required
                        placeholder="e.g., Flat 4B, 2nd Floor" 
                        value={formData.flat}
                        onChange={(e) => setFormData({...formData, flat: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4">Street / Landmark</label>
                      <Input 
                        required
                        placeholder="e.g., Near Park Street" 
                        value={formData.street}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4">Pincode (Kolkata Only)</label>
                      <Input 
                        required
                        maxLength={6}
                        placeholder="7000xx" 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4">Detected Locality</label>
                      <Input 
                        required
                        placeholder="Locality name" 
                        value={formData.locality}
                        onChange={(e) => setFormData({...formData, locality: e.target.value})}
                        className="bg-paper border-none h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 text-sm md:text-lg font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-primary/50 ml-4">Heritage City</label>
                      <div className="bg-paper h-14 md:h-16 rounded-2xl md:rounded-3xl px-6 md:px-8 flex items-center font-bold text-primary/40 text-sm md:text-lg">
                        Kolkata
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-bold text-base md:text-xl uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-97 group"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" /> Recording Scroll...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        Submit Order <Sparkles className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                      </div>
                    )}
                  </Button>
                  <p className="text-center text-[8px] md:text-[9px] text-primary/20 font-bold uppercase tracking-widest mt-6">
                    Hand-delivery exclusively within Kolkata Heritage zones
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
