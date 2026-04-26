
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
  Loader2, 
  Instagram, 
  ChevronRight, 
  Sparkles,
  Facebook,
  Twitter,
  Share2,
  Star,
  MapPin,
  Feather,
  Heart,
  Undo2
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    name: placeholder.description,
    price: placeholder.price,
    category: placeholder.category,
    imageUrls: [placeholder.imageUrl],
    description: placeholder.story || "A unique piece from our artisanal collection.",
    isBestseller: true
  } : null);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        category: product.category || 'General',
        image: product.imageUrls?.[0] || ''
      });
    }
    toast({
      title: "Selection Added ✨",
      description: `${quantity} ${product.name} added to your basket.`,
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
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const galleryImages = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ['https://placehold.co/800x1000?text=Forever+Loop'];

  const sidebarLinks = [
    { label: 'All Products', href: '/shop' },
    { label: 'Flowers', href: '/shop#flowers' },
    { label: 'Amigurumi', href: '/shop#amigurumi' },
    { label: 'Bag Charm', href: '/shop#bag-charm' },
    { label: 'Hair Accessories', href: '/shop#hair-accessories' },
    { label: 'Bandana', href: '/shop#bandana' },
    { label: 'Ribbon Bouquet', href: '/shop#ribbon-bouquet' },
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-accent/10 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-24 md:pt-48 pb-24 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* Column 1: Archive Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-2">
            <nav className="sticky top-40 space-y-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 border-b border-primary/5 pb-4">Collections</h4>
                <ul className="space-y-5">
                  {sidebarLinks.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-[11px] font-bold uppercase tracking-widest text-primary/40 hover:text-accent transition-all duration-300 block hover:translate-x-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10 border-t border-primary/5 space-y-6">
                <div className="flex flex-col gap-4 text-primary/20">
                  <div className="flex items-center gap-3">
                    <Feather className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Hand-Stitched</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Pure Fibers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Kolkata Exclusive</span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Column 2: Visual Center Gallery */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="relative aspect-[4/5] bg-paper overflow-hidden shadow-sm border border-primary/5 stitching-border group">
              {product.isBestseller && (
                <div className="absolute top-6 left-6 z-20 bg-accent text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl animate-in zoom-in duration-500">
                  Bestseller
                </div>
              )}
              <Carousel setApi={setApi} className="w-full h-full">
                <CarouselContent className="h-full">
                  {galleryImages.map((img: string, idx: number) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/5] w-full">
                        <Image 
                          src={img} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-[10s] hover:scale-105"
                          priority={idx === 0}
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 text-[9px] font-black tracking-widest text-primary shadow-lg border border-primary/5">
                {current} / {count}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
              {galleryImages.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 border-2 transition-all duration-500 overflow-hidden shadow-sm",
                    current === idx + 1 ? "border-accent scale-105" : "border-primary/5 opacity-50 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Narrative Pillar Details */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            <nav className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30 flex items-center gap-3">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent">{product.name}</span>
            </nav>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-accent flex items-center gap-3">
                   <Sparkles className="w-4 h-4" /> {product.category}
                </p>
                <h1 className="font-headline text-4xl md:text-7xl lg:text-8xl text-primary tracking-tighter leading-[0.9] drop-shadow-sm">
                  {product.name}
                </h1>
              </div>
              <p className="text-sm md:text-lg leading-relaxed text-primary/60 italic font-medium max-w-lg">
                "{product.description}"
              </p>
            </div>

            <div className="flex items-center gap-6 py-2 border-y border-primary/5">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/30">Artisanal Choice</span>
            </div>

            <div className="flex items-baseline gap-4">
               <span className="text-3xl md:text-5xl font-headline text-primary">
                 ₹ {Number(product.price).toLocaleString('en-IN')}
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/20">Tax Included</span>
            </div>

            {/* Action Row: Quantity & Buy */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex items-center border border-primary/10 h-16 md:h-20 bg-white shadow-sm overflow-hidden min-w-[140px] rounded-2xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full"
                  >
                    <Minus className="w-4 h-4 text-primary" />
                  </button>
                  <div className="w-12 flex items-center justify-center font-black text-primary text-lg">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-16 md:h-20 bg-primary text-white text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-95 rounded-2xl"
                >
                  Add to Cart
                </Button>
              </div>

              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="w-full h-16 md:h-20 border-primary/20 text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase hover:bg-primary hover:text-white transition-all rounded-2xl"
              >
                Buy it Now
              </Button>
            </div>

            {/* Order via DM Portal */}
            <div className="pt-2">
              <Link 
                href="https://www.instagram.com/fable.and.forever/"
                target="_blank"
                className="w-full flex items-center justify-center gap-6 md:gap-8 py-6 md:py-10 bg-accent text-white hover:bg-accent/90 transition-all shadow-[0_20px_50px_-15px_rgba(var(--accent),0.4)] relative overflow-hidden group rounded-[2.5rem] md:rounded-[3rem]"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Instagram className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" /> 
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] leading-none">Customize Order</span>
                </div>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 opacity-20 group-hover:translate-x-3 transition-transform" />
              </Link>
            </div>

            {/* Accordion Detail Sections */}
            <Accordion type="single" collapsible className="w-full border-t border-primary/5 pt-8">
              <AccordionItem value="process" className="border-primary/5 py-1">
                <AccordionTrigger className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent transition-colors no-underline hover:no-underline">The Process</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic pt-4">
                  Every loop is a meditation. Our master weavers spend days hand-stitching each piece in our Kolkata studio.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials" className="border-primary/5 py-1">
                <AccordionTrigger className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent transition-colors no-underline hover:no-underline">Fiber Details</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic pt-4">
                  We use only premium, locally-sourced cotton and soft wool blends that grow softer with every year.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="delivery" className="border-primary/5 py-1">
                <AccordionTrigger className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent transition-colors no-underline hover:no-underline">Heritage Delivery</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic pt-4">
                  Based in the heart of Kolkata, we offer hand-delivery exclusively within city limits.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
