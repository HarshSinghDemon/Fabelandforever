
"use client";

import React, { useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Package, ImageIcon, Loader2, Sparkles, ShieldAlert, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { uploadToSupabase } from '@/app/actions/supabase-upload';

export function AdminProductManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [envCheck, setEnvCheck] = useState<{ ok: boolean; missing: string[] }>({ ok: true, missing: [] });
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  // Check if Firebase keys are provided in .env
  useEffect(() => {
    const required = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    const missing = required.filter(key => !process.env[key]);
    setEnvCheck({ ok: missing.length === 0, missing });
  }, []);

  const productsQuery = React.useMemo(() => {
    return collection(db, 'products');
  }, [db]);

  const { data: products, loading } = useCollection(productsQuery);

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
        toast({ 
          title: "Visual Captured! ✨", 
          description: "Your treasure photo is safely stored in Supabase." 
        });
      } else {
        throw new Error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Upload Failed", 
        description: error.message || "Could not reach Supabase. Check your .env credentials."
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
        description: "Please provide a title, price, and image."
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
        description: `${productData.title} is now live in your boutique.` 
      });
    } catch (error: any) {
      console.error("Firestore Write Error:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.code === 'permission-denied' 
          ? "Check your Firestore Rules. You need to allow writes." 
          : error.message
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to unravel this creation?")) return;
    
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      toast({ title: "Treasure Unraveled" });
    } catch (error: any) {
      console.error("Delete Error:", error);
      toast({ variant: "destructive", title: "Unraveling Failed" });
    }
  };

  return (
    <div className="space-y-12">
      {!envCheck.ok && (
        <Alert variant="destructive" className="rounded-[2rem] p-8">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle className="font-bold">Missing Firebase Config</AlertTitle>
          <AlertDescription className="mt-2">
            You must add these to your .env file: {envCheck.missing.join(', ')}.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="bg-amber-50 border-amber-200 rounded-[2rem] p-8">
        <ShieldAlert className="h-6 w-6 text-amber-600" />
        <AlertTitle className="text-amber-800 font-bold ml-2">Database Access Note</AlertTitle>
        <AlertDescription className="text-amber-700/80 ml-2 mt-2">
          If items don't appear after saving, go to the <a href="https://console.firebase.google.com/project/fabel-57315/firestore/rules" target="_blank" className="underline font-bold">Firebase Rules</a> tab and ensure your rules allow reads and writes.
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
                  placeholder="Image URL..." 
                  value={formData.image}
                  readOnly
                  className="h-14 rounded-2xl border-2 border-primary/5 bg-muted/20 flex-1 overflow-hidden text-ellipsis"
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
                placeholder="Once upon a time..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="h-14 rounded-2xl border-2 border-primary/5 focus:border-accent"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={adding || uploading || !formData.image}
              className="md:col-span-2 h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01]"
            >
              {adding ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {adding ? "Binding Threads..." : "Cast the Creation Spell"}
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
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : products.length === 0 ? (
          <div className="p-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10 text-center italic text-muted-foreground">
            Your inventory is empty. Loom your first treasure above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="group border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all">
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
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xl text-primary">{product.title}</h4>
                      <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
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
