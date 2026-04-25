
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
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
      category: product.category || 'Enchanted',
      image: product.image || productPlaceholders[0].imageUrl
    });
    toast({
      title: "Added to Basket",
      description: `${product.title} has joined your collection.`,
    });
  };

  if (loading || !db) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Loading Treasures...</p>
      </div>
    );
  }

  // If no products in DB, show curated placeholders for a better "First Look"
  const displayProducts = products && products.length > 0 
    ? products 
    : productPlaceholders.map((p, i) => ({
        id: `placeholder-${i}`,
        title: p.description.split('.')[0],
        price: 1500 + (i * 200),
        category: i % 2 === 0 ? 'Creatures' : 'Lifestyle',
        image: p.imageUrl,
        imageHint: p.imageHint
      }));

  return (
    <section id="shop" className="py-24 sm:py-40 bg-background">
      <div className="container mx-auto px-6">
        
        {/* Category Header (Floriy Dynamic) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">The Loom Report</span>
            <h2 className="font-headline text-4xl sm:text-6xl text-primary leading-tight">Hand-stitched <br /><span className="italic">curations.</span></h2>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
            {['All', 'Creatures', 'Guardians', 'Lifestyle'].map((cat) => (
              <button 
                key={cat}
                className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors pb-1 border-b-2 border-transparent hover:border-primary"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {displayProducts.map((product: any, idx: number) => (
            <div key={product.id} className="group cursor-pointer block">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-8 img-hover-zoom">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={product.imageHint || "crochet"}
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 p-4">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="bg-white text-primary text-[10px] font-bold uppercase tracking-widest px-8 h-12 w-full max-w-[200px] shadow-2xl hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                   >
                     Quick Add +
                   </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-primary">{product.title}</h3>
                  <span className="font-medium text-primary/60">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">{product.category || 'Enchanted'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-24 text-center">
          <button className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-primary group">
            Explore Full Boutique <div className="w-12 h-[1px] bg-primary/20 group-hover:w-20 transition-all"></div> <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
