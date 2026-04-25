
"use client";

import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: dbProducts } = useCollection(productsQuery);

  const allItems = React.useMemo(() => {
    const items = [
      ...(dbProducts || []),
      ...PlaceHolderImages.filter(p => p.category !== 'Hero' && p.category !== 'Banner').map(p => ({
        id: p.id,
        title: p.description,
        price: p.price,
        category: p.category,
        image: p.imageUrl,
        description: p.story
      }))
    ];
    return items;
  }, [dbProducts]);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(allItems.map(item => item.category)));
    return cats.sort();
  }, [allItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [allItems]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
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

  return (
    <main className="min-h-screen bg-paper selection:bg-accent/20">
      <Navigation />
      
      {/* Shop Hero */}
      <section className="pt-48 pb-24 border-b border-primary/5">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="reveal-on-scroll">
            <span className="text-accent font-bold tracking-[1em] uppercase text-[9px] mb-8 block">Boutique</span>
            <h1 className="font-headline text-6xl sm:text-8xl text-primary leading-none mb-8 tracking-tighter">
              The <span className="italic">Catalog.</span>
            </h1>
            <p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-[10px] max-w-md mx-auto">
              Every loop has a name. Every stitch tells a story.
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar - Sticky */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4 overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-6 flex justify-center gap-8 min-w-max">
          {categories.map((cat) => (
            <a 
              key={cat} 
              href={`#${cat.toLowerCase()}`}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40 hover:text-accent transition-colors whitespace-nowrap"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      <div className="pb-32">
        {categories.map((category, catIdx) => {
          const catProducts = allItems.filter(p => p.category === category);
          return (
            <section 
              key={category} 
              id={category.toLowerCase()} 
              className={cn(
                "py-24 border-b border-primary/5 scroll-mt-32",
                catIdx % 2 === 1 ? "bg-white/30" : "bg-transparent"
              )}
            >
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 reveal-on-scroll">
                  <div className="space-y-4">
                    <span className="text-accent font-bold tracking-[0.5em] uppercase text-[9px]">Collection</span>
                    <h2 className="font-headline text-4xl sm:text-6xl text-primary">{category}</h2>
                  </div>
                  <p className="text-primary/40 text-xs italic max-w-xs md:text-right">
                    "Curated treasures crafted with {category.toLowerCase()} in mind, ensuring a legacy of comfort."
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                  {catProducts.map((product, idx) => (
                    <div 
                      key={product.id} 
                      className="group space-y-6 reveal-on-scroll"
                      style={{ transitionDelay: `${idx * 0.1}s` }}
                    >
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[2rem] shadow-sm transition-all duration-1000 group-hover:shadow-2xl border border-primary/5 stitching-border">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                      </Link>
                      
                      <div className="space-y-4 text-center px-2">
                        <div className="space-y-1">
                          <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate text-[10px] md:text-xs tracking-[0.1em] uppercase">{product.title}</h3>
                          <p className="font-bold text-primary/40 text-[9px] md:text-[11px] tracking-widest italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <Button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full h-10 md:h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[8px] md:text-[9px] transition-all active:scale-95 shadow-lg"
                        >
                          Add To Basket
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
