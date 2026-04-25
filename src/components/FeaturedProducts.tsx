
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ShoppingBasket, ArrowRight } from 'lucide-react';
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

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      title: product.title || product.description,
      price: product.price,
      category: product.category || 'General',
      image: product.image || product.imageUrl
    });
    
    toast({
      title: "Treasure Selected",
      description: `${product.title || 'Item'} added to your basket.`,
    });
  };

  if (loading || !db) {
    return (
      <div className="py-60 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 text-center px-6">Preparing Our Collection...</p>
      </div>
    );
  }

  // Combine Firestore products with placeholders for a rich experience
  const displayProducts = [
    ...(products || []),
    ...productPlaceholders.map(p => ({
      id: p.id,
      title: p.description,
      price: p.price,
      category: p.category,
      image: p.imageUrl,
      imageHint: p.imageHint
    }))
  ].slice(0, 30); // Limit to top 30 items

  return (
    <section id="shop" className="py-24 sm:py-40 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 sm:mb-32 gap-12">
          <div className="max-w-xl reveal-on-scroll">
            <span className="text-accent font-bold text-[10px] uppercase tracking-[0.5em] mb-6 block">Our Creations</span>
            <h2 className="font-headline text-5xl sm:text-8xl text-primary leading-[0.9]">Seasonal <br /><span className="italic">Treasures</span></h2>
          </div>
          <div className="flex gap-8 sm:gap-12 overflow-x-auto pb-6 no-scrollbar border-b border-primary/10 reveal-on-scroll">
            {['All Items', 'Heirlooms', 'Creatures', 'Decor'].map((cat) => (
              <button 
                key={cat}
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-all pb-2"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 sm:gap-y-32">
          {displayProducts.map((product: any, idx: number) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group cursor-pointer reveal-on-scroll block"
              style={{ transitionDelay: `${idx % 3 * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-8 sm:mb-10 img-hover-zoom">
                <Image
                  src={product.image || product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={product.imageHint || "crochet"}
                />
                
                <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
                   <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-white text-primary p-5 shadow-2xl hover:bg-primary hover:text-white transition-all transform active:scale-90"
                   >
                     <ShoppingBasket className="w-5 h-5" />
                   </button>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-center">
                <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">{product.category || 'General'}</p>
                <div className="space-y-1">
                  <h3 className="font-headline text-2xl sm:text-3xl text-primary group-hover:opacity-60 transition-opacity leading-tight">{product.title}</h3>
                  <p className="font-bold text-primary/60 text-sm sm:text-base italic">₹ {Number(product.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="pt-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary/30 flex items-center justify-center gap-2 group-hover:text-accent transition-colors">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-32 sm:mt-48 text-center reveal-on-scroll">
          <button className="group inline-flex flex-col items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60">Portfolio Continues</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary/40 to-transparent group-hover:h-24 transition-all duration-700"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
