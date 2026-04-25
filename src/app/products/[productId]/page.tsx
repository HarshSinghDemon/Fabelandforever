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
  Mail, 
  ChevronRight, 
  Sparkles,
  Feather,
  Heart,
  Undo2,
  Leaf,
  ArrowLeft
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
  const [isCustomOpen, setIsCustomOpen] = useState(false);

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
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex-1 flex flex-col lg:flex-row gap-10 lg:gap-20 pt-24 lg:pt-40 pb-20">
        
        {/* Left Column: Image Gallery */}
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

        {/* Right Column: Details & Actions */}
        <div className="w-full lg:w-2/5 space-y-10 lg:sticky lg:top-40 h-fit">
          <div className="space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.8em] text-accent">Fable & Forever Studio</p>
            <h1 className="font-headline text-4xl md:text-6xl text-primary leading-tight tracking-tight">
              {product.title || product.name}
            </h1>
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-medium text-primary">₹ {Number(product.price).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-6 bg-paper/50 border border-primary/5 flex items-start gap-6 relative overflow-hidden stitching-border">
            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary">Kolkata Exclusive</h4>
              <p className="text-[11px] leading-relaxed text-primary/50 font-medium italic">
                "Handcrafted and delivered exclusively within Kolkata city limits."
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary/30">Quantity Selection</label>
              <div className="flex items-center border border-primary/10 h-14 bg-white overflow-hidden max-w-[160px]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 flex items-center justify-center font-bold text-primary text-base">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleAddToCart}
                className="h-14 rounded-none bg-primary text-white text-[10px] tracking-[0.5em] w-full"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="h-14 rounded-none border-primary/20 text-[10px] tracking-[0.5em] w-full"
              >
                Buy it Now
              </Button>
            </div>

            <div className="pt-2">
              <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-4 py-8 bg-accent/5 text-accent hover:bg-accent/10 transition-all border border-accent/10 shadow-sm relative overflow-hidden group">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em]">Customize Request</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] border-none shadow-2xl p-0 overflow-hidden bg-white rounded-none">
                  <div className="h-2 bg-accent/20 w-full"></div>
                  <div className="p-10">
                    <DialogHeader className="text-center space-y-6 mb-10">
                      <div className="w-16 h-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                        <Feather className="w-7 h-7 text-accent" />
                      </div>
                      <DialogTitle className="font-headline text-3xl text-primary">Customize Request</DialogTitle>
                      <DialogDescription className="text-primary/40 text-[11px] italic font-medium leading-relaxed tracking-wide">
                        "Let's weave your unique vision into reality. Reach out via your preferred scroll."
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <a href="https://www.instagram.com/fable.and.forever/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-paper hover:bg-accent/5 transition-all group">
                        <div className="flex items-center gap-6">
                          <Instagram className="w-6 h-6 text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Instagram DM</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-accent/20 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <a href="mailto:fableandforevercompany@gmail.com" className="flex items-center justify-between p-6 bg-paper hover:bg-primary/5 transition-all group">
                        <div className="flex items-center gap-6">
                          <Mail className="w-6 h-6 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Direct Email</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary/20 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 py-10 border-y border-primary/5">
            {[ { icon: Leaf, label: 'Eco' }, { icon: Feather, label: 'Hand' }, { icon: Heart, label: 'Pure' }, { icon: Undo2, label: 'Soft' } ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-primary/20">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/20">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.6em] text-primary/40">The Stitch Story</h4>
            <p className="text-base leading-relaxed text-primary/60 italic font-medium">
              "{product.description}"
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
