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
  Plus, 
  Minus, 
  MapPin, 
  Loader2, 
  Instagram, 
  ChevronRight, 
  Sparkles,
  Feather,
  Heart,
  Undo2,
  Leaf,
  ArrowLeft,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();
  
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
  } : null);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title || product.name,
        price: product.price,
        category: product.category || 'General',
        image: product.imageUrls?.[0] || product.image
      });
    }
    toast({
      title: "Added to Basket ✨",
      description: `${quantity} ${product.title || product.name} added.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading && !dbProduct && !placeholder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const galleryImages = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [product.image];

  return (
    <main className="min-h-screen bg-white selection:bg-accent/10 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex-1 flex flex-col lg:flex-row gap-10 lg:gap-20 pt-28 lg:pt-40 pb-24">
        
        {/* Left Column: Image Gallery (PC: Large & Sticky, Phone: Full Width) */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          <Link href="/shop" className="hidden lg:flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-primary/30 hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Return to Collection
          </Link>
          <div className="relative rounded-none overflow-hidden bg-paper shadow-sm border border-primary/5 stitching-border w-full max-w-[650px] mx-auto lg:ml-0">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {galleryImages.map((img: string, idx: number) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-[4/5] w-full">
                      <Image 
                        src={img} 
                        alt={product.title || product.name} 
                        fill 
                        className="object-cover"
                        priority={idx === 0}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-[8px] font-bold text-primary uppercase tracking-widest border border-primary/5">
              {current} / {count}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions (Sticky on PC) */}
        <div className="w-full lg:w-2/5 space-y-8 md:space-y-10 lg:sticky lg:top-40 h-fit">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-[9px] font-bold uppercase tracking-[0.8em] text-accent">Fable & Forever Studio</p>
            <h1 className="font-headline text-4xl md:text-6xl text-primary leading-tight tracking-tight">
              {product.title || product.name}
            </h1>
            <div className="flex items-baseline justify-center lg:justify-start gap-4 pt-2">
              <span className="text-3xl font-medium text-primary">₹ {Number(product.price).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-6 bg-paper/50 border border-primary/5 flex items-start gap-5 md:gap-6 relative overflow-hidden stitching-border">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary">Kolkata Exclusive</h4>
              <p className="text-[10px] md:text-[11px] leading-relaxed text-primary/50 font-medium italic">
                "Handcrafted and delivered exclusively within Kolkata city limits."
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <label className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary/30">Quantity Selection</label>
              <div className="flex items-center border border-primary/10 h-14 bg-white overflow-hidden max-w-[160px] mx-auto lg:ml-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <div className="w-12 flex items-center justify-center font-bold text-primary text-base">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleAddToCart}
                className="h-16 rounded-none bg-primary text-white text-[10px] tracking-[0.4em] w-full uppercase"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="h-16 rounded-none border-primary/20 text-[10px] tracking-[0.4em] w-full uppercase"
              >
                Buy it Now
              </Button>
            </div>

            <div className="pt-4">
              <Link 
                href="https://www.instagram.com/fable.and.forever/"
                target="_blank"
                className="w-full flex items-center justify-center gap-6 py-8 md:py-10 bg-accent text-white hover:bg-accent/90 transition-all border border-accent/10 shadow-xl relative overflow-hidden group rounded-[1.5rem] md:rounded-[2rem]"
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>
                <Instagram className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" /> 
                <div className="flex flex-col items-start">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em]">Order via DM</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 mt-1 italic">Consult the Weaver</span>
                </div>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-auto mr-4 opacity-40 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Artisanal Symbols */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 py-8 md:py-10 border-y border-primary/5">
            {[ 
              { icon: Leaf, label: 'Eco' }, 
              { icon: Feather, label: 'Hand' }, 
              { icon: Heart, label: 'Pure' }, 
              { icon: Undo2, label: 'Soft' } 
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-paper rounded-full flex items-center justify-center text-primary/20">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-primary/20">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-center lg:text-left px-4 lg:px-0">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-primary/40">The Stitch Story</h4>
            <p className="text-sm md:text-base leading-relaxed text-primary/60 italic font-medium">
              "{product.description}"
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}