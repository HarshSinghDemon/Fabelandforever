
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
  Facebook,
  Twitter,
  Share2,
  Star,
  ArrowLeft,
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
      title: "Selection Adopted ✨",
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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-32 md:pt-48 pb-24 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* Column 1: Left Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-2">
            <nav className="sticky top-40 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 mb-8 border-b border-primary/5 pb-4">Collections</h4>
              <ul className="space-y-4">
                {sidebarLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-[11px] font-bold uppercase tracking-widest text-primary/40 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Column 2: Center Image Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative aspect-[4/5] bg-paper overflow-hidden shadow-sm border border-primary/5 stitching-border group">
              {product.isBestseller && (
                <div className="absolute top-4 left-4 z-20 bg-accent text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-lg">
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
                          className="object-cover"
                          priority={idx === 0}
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {galleryImages.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "relative w-24 h-32 flex-shrink-0 border-2 transition-all overflow-hidden",
                    current === idx + 1 ? "border-accent" : "border-primary/5 opacity-50"
                  )}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Right Details Section */}
          <div className="lg:col-span-5 space-y-10">
            {/* Breadcrumbs */}
            <nav className="text-[9px] font-bold uppercase tracking-widest text-primary/30 flex items-center gap-2">
              <Link href="/" className="hover:text-accent">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-accent">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent">{product.name}</span>
            </nav>

            <div className="space-y-4">
              <h1 className="font-headline text-4xl md:text-6xl text-primary tracking-tighter leading-none">
                {product.name}
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-accent">
                {product.category} • Hand-Stitched Heritage
              </p>
            </div>

            <p className="text-sm md:text-base leading-relaxed text-primary/60 italic font-medium">
              "{product.description}"
            </p>

            <div className="flex items-center gap-4 py-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Verified Artisanal Quality</span>
            </div>

            {/* Share Icons */}
            <div className="flex gap-6 text-primary/20">
              <Facebook className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              <Share2 className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
            </div>

            <div className="text-3xl font-medium text-primary border-b border-primary/5 pb-8">
              ₹ {Number(product.price).toLocaleString('en-IN')}
            </div>

            {/* Action Row: Quantity & Buy */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex items-center border border-primary/10 h-16 bg-white overflow-hidden min-w-[140px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full px-4"
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <div className="w-12 flex items-center justify-center font-bold text-primary text-base">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="flex-1 flex items-center justify-center hover:bg-primary/5 transition-colors h-full px-4"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 h-16 bg-primary text-white text-[10px] tracking-[0.4em] uppercase shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Adopt Selection
              </Button>
            </div>

            <Button 
              onClick={handleBuyNow}
              variant="outline"
              className="w-full h-16 border-primary/20 text-[10px] tracking-[0.4em] uppercase"
            >
              Buy it Now
            </Button>

            {/* Order via DM Portal */}
            <div className="pt-6">
              <Link 
                href="https://www.instagram.com/fable.and.forever/"
                target="_blank"
                className="w-full flex items-center justify-center gap-6 py-8 bg-accent text-white hover:bg-accent/90 transition-all shadow-xl relative overflow-hidden group rounded-[2rem]"
              >
                <Instagram className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                <div className="flex flex-col items-start text-left">
                  <span className="text-[11px] font-black uppercase tracking-[0.6em]">Order via DM</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 mt-1 italic">Personal Consultation</span>
                </div>
              </Link>
            </div>

            {/* Accordion Detail Sections */}
            <Accordion type="single" collapsible className="w-full border-t border-primary/5 pt-10">
              <AccordionItem value="process" className="border-primary/5">
                <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent">The Process</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic">
                  Every loop is a meditation. Our master weavers spend days hand-stitching each piece in our Kolkata studio, ensuring a tension and durability that lasts for generations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials" className="border-primary/5">
                <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent">Fiber Details</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic">
                  We use only premium, locally-sourced cotton and soft wool blends that grow softer with every year. Our materials are hypoallergenic and selected for their tactile soul.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="delivery" className="border-primary/5">
                <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-accent">Heritage Delivery</AccordionTrigger>
                <AccordionContent className="text-sm text-primary/60 leading-relaxed italic">
                  Based in the heart of Kolkata, we offer hand-delivery exclusively within city limits to ensure your artisanal selection arrives in perfect, boutique-ready condition.
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
