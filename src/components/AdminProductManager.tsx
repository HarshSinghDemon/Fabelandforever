"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Package, Tag, Image as ImageIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

export function AdminProductManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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

    setUploadError(null);
    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const result = await uploadToSupabase(uploadFormData);
      
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url! }));
        toast({ 
          title: "Image Loomed! ✨", 
          description: "Your treasure visual is now safe in Supabase." 
        });
      } else {
        throw new Error(result.error || "Failed to upload to Supabase");
      }
    } catch (error: any) {
      console.error("Supabase Upload Error:", error);
      setUploadError(error.message);
      toast({ 
        variant: "destructive", 
        title: "Supabase Looming Failed", 
        description: error.message 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      toast({
        variant: "destructive",
        title: "Missing Threads",
        description: "Please provide a title, price, and image to finish the piece."
      });
      return;
    }

    setAdding(true);
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      createdAt: new Date().toISOString()
    };

    const productsRef = collection(db, 'products');

    addDoc(productsRef, productData)
      .then(() => {
        setFormData({ title: '', price: '', category: '', image: '', description: '' });
        toast({ title: "Product Created", description: "A new treasure has been added to the loom." });
        setAdding(false);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: productsRef.path,
          operation: 'create',
          requestResourceData: productData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setAdding(false);
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this piece from existence?")) return;
    
    const docRef = doc(db, 'products', id);
    
    deleteDoc(docRef)
      .then(() => {
        toast({ title: "Product Removed", description: "The piece has been unraveled." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
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
            <h3 className="font-headline text-3xl text-primary">Add New Treasure</h3>
          </div>

          {uploadError && (
            <Alert variant="destructive" className="mb-8 rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Supabase Problem</AlertTitle>
              <AlertDescription>
                {uploadError}. Ensure your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in the .env file.
              </AlertDescription>
            </Alert>
          )}

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
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Price (INR)</Label>
              <Input 
                type="number" 
                step="1"
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
                placeholder="e.g., Guardian, Creature, Accessory" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Product Image (Supabase)</Label>
              <div className="flex gap-4">
                <Input 
                  placeholder="Image URL" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent flex-1"
                  required
                />
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    accept="image/*"
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" className="h-14 w-14 rounded-2xl border-2 border-primary/5 relative">
                    {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </Button>
                </div>
              </div>
              {formData.image && (
                <div className="mt-2 text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Image Loomed Successfully
                </div>
              )}
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
              className="md:col-span-2 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              {adding ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> Weaving into database...
                </div>
              ) : "Cast Product Spell"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
                  <div className="relative w-40 h-full bg-muted">
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
                        ₹ {Number(product.price).toLocaleString('en-IN')}
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
