"use client";

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { SupabaseImageUpload } from './SupabaseImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Package, 
  Loader2, 
  Sparkles, 
  Search, 
  EyeOff,
  Star,
  Edit3,
  X,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  'Flowers',
  'Amigurumi',
  'Bag charm',
  'Hair accessories',
  'Bandana',
  'Ribbon bouquet'
];

interface ProductForm {
  name: string;
  price: string;
  category: string;
  description: string;
  stockQuantity: string;
  tags: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isPublished: boolean;
  imageUrls: string[];
}

type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low';

export function AdminProductManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const initialForm: ProductForm = {
    name: '',
    price: '',
    category: '',
    description: '',
    stockQuantity: '1',
    tags: '',
    isFeatured: false,
    isBestseller: false,
    isPublished: true,
    imageUrls: []
  };

  const [formData, setFormData] = useState<ProductForm>(initialForm);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, isLoading } = useCollection(productsQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high': return b.price - a.price;
        case 'price-low': return a.price - b.price;
        default: return 0;
      }
    });

    return result;
  }, [products, searchQuery, filterCategory, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.imageUrls.length || !db) {
      toast({ variant: "destructive", title: "Incomplete Loom", description: "Missing mandatory fields." });
      return;
    }

    setIsSubmitting(true);
    const productId = editingId || `prod-${Date.now()}`;
    const productRef = doc(db, 'products', productId);

    const submissionData = {
      ...formData,
      id: productId,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      updatedAt: new Date().toISOString(),
      createdAt: editingId ? (products?.find(p => p.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    try {
      await setDoc(productRef, submissionData, { merge: true });
      setFormData(initialForm);
      setEditingId(null);
      toast({ title: editingId ? "Loop Refined ✨" : "New Creation Added ✨", description: `${formData.name} is stored.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Magic Glitch", description: "Could not update boutique." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stockQuantity: product.stockQuantity?.toString() || '1',
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      isPublished: product.isPublished !== undefined ? product.isPublished : true,
      imageUrls: product.imageUrls || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!db || !window.confirm("Are you sure?")) return;
    deleteDocumentNonBlocking(doc(db, 'products', id));
    toast({ title: "Unraveled", description: "The piece has been withdrawn." });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-primary/5 stitching-border sticky top-32">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-headline text-3xl text-primary flex items-center gap-3">
              {editingId ? <Edit3 className="w-6 h-6 text-accent" /> : <Plus className="w-6 h-6 text-accent" />}
              {editingId ? "Refine Creation" : "New Creation"}
            </h3>
            {editingId && (
              <button onClick={() => { setEditingId(null); setFormData(initialForm); }} className="text-[10px] font-black uppercase tracking-widest text-primary/30 hover:text-destructive px-5 py-2 bg-paper rounded-full transition-all">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden border border-primary/5 shadow-inner">
                  <Image src={url} alt="Gallery" fill className="object-cover" />
                  <button type="button" onClick={() => setFormData(p => ({...p, imageUrls: p.imageUrls.filter((_, i) => i !== idx)}))} className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {formData.imageUrls.length < 4 && (
                <SupabaseImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, url] }))} className="aspect-square" />
              )}
            </div>

            <div className="space-y-5">
              <Input placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-paper border-none h-14 px-6 rounded-2xl font-black text-sm shadow-inner" />
              <div className="grid grid-cols-2 gap-5">
                <Input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-paper border-none h-14 px-6 rounded-2xl font-black text-sm shadow-inner" />
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="bg-paper border-none h-14 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-inner"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent className="rounded-2xl">{CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="text-[10px] font-black uppercase tracking-widest">{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Textarea placeholder="The Stitch Story..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-paper border-none min-h-[140px] p-6 rounded-3xl font-medium text-sm italic shadow-inner" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-5 bg-paper rounded-3xl border border-primary/5 shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Bestseller</span>
                  <Switch checked={formData.isBestseller} onCheckedChange={(val) => setFormData({ ...formData, isBestseller: val })} />
                </div>
                <div className="flex items-center justify-between p-5 bg-paper rounded-3xl border border-primary/5 shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Published</span>
                  <Switch checked={formData.isPublished} onCheckedChange={(val) => setFormData({ ...formData, isPublished: val })} />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl group transition-all">
              {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : <div className="flex items-center gap-3">{editingId ? "Finalize Ritual" : "Add to Boutique"} <Sparkles className="w-6 h-6 group-hover:rotate-45 transition-transform" /></div>}
            </Button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-primary/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-4xl text-primary">Gallery</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 px-6 py-2 bg-paper rounded-full shadow-inner">{filteredProducts.length} Selections</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 rounded-full bg-paper border-none text-xs font-black shadow-inner" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-14 rounded-full bg-paper border-none text-[10px] font-black uppercase tracking-widest px-6 shadow-inner"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="rounded-2xl"><SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All</SelectItem>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat} className="text-[10px] font-black uppercase tracking-widest">{cat}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger className="h-14 rounded-full bg-paper border-none text-[10px] font-black uppercase tracking-widest px-6 shadow-inner"><div className="flex items-center gap-2"><ArrowUpDown className="w-3 h-3" /><SelectValue placeholder="Sort" /></div></SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="newest" className="text-[10px] font-black uppercase tracking-widest">Newest</SelectItem>
                <SelectItem value="price-high" className="text-[10px] font-black uppercase tracking-widest">High Price</SelectItem>
                <SelectItem value="price-low" className="text-[10px] font-black uppercase tracking-widest">Low Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? <div className="py-20 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div> : (
          <div className="grid gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white p-8 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-700 border border-primary/5 flex items-center gap-8 group">
                <div className="relative w-32 h-32 aspect-square rounded-[2rem] overflow-hidden bg-paper shrink-0 shadow-lg border border-primary/5">
                  <Image src={prod.imageUrls?.[0] || 'https://placehold.co/400x400'} alt={prod.name} fill className="object-cover" />
                  {!prod.isPublished && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><EyeOff className="w-6 h-6 text-white" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">{prod.category}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/30">Stock: {prod.stockQuantity}</span>
                  </div>
                  <h4 className="font-headline text-3xl text-primary truncate group-hover:text-accent transition-colors">{prod.name}</h4>
                  <p className="font-black text-primary/40 text-sm mt-1 italic">₹ {prod.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => handleEdit(prod)} className="w-14 h-14 rounded-full bg-paper flex items-center justify-center text-primary/40 hover:text-accent hover:bg-accent/10 transition-all shadow-md active:scale-90"><Edit3 className="w-6 h-6" /></button>
                  <button onClick={() => handleDelete(prod.id)} className="w-14 h-14 rounded-full bg-paper flex items-center justify-center text-primary/20 hover:text-destructive hover:bg-destructive/10 transition-all shadow-md active:scale-90"><Trash2 className="w-6 h-6" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
