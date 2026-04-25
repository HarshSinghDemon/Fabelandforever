"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Package, LayoutGrid, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  'Flowers',
  'Amigurumi',
  'Bag charm',
  'Hair accessories',
  'Bandana',
  'Ribbon bouquet'
];

export function AdminProductManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: products, isLoading } = useCollection(productsQuery);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.image || !db) {
      toast({ variant: "destructive", title: "Missing Details", description: "Please complete all fields including a photo." });
      return;
    }

    setIsSubmitting(true);
    const productId = `prod-${Date.now()}`;
    const productRef = doc(db, 'products', productId);

    try {
      await setDoc(productRef, {
        ...newProduct,
        id: productId,
        price: Number(newProduct.price),
        createdAt: new Date().toISOString()
      });
      
      setNewProduct({ title: '', price: '', category: '', description: '', image: '' });
      toast({ title: "Creation Added ✨", description: `${newProduct.title} is now in the boutique.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not add creation." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to remove this loop?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Removed", description: "Selection has been withdrawn from the boutique." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not remove selection." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Add Product Form */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-primary/5 stitching-border sticky top-32">
          <h3 className="font-headline text-3xl text-primary mb-8 flex items-center gap-3">
            <Plus className="w-6 h-6 text-accent" /> New Creation
          </h3>

          <form onSubmit={handleAddProduct} className="space-y-6">
            <SupabaseImageUpload 
              label="Product Photo"
              currentImageUrl={newProduct.image}
              onUploadSuccess={(url) => setNewProduct({ ...newProduct, image: url })}
            />

            <div className="space-y-4">
              <Input 
                placeholder="Product Title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="number"
                  placeholder="Price (₹)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm"
                />
                <Select 
                  value={newProduct.category} 
                  onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}
                >
                  <SelectTrigger className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-[10px] font-bold uppercase tracking-widest py-3">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea 
                placeholder="The Stitch Story..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="bg-paper border-none min-h-[120px] p-6 rounded-[2rem] font-medium text-sm italic"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Add to Boutique"}
            </Button>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="lg:col-span-7 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-3xl text-primary flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-accent" /> Active Boutique
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
            {products?.length || 0} Pieces
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
        ) : products?.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-primary/5 rounded-[3rem] text-primary/20 italic font-medium">
            "The boutique is currently empty. Start weaving."
          </div>
        ) : (
          <div className="grid gap-6">
            {products?.map((prod) => (
              <div key={prod.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-primary/5 flex gap-6 items-center group">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-paper shrink-0 shadow-inner">
                  <Image src={prod.image} alt={prod.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {prod.category}
                    </span>
                    <span className="font-bold text-primary/60 text-xs">₹ {prod.price.toLocaleString('en-IN')}</span>
                  </div>
                  <h4 className="font-headline text-xl text-primary truncate">{prod.title}</h4>
                </div>
                <button 
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-primary/20 hover:text-destructive hover:bg-destructive/5 transition-all active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}