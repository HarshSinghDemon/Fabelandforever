
"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isLight?: boolean;
}

export function CartDrawer({ isLight }: CartDrawerProps) {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className={cn(
          "relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all active:scale-95 group",
          isLight 
            ? "bg-white text-primary hover:bg-white/90 shadow-xl" 
            : "bg-primary text-white hover:bg-primary/90"
        )}>
          <span className="flex items-center gap-2">
            <span className="hidden xs:inline">Basket</span> <ShoppingBasket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </span>
          {cartCount > 0 && (
            <span className={cn(
              "absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] border-2 shadow-sm font-bold animate-in zoom-in",
              isLight ? "bg-accent text-white border-white" : "bg-white text-primary border-primary"
            )}>
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background/98 backdrop-blur-2xl border-l border-primary/5">
        <SheetHeader className="pb-8 pr-12 border-b border-primary/5">
          <SheetTitle className="font-headline text-3xl text-primary flex items-center gap-3">
            Your Selections <ShoppingBag className="text-accent w-6 h-6" />
          </SheetTitle>
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/30 mt-1">Hand-Stitched Heritage</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-8 space-y-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <ShoppingBasket className="w-16 h-16 text-primary/20" />
              </div>
              <p className="text-primary/60 font-medium italic">"Your basket is currently as light as a cloud."</p>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full px-10 h-14 font-bold uppercase tracking-widest text-[10px]">Start Exploring</Button>
              </SheetTrigger>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="relative group bg-white/40 p-4 rounded-[2rem] border border-primary/5 flex gap-4 sm:gap-6 transition-all hover:shadow-lg">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted shrink-0 border border-primary/5">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="pr-10">
                    <h4 className="font-bold text-primary text-sm sm:text-base truncate leading-tight">{item.title}</h4>
                    <p className="text-[9px] text-accent font-bold uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-primary/5 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-primary/40 hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[11px] font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-primary/40 hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-primary text-sm">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                {/* Floating Delete Button - Positioned consistently for laptops and smartphones */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-primary/20 hover:text-destructive hover:scale-110 transition-all border border-primary/5"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-8 border-t border-primary/5 space-y-6">
            <div className="flex justify-between items-center text-2xl font-headline">
              <span className="text-primary/40">Total Magic</span>
              <span className="text-primary font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[9px] text-primary/40 uppercase tracking-[0.3em] font-bold text-center italic">
              "Weaving your forever loops with care"
            </p>
            <SheetTrigger asChild>
              <Button asChild className="w-full py-8 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-lg uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                <Link href="/checkout" className="flex items-center justify-center gap-4">
                  Checkout <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </SheetTrigger>
            <button 
              onClick={clearCart}
              className="w-full text-[9px] text-primary/20 hover:text-primary transition-colors uppercase tracking-[0.5em] font-bold pb-4"
            >
              Empty Basket
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
