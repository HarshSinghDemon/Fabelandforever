"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative bg-primary text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md group active:scale-95">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden xs:inline">Basket</span> <ShoppingBasket className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] border-2 border-white shadow-sm font-bold animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="font-fancy text-3xl text-primary flex items-center gap-3">
            Your Treasures <ShoppingBag className="text-accent" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <ShoppingBasket className="w-12 h-12 text-primary/40" />
              </div>
              <p className="text-muted-foreground font-medium">Your basket is currently as light as a cloud!</p>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full px-8">Browse Shop</Button>
              </SheetTrigger>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted border-2 border-accent/20">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    <p className="text-xs text-accent font-bold uppercase tracking-wider">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-muted/50 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-primary">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-6 border-t space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-primary">Total Magic:</span>
              <span className="text-primary">₹ {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">
              * Hand-stitched with love. Free shipping on orders over ₹2000!
            </p>
            <SheetTrigger asChild>
              <Button asChild className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20">
                <Link href="/checkout">
                  Checkout Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </SheetTrigger>
            <button 
              onClick={clearCart}
              className="w-full text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest font-bold"
            >
              Clear Basket
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
