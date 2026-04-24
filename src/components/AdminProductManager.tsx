"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Package, DollarSign, Tag, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

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

  const productsQuery = React.useMemo(() => {
    return query(collection(db, 'products'), orderBy('title', 'asc'));
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const result = await uploadToSupabase(uploadFormData);
    if (result.success) {
      setFormData({ ...formData, image: result.url || '' });
      toast({ title: "Image Loomed! ✨", description: "Your product visual is ready." });
    } else {
      toast({ variant: "destructive", title: "Upload Failed", description: result.error });
    }
    setUploading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    setAdding(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', price: '', category: '', image: '', description: '' });
      toast({ title: "Product Created", description: "A new treasure has been added to the loom." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add product." });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this piece from existence?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Product Removed", description: "The piece has been unraveled." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not remove product." });
    }
  };

  return (
    <div className="space-y-12">
      {/* Add Product Form */}
      <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Plus className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-headline text-3xl text-primary">Add New Treasure</h3>
          </div>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Product Name</Label>
              <Input 
                placeholder="e.g., Starry Night Shawl" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
                required
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Price (USD)</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
                required
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Category</Label>
              <Input 
                placeholder="e.g., Guardian, Creature, Accessory" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Product Image</Label>
              <div className="flex gap-4">
                <Input 
                  placeholder="URL or upload file" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent flex-1"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    accept="image/*"
                  />
                  <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-2 border-primary/5">
                    {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Story / Description</Label>
              <Input 
                placeholder="Tell the tale of this creation..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            <Button 
              type="submit" 
              disabled={adding || uploading}
              className="md:col-span-2 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              {adding ? "Weaving into database..." : "Cast Product Spell"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Package className="text-accent w-6 h-6" />
            <h3 className="font-headline text-3xl text-primary">Live Inventory</h3>
          </div>
          <span className="bg-white/50 border border-primary/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
            {products.length} Items Listed
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="group border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-0 flex items-center h-48">
                  <div className="relative w-40 h-full">
                    <Image 
                      src={product.image || "https://picsum.photos/seed/tale/400/400"} 
                      alt={product.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-xl text-primary leading-tight">{product.title}</h4>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-primary/20 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Tag className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{product.category || 'Bespoke'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {Number(product.price).toFixed(2)}
                      </span>
                      <Sparkles className="w-4 h-4 text-primary/10 group-hover:text-accent transition-colors" />
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