
"use client";

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Instagram,
  Mail,
  Wand2,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
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

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || 'General',
      image: product.image
    });
    router.push('/checkout');
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

  // Generate multiple image views for the gallery
  const galleryImages = [product.image, product.image, product.image];

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      <div className="pt-32 sm:pt-48 pb-24 container mx-auto px-6 max-w-7xl">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-primary/40 hover:text-primary transition-colors gap-3 font-bold uppercase tracking-[0.3em] text-[10px] mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 sm:gap-24 items-start">
          
          {/* Editorial Image Gallery (Wipeable) */}
          <div className="lg:col-span-7 space-y-12 reveal-on-scroll active">
            <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-primary/5">
              <Carousel className="w-full">
                <CarouselContent>
                  {galleryImages.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/5] w-full">
                        <Image 
                          src={img} 
                          alt={`${product.title} - View ${idx + 1}`} 
                          fill 
                          className="object-cover"
                          priority={idx === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                   <div className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-primary/5 flex items-center gap-3">
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/40">Swipe to feel</span>
                      <ChevronRight className="w-3 h-3 text-accent animate-pulse" />
                   </div>
                </div>
                <div className="hidden sm:block">
                  <CarouselPrevious className="left-6 bg-white/90 hover:bg-white border-none shadow-xl" />
                  <CarouselNext className="right-6 bg-white/90 hover:bg-white border-none shadow-xl" />
                </div>
              </Carousel>
              
              <div className="absolute top-8 left-8">
                <span className="bg-primary px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-white shadow-2xl">
                  Artisanal One-Off
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-primary/5 hover:border-accent transition-all cursor-pointer group shadow-sm">
                   <Image src={img} alt="detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>

          {/* Elegant Content Matrix */}
          <div className="lg:col-span-5 space-y-12 reveal-on-scroll active">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-accent/30"></div>
                <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">{product.category}</p>
              </div>
              
              <h1 className="font-headline text-5xl sm:text-7xl text-primary leading-tight tracking-tighter">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-headline text-primary">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/30 italic">Price includes crafting love</span>
              </div>
            </div>

            {/* Improved "Written Things" - High Visibility */}
            <div className="space-y-12 py-12 border-y border-primary/5">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40 flex items-center gap-3">
                  <Feather className="w-4 h-4" /> The Stitch Story
                </h4>
                <p className="text-xl text-primary leading-relaxed font-medium italic bg-accent/5 p-8 rounded-[2.5rem] border border-accent/10">
                  "{product.description}"
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/40">Artisanal Specs</h4>
                <ul className="grid grid-cols-1 gap-4">
                  {(product.details || [
                    "100% Cotton & Wool Blend",
                    "Heritage Craft from Kolkata",
                    "Hypoallergenic filling",
                    "Unique slow-made loop"
                  ]).map((detail: string, i: number) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Matrix */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  onClick={handleBuyNow}
                  className="h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 group"
                >
                  <CreditCard className="mr-4 w-4 h-4 group-hover:scale-110 transition-transform" /> 
                  Direct Buy Now
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline"
                    className="h-20 rounded-[2rem] border-2 border-primary/10 hover:border-accent hover:bg-accent/5 text-primary font-bold text-[10px] uppercase tracking-[0.4em] transition-all group"
                  >
                    Add to Basket <ShoppingBasket className="ml-3 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </Button>

                  <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="h-20 rounded-[2rem] border-2 border-primary/10 hover:border-accent hover:bg-accent/5 text-primary font-bold text-[10px] uppercase tracking-[0.4em] transition-all group"
                      >
                        Bespoke <Wand2 className="ml-3 w-4 h-4 group-hover:scale-125 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[4rem] bg-paper border-none shadow-2xl p-12">
                      <DialogHeader className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                          <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <DialogTitle className="font-headline text-5xl text-primary tracking-tighter">Bespoke Vision</DialogTitle>
                        <DialogDescription className="text-primary/60 italic font-medium text-lg leading-relaxed">
                          "Would you like this treasure in a different shade or size? Let's weave your unique vision into reality."
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 pt-10">
                        <a 
                          href="https://www.instagram.com/fable.and.forever/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-primary/5 hover:border-accent transition-all group shadow-sm hover:shadow-xl"
                        >
                          <div className="flex items-center gap-6">
                            <div className="p-4 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform">
                              <Instagram className="w-6 h-6 text-accent" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Instagram DM</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-accent opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                        </a>
                        <a 
                          href="mailto:fableandforevercompany@gmail.com"
                          className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-primary/5 hover:border-accent transition-all group shadow-sm hover:shadow-xl"
                        >
                          <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/5 rounded-2xl group-hover:scale-110 transition-transform">
                              <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Direct Email</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-primary opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm">
                <div className="p-4 bg-primary/5 rounded-[1.5rem]">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em]">Delivery Notice</p>
                  <p className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-bold mt-1">
                    Exclusively in Kolkata
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-primary/5">
              {[
                { icon: Feather, label: 'Eco Fibers' },
                { icon: Sparkles, label: 'Slow Made' },
                { icon: ShieldCheck, label: 'Quality Loop' }
              ].map((item, i) => (
                <div key={i} className="text-center space-y-4 group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-primary/5 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/30">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8">
              <div className="flex items-start gap-4 p-10 rounded-[2.5rem] bg-primary/[0.03] text-primary/50 border border-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <Info className="w-5 h-5 shrink-0 mt-0.5 opacity-30" />
                <p className="text-[12px] leading-relaxed italic font-medium relative z-10">
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
