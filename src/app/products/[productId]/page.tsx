
"use client";

import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ShoppingBasket, 
  Sparkles, 
  Feather, 
  ShieldCheck, 
  Truck, 
  CheckCircle2,
  Info,
  MessageCircle,
  Mail,
  Instagram,
  Wand2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const productRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'products', productId);
  }, [db, productId]);

  const { data: dbProduct, loading } = useDoc(productRef);

  const placeholder = PlaceHolderImages.find(p => p.id === productId);
  
  const product = dbProduct || (placeholder ? {
    id: placeholder.id,
    title: placeholder.description,
    price: placeholder.price,
    category: placeholder.category,
    image: placeholder.imageUrl,
    description: placeholder.story || "A unique piece from our artisanal collection.",
    details: [
      "100% Hand-stitched with premium fibers",
      "Kolkata Heritage Crafted",
      "Care: Gentle hand wash, dry flat",
      "Origin: Proudly made in Kolkata"
    ]
  } : null);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || 'General',
      image: product.image
    });
    toast({
      title: "Added to Basket ✨",
      description: `${product.title} is now yours.`,
    });
  };

  if (loading && !dbProduct && !placeholder) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-paper">
        <Navigation />
        <div className="pt-60 text-center px-6">
          <h1 className="font-headline text-4xl text-primary mb-8">Treasure Not Found</h1>
          <Button asChild className="rounded-full px-10 bg-primary">
            <Link href="/shop">Return to Collection</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      <div className="pt-32 sm:pt-48 pb-24 container mx-auto px-6 max-w-7xl">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-primary/40 hover:text-primary transition-colors gap-3 font-bold uppercase tracking-[0.3em] text-[10px] mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-start">
          {/* Product Image Section */}
          <div className="space-y-12">
            <div className="relative aspect-[3/4] w-full rounded-[1.5rem] overflow-hidden bg-muted shadow-2xl reveal-on-scroll active">
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] text-primary shadow-lg border border-primary/5">
                  Artisanal One-Off
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 reveal-on-scroll active">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-pointer opacity-60 hover:opacity-100 transition-all border-2 border-transparent hover:border-accent shadow-sm">
                   <Image src={product.image} alt="detail" fill className="object-cover scale-125" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Content Section */}
          <div className="space-y-12 reveal-on-scroll active">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-accent/30"></div>
                <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">{product.category}</p>
              </div>
              <h1 className="font-headline text-5xl sm:text-7xl text-primary leading-tight tracking-tighter">{product.title}</h1>
              <p className="text-3xl font-headline text-primary/60 italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-8 py-10 border-y border-primary/5">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">The Stitch Story</h4>
                <p className="text-lg text-primary/80 leading-relaxed font-medium italic">
                  "{product.description}"
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Artisanal Specs</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(product.details || [
                    "100% Cotton & Wool Blend",
                    "Heritage Craft from Kolkata",
                    "Hypoallergenic filling",
                    "Unique slow-made loop"
                  ]).map((detail: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-primary/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 group"
                >
                  Adopt Treasure <ShoppingBasket className="ml-4 w-4 h-4 group-hover:rotate-12 transition-transform" />
                </Button>

                <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="h-20 rounded-full border-2 border-primary/10 hover:border-accent hover:bg-accent/5 text-primary font-bold text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 group"
                    >
                      Bespoke Request <Wand2 className="ml-4 w-4 h-4 group-hover:scale-125 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-[3rem] bg-paper border-none shadow-2xl p-10">
                    <DialogHeader className="space-y-4 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-accent" />
                      </div>
                      <DialogTitle className="font-headline text-4xl text-primary tracking-tighter">Bespoke Vision</DialogTitle>
                      <DialogDescription className="text-primary/60 italic font-medium">
                        "Would you like this treasure in a different shade or size? Let's weave your unique vision into reality."
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 pt-8">
                      <a 
                        href="https://www.instagram.com/fable.and.forever/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-6 bg-white rounded-3xl border border-primary/5 hover:border-accent transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <Instagram className="w-6 h-6 text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Direct Message</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 rotate-180 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </a>
                      <a 
                        href="mailto:fableandforevercompany@gmail.com"
                        className="flex items-center justify-between p-6 bg-white rounded-3xl border border-primary/5 hover:border-accent transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <Mail className="w-6 h-6 text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Send an Email</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 rotate-180 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </a>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                <div className="p-3 bg-primary/5 rounded-2xl">
                  <Truck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Delivery Area</p>
                  <p className="text-[9px] text-primary/40 uppercase tracking-[0.3em] font-bold mt-1">
                    Exclusively in Kolkata
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { icon: Feather, label: 'Eco Fibers' },
                { icon: Sparkles, label: 'Slow Made' },
                { icon: ShieldCheck, label: 'Quality Loop' }
              ].map((item, i) => (
                <div key={i} className="text-center space-y-3">
                  <item.icon className="w-5 h-5 text-primary/10 mx-auto" />
                  <p className="text-[8px] font-bold uppercase tracking-widest text-primary/30">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-primary/5">
              <div className="flex items-start gap-4 p-8 rounded-[2rem] bg-primary/[0.02] text-primary/50 border border-primary/5">
                <Info className="w-5 h-5 shrink-0 mt-0.5 opacity-30" />
                <p className="text-[11px] leading-relaxed italic font-medium">
                  <strong>The Artisan Notice:</strong> Every loop is hand-stitched by a single master weaver. Please allow 7-14 days for crafting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
