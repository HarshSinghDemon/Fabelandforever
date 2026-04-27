
"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background p-0 border-l border-primary/5 z-[150]">
        {/* Header Ritual */}
        <SheetHeader className="p-8 md:p-10 border-b border-primary/5 relative flex flex-row items-center justify-between bg-white">
          <div className="flex flex-col">
            <SheetTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3 font-black">
              Selections <ShoppingBag className="text-accent w-6 h-6 md:w-8 md:h-8" />
            </SheetTitle>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 mt-2">Hand-Stitched Heritage</p>
          </div>
        </SheetHeader>

        {/* Scrollable Scroll */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 no-scrollbar bg-paper">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full flex items-center justify-center mb-4 animate-float">
                <ShoppingBasket className="w-10 h-10 md:w-14 md:h-14 text-primary/10" />
              </div>
              <p className="text-primary/60 font-black italic text-lg leading-relaxed">"Your basket is currently as light as a cloud."</p>
              <SheetClose asChild>
                <Button variant="outline" className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-[9px] border-primary/10 text-primary hover:bg-primary hover:text-white transition-all">Start Exploring</Button>
              </SheetClose>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="relative bg-white p-5 rounded-[2.5rem] border border-primary/5 flex gap-4 md:gap-6 shadow-sm hover:shadow-md transition-all group/item">
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden bg-muted shrink-0 border border-primary/5 shadow-inner">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover/item:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-8">
                  <div>
                    <h4 className="font-black text-primary text-sm md:text-base truncate leading-tight uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[9px] text-accent font-black uppercase tracking-widest mt-1.5">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-paper rounded-full px-2 py-1 border border-primary/5 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 text-primary/40 hover:text-accent transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-[12px] font-black text-primary">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 text-primary/40 hover:text-accent transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-black text-primary text-sm md:text-base">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-paper shadow-sm rounded-full flex items-center justify-center text-primary/20 hover:bg-rose-50 hover:text-rose-600 hover:scale-110 transition-all border border-primary/5 hover:border-rose-100"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total Ritual */}
        {cart.length > 0 && (
          <div className="p-8 md:p-10 border-t border-primary/5 space-y-6 bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.03)] pb-12">
            <div className="flex justify-between items-center text-2xl md:text-4xl font-headline font-black">
              <span className="text-primary/30 italic">Total Magic</span>
              <span className="text-primary">₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <SheetClose asChild>
              <Button asChild className="w-full h-16 md:h-20 rounded-full bg-primary hover:bg-primary/95 text-white font-black text-lg uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group">
                <Link href="/checkout" className="flex items-center justify-center gap-4">
                  Proceed to Manifest <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </SheetClose>
            <div className="text-center">
              <button 
                onClick={clearCart}
                className="text-[8px] text-primary/20 hover:text-destructive transition-colors uppercase tracking-[0.6em] font-black"
              >
                Empty Entire Basket
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
