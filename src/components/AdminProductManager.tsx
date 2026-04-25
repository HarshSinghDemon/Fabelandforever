
"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ImageIcon, Loader2, Sparkles, Package, IndianRupee, Tag, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadToSupabase } from '@/app/actions/supabase-upload';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function AdminProductManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  const productsCollection = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'products');
  }, [db]);

  const { data: products, loading } = useCollection(productsCollection);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const result = await uploadToSupabase(uploadFormData);
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url! }));
        toast({ title: "Visual Captured ✨", description: "Product visual stored in the cloud." });
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image || !productsCollection) {
      toast({ variant: "destructive", title: "Incomplete Spell", description: "Please fill all required threads." });
      return;
    }

    setAdding(true);
    const data = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim() || 'Uncategorized',
      image: formData.image,
      description: formData.description.trim(),
      createdAt: new Date().toISOString()
    };

    addDoc(productsCollection, data)
      .then(() => {
        setFormData({ title: '', price: '', category: '', image: '', description: '' });
        toast({ title: "Treasure Manifested ✨", description: "Item is live in the boutique." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: productsCollection.path,
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Unravel this treasure forever?")) return;
    if (!db) return;

    const docRef = doc(db, 'products', id);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Treasure Unraveled" });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="space-y-16">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-primary/5 rounded-2xl">
            <Plus className="text-primary w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-3xl text-primary">Stitch New Treasure</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mt-1">Add to your live inventory</p>
          </div>
        </div>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Product Title</Label>
              <Input 
                placeholder="e.g., Lavender Forest Dragon" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-16 rounded-3xl border-2 border-primary/5 focus:border-accent px-8"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Price (INR)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="h-16 rounded-3xl border-2 border-primary/5 focus:border-accent pl-14"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Collection</Label>
                <Input 
                  placeholder="e.g., Creatures" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="h-16 rounded-3xl border-2 border-primary/5 focus:border-accent px-8"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">The Story Behind (Description)</Label>
              <Textarea 
                placeholder="Once upon a stitch..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[150px] rounded-[2.5rem] border-2 border-primary/5 focus:border-accent p-8 leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/40 ml-4">Treasure Visual</Label>
              <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-paper border-2 border-dashed border-primary/10 group">
                {formData.image ? (
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/10 gap-4">
                    <ImageIcon className="w-16 h-16" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Image Selected</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" disabled={uploading} />
                  <Button type="button" variant="secondary" className="rounded-full px-8 pointer-events-none">
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : <ImageIcon className="mr-2" />}
                    {uploading ? "Uploading..." : "Change Visual"}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={adding || uploading || !formData.image}
              className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 active:scale-95"
            >
              {adding ? <Loader2 className="animate-spin mr-3" /> : <Sparkles className="mr-3 h-5 w-5" />}
              {adding ? "Binding Threads..." : "Manifest Treasure ✨"}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Package className="text-accent w-6 h-6" />
            <h3 className="font-headline text-3xl text-primary">Live Inventory</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
            {products?.length || 0} items in boutique
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
        ) : !products || products.length === 0 ? (
          <div className="p-32 bg-white/60 rounded-[4rem] border-2 border-dashed border-primary/10 text-center italic text-muted-foreground text-xl">
            "Your boutique is empty. Let's stitch your first treasure above."
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col">
                <div className="relative aspect-square bg-paper">
                  <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-sm text-destructive rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full">{product.category}</span>
                    <h4 className="font-bold text-xl text-primary leading-tight">{product.title}</h4>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <span className="font-bold text-primary text-lg">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">In Stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
