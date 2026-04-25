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
  CreditCard,
  Plus,
  Minus,
  Tag,
  Copy,
  Heart,
  Undo2,
  Leaf,
  MapPin,
  Loader2
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
      description: `${quantity} ${product.title} added to your treasures.`,
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
          <h1 className="font-headline text-4xl text-primary mb-8">Treasure Not Found</h1>
          <Button asChild className="rounded-full px-10 bg-primary">
            <Link href="/shop">Return to Collection</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = [product.image, product.image]; // Mocking gallery

  return (
    <main className="min-h-screen bg-white selection:bg-accent/20 flex flex-col">
      <Navigation />
      
      {/* Editorial Gallery Section */}
      <div className="pt-20 md:pt-28 relative">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {galleryImages.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="relative aspect-square w-full bg-paper">
                  <Image 
                    src={img} 
                    alt={product.title} 
                    fill 
                    className="object-cover"
                    priority={idx === 0}
                  />
                  {/* Info Indicator */}
                  <div className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-primary/5">
                    <Info className="w-5 h-5 text-primary/40 rotate-180" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Gallery Indicator */}
        <div className="text-center py-4">
          <span className="text-[10px] font-bold text-primary/40 tracking-widest">{current} / {count}</span>
        </div>
      </div>

      {/* Product Content Matrix */}
      <div className="container mx-auto px-6 max-w-2xl pb-24 space-y-8">
        {/* Brand & Title */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">Fable & Forever</p>
          <h1 className="font-headline text-4xl sm:text-5xl text-primary leading-tight tracking-tight">
            {product.title}
          </h1>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-2xl font-medium text-primary">Rs. {Number(product.price).toLocaleString('en-IN')}.00</span>
          </div>
          <p className="text-[10px] text-primary/40 font-medium">
            Taxes included. Hand-stitched with legacy.
          </p>
        </div>

        {/* Kolkata Exclusive Notice */}
        <div className="p-6 rounded-2xl border-2 border-primary/5 bg-paper/30 flex items-start gap-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Kolkata Exclusive</h4>
            <p className="text-xs leading-relaxed text-primary/60 font-medium italic">
              "Fable & Forever treasures are currently handcrafted and delivered exclusively within Kolkata city limits."
            </p>
          </div>
        </div>

        {/* Quantity Rail */}
        <div className="space-y-3 pt-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 ml-1">Quantity</label>
          <div className="flex items-center border border-primary/10 rounded-lg h-14 bg-white overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-16 flex items-center justify-center font-bold text-primary border-x border-primary/5">
              {quantity}
            </div>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Action Matrix */}
        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleAddToCart}
            className="w-full h-16 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-[0.4em] shadow-lg transition-all active:scale-95"
          >
            Add to cart
          </Button>
          <Button 
            onClick={handleBuyNow}
            variant="outline"
            className="w-full h-16 rounded-xl border-2 border-primary hover:bg-primary hover:text-white text-primary font-bold text-xs uppercase tracking-[0.4em] transition-all active:scale-95"
          >
            Buy it now
          </Button>
        </div>

        {/* Customization Path */}
        <div className="pt-4">
          <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <DialogTrigger asChild>
              <button className="w-full flex items-center justify-center gap-3 py-6 text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40 hover:text-primary transition-all group">
                <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                Request Bespoke Variation
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white border-none shadow-2xl p-10">
              <DialogHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <DialogTitle className="font-headline text-3xl text-primary">Bespoke Journey</DialogTitle>
                <DialogDescription className="text-primary/60 italic font-medium">
                  "Would you like this treasure in a different shade or size? Let's weave your unique vision into reality."
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 pt-8">
                <a 
                  href="https://www.instagram.com/fable.and.forever/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-paper rounded-2xl hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Instagram className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Instagram DM</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-accent/30 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="mailto:fableandforevercompany@gmail.com"
                  className="flex items-center justify-between p-6 bg-paper rounded-2xl hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Direct Email</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Heritage Trust Grid */}
        <div className="grid grid-cols-4 gap-4 py-12 border-t border-primary/5">
          {[
            { icon: Leaf, label: 'Eco' },
            { icon: Feather, label: 'Hand' },
            { icon: Heart, label: 'Pure' },
            { icon: Undo2, label: 'Soft' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-primary/40">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/30">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Product Narrative */}
        <div className="space-y-6 pt-4 border-t border-primary/5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Product Story</h4>
          <p className="text-sm leading-relaxed text-primary/60 italic font-medium">
            "{product.description}"
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "100% Cotton & Wool Blend",
              "Heritage Craft from Kolkata",
              "Hypoallergenic artisanal filling",
              "Unique slow-made forever loop"
            ].map((spec, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                <div className="w-1 h-1 bg-accent rounded-full" /> {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />

      {/* WhatsApp Widget */}
      <a 
        href="https://wa.me/910000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:right-12 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90 animate-float"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.404c0 6.556-5.332 11.888-11.888 11.888-2.096 0-4.141-.547-5.945-1.587L0 24zm6.516-4.524c1.558.924 3.102 1.411 4.771 1.411 5.431 0 9.851-4.42 9.851-9.852 0-2.632-1.025-5.106-2.887-6.968-1.862-1.861-4.335-2.887-6.967-2.887-5.432 0-9.851 4.419-9.851 9.852 0 1.67.488 3.213 1.412 4.772l-.995 3.637 3.666-.966zM17.473 14.382c-.301-.15-1.781-.879-2.053-.978-.272-.098-.47-.147-.667.147-.197.296-.765.964-.938 1.162-.173.197-.346.223-.646.073-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.495-1.778-1.671-2.076-.176-.299-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.298.3-.497.1-.198.05-.371-.025-.521-.075-.149-.667-1.608-.913-2.201-.24-.579-.485-.5-.667-.51-.173-.009-.371-.01-.57-.01-.198 0-.52.074-.791.372-.272.297-1.038 1.016-1.038 2.479 0 1.462 1.064 2.875 1.212 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.781-.727 2.03-1.429.247-.702.247-1.303.173-1.428-.074-.124-.272-.198-.573-.348z" />
        </svg>
      </a>
    </main>
  );
}
