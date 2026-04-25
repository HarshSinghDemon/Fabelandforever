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
  Info, 
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
import { cn } from '@/lib/utils';

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
        title: product.title,
        price: product.price,
        category: product.category || 'General',
        image: product.image
      });
    }
    toast({
      title: "Added to Basket ✨",
      description: `${quantity} ${product.title} added to your selection.`,
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
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-60 text-center px-6">
          <h1 className="font-headline text-4xl text-primary mb-8">Creation Not Found</h1>
          <Button asChild className="rounded-full px-10 bg-primary">
            <Link href="/shop">Return to Collection</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = [product.image, product.image]; 

  return (
    <main className="min-h-screen bg-white selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex-1 flex flex-col lg:flex-row gap-12 pt-24 lg:pt-40 pb-24">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Link href="/shop" className="hidden lg:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
          <div className="relative rounded-none lg:rounded-[2rem] overflow-hidden bg-paper shadow-lg border border-primary/5">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {galleryImages.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-[4/5] w-full max-h-[70vh]">
                      <Image 
                        src={img} 
                        alt={product.title} 
                        fill 
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold text-primary shadow-lg">
              {current} / {count}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="w-full lg:w-1/2 space-y-10 lg:pl-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">Fable & Forever</p>
            <h1 className="font-headline text-4xl md:text-6xl text-primary leading-tight tracking-tight">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-medium text-primary">₹ {Number(product.price).toLocaleString('en-IN')}.00</span>
            </div>
            <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">
              Taxes included • Hand-stitched with legacy
            </p>
          </div>

          {/* Kolkata Exclusive Notice */}
          <div className="p-8 rounded-[2rem] border-2 border-primary/5 bg-paper/30 flex items-start gap-6 relative overflow-hidden">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Kolkata Exclusive</h4>
              <p className="text-xs leading-relaxed text-primary/60 font-medium italic">
                "Fable & Forever creations are currently handcrafted and delivered exclusively within Kolkata city limits."
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 ml-1">Quantity Selection</label>
              <div className="flex items-center border border-primary/10 rounded-2xl h-16 bg-white overflow-hidden max-w-[200px]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-16 flex items-center justify-center font-bold text-primary text-lg">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleAddToCart}
                className="h-20 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-95"
              >
                Add to cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="h-20 rounded-2xl border-2 border-primary hover:bg-primary hover:text-white text-primary font-bold text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95"
              >
                Buy it now
              </Button>
            </div>

            <div className="pt-2">
              <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-4 py-8 rounded-[2rem] bg-accent/15 text-accent hover:bg-accent/25 transition-all group border border-accent/20 shadow-sm ring-1 ring-accent/10">
                    <Sparkles className="w-5 h-5 group-hover:rotate-45 transition-transform" /> 
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em]">Customize Request</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-[3rem] bg-white border-none shadow-2xl p-10">
                  <DialogHeader className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <DialogTitle className="font-headline text-3xl text-primary tracking-tight">Customize Request</DialogTitle>
                    <DialogDescription className="text-primary/60 italic font-medium leading-relaxed">
                      "Would you like this creation in a different shade or size? Let's weave your unique vision into reality."
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 pt-8">
                    <a href="https://www.instagram.com/fable.and.forever/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-paper rounded-3xl hover:bg-accent/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <Instagram className="w-6 h-6 text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Instagram DM</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-accent/30 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="mailto:fableandforevercompany@gmail.com" className="flex items-center justify-between p-6 bg-paper rounded-3xl hover:bg-primary/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Direct Email</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 py-12 border-y border-primary/5">
            {[ { icon: Leaf, label: 'Eco' }, { icon: Feather, label: 'Hand' }, { icon: Heart, label: 'Pure' }, { icon: Undo2, label: 'Soft' } ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-paper rounded-full flex items-center justify-center text-primary/20">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/30">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">The Story</h4>
            <p className="text-base leading-relaxed text-primary/70 italic font-medium">
              "{product.description}"
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}