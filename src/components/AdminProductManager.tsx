"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Package, Tag, Image as ImageIcon, Loader2, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
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
          title: "Visual Captured! ✨", 
          description: "Your treasure photo is safely stored in Supabase." 
        });
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadError(error.message);
      toast({ 
        variant: "destructive", 
        title: "Upload Failed", 
        description: error.message 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.image) {
      toast({
        variant: "destructive",
        title: "Incomplete Spell",
        description: "Please provide a title, price, and image to cast this treasure."
      });
      return;
    }

    setAdding(true);
    
    try {
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim() || 'Bespoke',
        image: formData.image,
        description: formData.description.trim(),
        createdAt: new Date().toISOString()
      };

      const productsRef = collection(db, 'products');
      await addDoc(productsRef, productData);

      setFormData({ title: '', price: '', category: '', image: '', description: '' });
      toast({ 
        title: "Magic Manifested! ✨", 
        description: `${productData.title} has been added to your inventory.` 
      });
    } catch (error: any) {
      console.error("Firestore Write Error:", error);
      const permissionError = new FirestorePermissionError({
        path: 'products',
        operation: 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
      
      toast({
        variant: "destructive",
        title: "Database Blocked",
        description: "Firestore rejected the save. Check your Security Rules in the console."
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to unravel this creation? This cannot be undone.")) return;
    
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      toast({ title: "Treasure Unraveled", description: "The item has been removed from your shop." });
    } catch (error: any) {
      console.error("Delete Error:", error);
      const permissionError = new FirestorePermissionError({
        path: `products/${id}`,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <div className="space-y-12">
      {/* Security Rule Helper */}
      <Alert className="bg-amber-50 border-amber-200 rounded-[2rem] p-8">
        <ShieldAlert className="h-6 w-6 text-amber-600" />
        <AlertTitle className="text-amber-800 font-bold ml-2">Database Access Note</AlertTitle>
        <AlertDescription className="text-amber-700/80 ml-2 mt-2">
          If your items don't save, ensure your <b>Firestore Rules</b> allow writes. 
          Go to <a href="https://console.firebase.google.com/project/fabel-57315/firestore/rules" target="_blank" className="underline font-bold">Firebase Rules</a> and set: 
          <code className="block mt-2 p-2 bg-amber-100 rounded text-xs">allow read, write: if request.auth != null;</code>
        </AlertDescription>
      </Alert>

      <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Plus className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-headline text-3xl text-primary">Loom a New Treasure</h3>
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
                placeholder="e.g., Creature, Guardian, Accessory" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">Treasure Visual</Label>
              <div className="flex gap-4">
                <Input 
                  placeholder="Paste URL or upload..." 
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
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/50 ml-4">The Item's Story</Label>
              <Input 
                placeholder="Once upon a time, this yarn became..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={adding || uploading}
              className="md:col-span-2 h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              {adding ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> Binding Threads...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Cast the Creation Spell
                </div>
              )}
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
            {products.length} Items on the Shelves
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10 text-center italic text-muted-foreground">
            No treasures found in the loom. Start by creating one above!
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
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{product.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-primary">₹ {Number(product.price).toLocaleString('en-IN')}</span>
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