"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  const productsQuery = React.useMemo(() => {
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
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
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-accent font-bold uppercase tracking-widest text-[10px]">Peering into the Hollow...</p>
      </div>
    );
  }

  return (
    <section id="shop" className="py-32 relative overflow-hidden bg-white/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-block p-4 bg-accent/40 rounded-full mb-8 relative">
             <div className="absolute inset-0 bg-accent/60 rounded-full animate-ping opacity-20"></div>
             <Star className="text-primary fill-primary w-6 h-6 relative z-10" />
          </div>
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block">The Latest Looms</span>
          <h2 className="font-fancy text-6xl md:text-7xl text-primary mb-8">Ethereal Keepsakes</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 p-20 border-2 border-dashed border-primary/10 rounded-[4rem] bg-white/50">
            <p className="text-muted-foreground italic text-xl">
              "The shelves are currently light as a cloud. Add treasures in the admin portal to fill them!"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {products.map((product: any) => (
              <Card key={product.id} className="group border-none shadow-none bg-transparent overflow-visible">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] mb-10 border-[12px] border-white shadow-xl transition-all duration-700 group-hover:-translate-y-4">
                    <Image
                      src={product.image || "https://picsum.photos/seed/tale/600/800"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-3 h-3 text-accent" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{product.category}</span>
                    </div>
                    <h3 className="font-bold text-3xl text-primary mb-3">{product.title}</h3>
                    <p className="text-primary/70 font-bold text-xl mb-8">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-white font-bold px-12 py-4 rounded-[1.5rem] text-sm hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                    >
                      Adopt Treasure <ShoppingCart className="w-4 h-4" />
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