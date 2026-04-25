"use client";

import React from 'react';
import Image from 'next/image';
import { Loader2, ShoppingBasket } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const productPlaceholders = PlaceHolderImages.filter(img => img.id.startsWith('product-'));

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || 'General',
      image: product.image || productPlaceholders[0].imageUrl
    });
    toast({
      title: "Treasure Selected",
      description: `${product.title} added to your basket.`,
    });
  };

  if (loading || !db) {
    return (
      <div className="py-60 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30">Preparing Collection</p>
      </div>
    );
  }

  const displayProducts = products && products.length > 0 
    ? products 
    : productPlaceholders.map((p, i) => ({
        id: `placeholder-${i}`,
        title: p.description.split('.')[0],
        price: 1800 + (i * 300),
        category: i % 2 === 0 ? 'Home' : 'Art',
        image: p.imageUrl,
        imageHint: p.imageHint
      }));

  return (
    <section id="shop" className="py-40 bg-background">
      <div className="container mx-auto px-6">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
          <div className="max-w-xl">
            <span className="text-accent font-bold text-[10px] uppercase tracking-[0.5em] mb-6 block">Curated Series</span>
            <h2 className="font-headline text-6xl sm:text-8xl text-primary leading-none">Seasonal <br /><span className="italic">Treasures</span></h2>
          </div>
          <div className="flex gap-12 overflow-x-auto pb-6 no-scrollbar border-b border-primary/10">
            {['All Items', 'Heirlooms', 'Miniatures', 'Decor'].map((cat) => (
              <button 
                key={cat}
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-all pb-2 hover:scale-105"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Product Spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
          {displayProducts.map((product: any, idx: number) => (
            <div 
              key={product.id} 
              className="group cursor-pointer reveal-on-scroll"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-10 img-hover-zoom">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={product.imageHint || "crochet"}
                />
                
                {/* Action Button */}
                <div className="absolute bottom-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="bg-white text-primary p-6 shadow-2xl hover:bg-primary hover:text-white transition-all transform active:scale-90"
                    aria-label="Add to basket"
                   >
                     <ShoppingBasket className="w-5 h-5" />
                   </button>
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">{product.category || 'General'}</p>
                <div className="space-y-2">
                  <h3 className="font-headline text-3xl text-primary group-hover:opacity-60 transition-opacity">{product.title}</h3>
                  <p className="font-bold text-primary/60 text-base italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Link */}
        <div className="mt-40 text-center">
          <button className="group inline-flex flex-col items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60">See Entire Portfolio</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary/40 to-transparent group-hover:h-24 transition-all duration-700"></div>
          </button>
        </div>
      </div>
    </section>
  );
}