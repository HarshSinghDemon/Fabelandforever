
"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ImageIcon, Loader2, Sparkles } from 'lucide-react';
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

  const productsCollection = useMemoFirebase(() => collection(db, 'products'), [db]);
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
        toast({ title: "Visual Captured! ✨", description: "Your crochet treasure photo is safely stored." });
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
      toast({ variant: "destructive", title: "Incomplete Spell", description: "Title, price, and image are required." });
      return;
    }

    setAdding(true);
    const data = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim() || 'Bespoke',
      image: formData.image,
      description: formData.description.trim(),
      createdAt: new Date().toISOString()
    };

    addDoc(productsCollection, data)
      .then(() => {
        setFormData({ title: '', price: '', category: '', image: '', description: '' });
        toast({ title: "Magic Manifested! ✨", description: "Item is now live in the boutique." });
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
    if (!confirm("Unravel this creation?") || !db) return;
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
    <div className="space-y-12">
      <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Plus className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-headline text-3xl text-primary">Stitch a New Treasure</h3>
          </div>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Treasure Name</Label>
              <Input 
                placeholder="e.g., Lavender Sprite Toy" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
                required
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Price (₹ INR)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
                required
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Category</Label>
              <Input 
                placeholder="e.g., Creature, Accessory" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Treasure Visual</Label>
              <div className="flex gap-4">
                <Input 
                  placeholder="Upload a photo..." 
                  value={formData.image}
                  readOnly
                  className="h-14 rounded-2xl border-2 border-primary/5 bg-muted/20 flex-1 truncate"
                />
                <div className="relative">
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" disabled={uploading} />
                  <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-2 border-primary/5 shadow-sm">
                    {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">The Item's Story</Label>
              <Input 
                placeholder="Once upon a time..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={adding || uploading || !formData.image}
              className="md:col-span-2 h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95"
            >
              {adding ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {adding ? "Binding Loops..." : "Cast the Creation Spell"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <h3 className="font-headline text-3xl text-primary">Live Inventory</h3>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : !products || products.length === 0 ? (
          <div className="p-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10 text-center italic text-muted-foreground">
            Your inventory is empty. Stitch your first treasure above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-2xl transition-all">
                <CardContent className="p-0 flex items-center h-48">
                  <div className="relative w-40 h-full bg-muted">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.title} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xl text-primary">{product.title}</h4>
                      <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-bold uppercase text-accent bg-accent/10 px-3 py-1 rounded-full">{product.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
