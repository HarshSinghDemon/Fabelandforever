
"use client";

import React, { use } from 'react';
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
  ChevronRight,
  Info
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'products', productId);
  }, [db, productId]);

  const { data: dbProduct, loading } = useDoc(productRef);

  // Fallback to placeholder data if not in DB
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
      "Dimensions: Approximately 12\" x 12\"",
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

  if (loading) {
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
            <Link href="/#shop">Return to Collection</Link>
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
          href="/#shop" 
          className="inline-flex items-center text-primary/40 hover:text-primary transition-colors gap-3 font-bold uppercase tracking-[0.3em] text-[10px] mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-start">
          {/* Visual Showcase */}
          <div className="space-y-12">
            <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden bg-muted shadow-2xl reveal-on-scroll">
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary shadow-lg border border-primary/5">
                  Limited Edition
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 reveal-on-scroll">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-pointer opacity-60 hover:opacity-100 transition-all border-2 border-transparent hover:border-accent">
                   <Image src={product.image} alt="detail" fill className="object-cover scale-150" />
                </div>
              ))}
            </div>
          </div>

          {/* Details & Purchase */}
          <div className="space-y-12 reveal-on-scroll">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-accent/30"></div>
                <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">{product.category}</p>
              </div>
              <h1 className="font-headline text-5xl sm:text-7xl text-primary leading-tight">{product.title}</h1>
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
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Artisan Specs</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(product.details || [
                    "100% Cotton & Wool Blend",
                    "Hand-stitched in Kolkata",
                    "Hypoallergenic filling",
                    "Unique one-off pattern"
                  ]).map((detail: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-primary/60">
                      <CheckCircle2 className="w-4 h-4 text-accent" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                <div className="p-3 bg-primary/5 rounded-2xl">
                  <Truck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Delivery Territory</p>
                  <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold mt-1">
                    Exclusively available in Kolkata
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 group"
                >
                  Adopt Treasure <ShoppingBasket className="ml-4 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { icon: Feather, label: 'Eco Fibers' },
                { icon: Sparkles, label: 'Slow Made' },
                { icon: ShieldCheck, label: 'Quality Verified' }
              ].map((item, i) => (
                <div key={i} className="text-center space-y-3">
                  <item.icon className="w-5 h-5 text-primary/20 mx-auto" />
                  <p className="text-[8px] font-bold uppercase tracking-widest text-primary/40">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-primary/5">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-amber-50/30 text-amber-900/60 border border-amber-100/50">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed italic font-medium">
                  <strong>Made to Order:</strong> Since every loop is hand-stitched by a single artisan, please allow 7-14 days for crafting before delivery.
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
