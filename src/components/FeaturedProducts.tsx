"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Sparkles, Loader2, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  // Reference to the 'products' collection
  const productsQuery = React.useMemo(() => {
    return collection(db, 'products');
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category || 'Enchanted',
      image: product.image || "https://picsum.photos/seed/tale/600/800"
    });
    toast({
      title: "Basket Blessed! ✨",
      description: `${product.title} has joined your collection.`,
    });
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">Calling the Threads...</p>
      </div>
    );
  }

  return (
    <section id="shop" className="py-32 relative overflow-hidden bg-white/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-block p-4 bg-accent/40 rounded-full mb-8 relative">
             <Star className="text-primary fill-primary w-6 h-6 relative z-10" />
          </div>
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block">The Latest Looms</span>
          <h2 className="font-fancy text-6xl md:text-7xl text-primary mb-8">Ethereal Keepsakes</h2>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-24 p-12 md:p-32 border-4 border-dashed border-primary/10 rounded-[5rem] bg-white/60 max-w-5xl mx-auto shadow-inner">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-10 opacity-50 animate-pulse" />
            <p className="text-primary/70 italic text-3xl font-medium leading-relaxed max-w-2xl mx-auto">
              "The boutique shelves are resting... once you loom items in your portal, they will manifest here instantly."
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {products.map((product: any) => (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-visible">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4rem] mb-10 border-[15px] border-white shadow-2xl transition-all duration-700 group-hover:-translate-y-6 hover:shadow-primary/20">
                    <Image
                      src={product.image || "https://picsum.photos/seed/tale/600/800"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  <div className="text-center px-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">{product.category}</span>
                    </div>
                    <h3 className="font-bold text-3xl text-primary mb-4 leading-tight group-hover:text-accent transition-colors">{product.title}</h3>
                    <p className="text-primary font-bold text-2xl mb-10">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-white font-bold px-14 py-5 rounded-[2rem] text-sm hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-primary/30 active:scale-95 group/btn"
                    >
                      Adopt Treasure <ShoppingCart className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}