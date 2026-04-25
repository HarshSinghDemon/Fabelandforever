
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
      toast({ variant: "destructive", title: "Incomplete Loom", description: "Please provide a name, price, category, and at least one image." });
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
      toast({ title: editingId ? "Loop Refined ✨" : "New Creation Added ✨", description: `${formData.name} is safely stored.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Magic Glitch", description: "The grimoire could not be updated." });
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
    if (!db || !window.confirm("Are you sure you want to unravel this loop forever?")) return;
    deleteDocumentNonBlocking(doc(db, 'products', id));
    toast({ title: "Unraveled", description: "The piece has been withdrawn from history." });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-5 order-2 lg:order-1">
        <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 shadow-xl border border-primary/5 stitching-border lg:sticky lg:top-32">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl md:text-3xl text-primary flex items-center gap-3">
              {editingId ? <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-accent" /> : <Plus className="w-5 h-5 md:w-6 md:h-6 text-accent" />}
              {editingId ? "Refine Creation" : "New Creation"}
            </h3>
            {editingId && (
              <button 
                onClick={() => { setEditingId(null); setFormData(initialForm); }}
                className="text-[9px] font-bold uppercase tracking-widest text-primary/30 hover:text-destructive transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 ml-4">Gallery Loop</Label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden group border border-primary/5">
                    <Image src={url} alt="Gallery" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.imageUrls.length < 4 && (
                  <SupabaseImageUpload 
                    onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, url] }))}
                    className="aspect-square"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Product Name</Label>
                <Input 
                  placeholder="e.g., Whispering Willow Scarf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-paper border-none h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Price (₹)</Label>
                  <Input 
                    type="number"
                    placeholder="2500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-paper border-none h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="bg-paper border-none h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                      <SelectValue placeholder="Select Category" />
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Stock Loop</Label>
                  <Input 
                    type="number"
                    placeholder="1"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="bg-paper border-none h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Tags</Label>
                  <Input 
                    placeholder="vintage, soft, heirloom"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-paper border-none h-12 md:h-14 px-6 rounded-xl md:rounded-2xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">The Stitch Story</Label>
                <Textarea 
                  placeholder="Describe the soul of this piece..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-paper border-none min-h-[120px] md:min-h-[140px] p-6 rounded-[1.5rem] md:rounded-[2rem] font-medium text-sm italic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-paper rounded-2xl border border-primary/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Bestseller</p>
                    <p className="text-[7px] text-primary/30 font-bold uppercase tracking-widest">Homepage hit</p>
                  </div>
                  <Switch 
                    checked={formData.isBestseller}
                    onCheckedChange={(val) => setFormData({ ...formData, isBestseller: val })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-paper rounded-2xl border border-primary/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Published</p>
                    <p className="text-[7px] text-primary/30 font-bold uppercase tracking-widest">Public view</p>
                  </div>
                  <Switch 
                    checked={formData.isPublished}
                    onCheckedChange={(val) => setFormData({ ...formData, isPublished: val })}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 md:h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  {editingId ? "Finalize" : "Add to Boutique"} 
                  <Sparkles className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 order-1 lg:order-2 space-y-8 md:space-y-10">
        <div className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-primary/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-headline text-2xl md:text-3xl text-primary">Boutique Gallery</h3>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary/30 px-3 md:px-4 py-1.5 bg-paper rounded-full">
              {filteredProducts.length} Selections
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
              <Input 
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-full bg-paper border-none w-full text-xs font-bold"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-11 w-full rounded-full bg-paper border-none text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-[10px] font-bold uppercase tracking-widest">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger className="h-11 w-full rounded-full bg-paper border-none text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-5">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3" />
                  <SelectValue placeholder="Sort By" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="newest" className="text-[10px] font-bold uppercase tracking-widest">Newest</SelectItem>
                <SelectItem value="oldest" className="text-[10px] font-bold uppercase tracking-widest">Oldest</SelectItem>
                <SelectItem value="price-high" className="text-[10px] font-bold uppercase tracking-widest">Price High</SelectItem>
                <SelectItem value="price-low" className="text-[10px] font-bold uppercase tracking-widest">Price Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-primary/5 rounded-[2rem] md:rounded-[4rem] bg-white/50 space-y-4">
            <Package className="w-10 h-10 text-primary/10 mx-auto" />
            <p className="text-primary/20 italic font-medium">"No creations found in the archives."</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-primary/5 flex flex-col sm:flex-row gap-6 md:gap-8 items-center group relative overflow-hidden">
                {prod.isBestseller && (
                  <div className="absolute top-0 right-8 md:right-12 bg-accent text-white px-3 md:px-4 py-1.5 md:py-2 rounded-b-xl md:rounded-b-2xl shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
                
                <div className="relative w-full sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-paper shrink-0 border border-primary/5">
                  <Image 
                    src={prod.imageUrls?.[0] || 'https://placehold.co/400x400?text=No+Image'} 
                    alt={prod.name} 
                    fill 
                    className="object-cover" 
                  />
                  {!prod.isPublished && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <EyeOff className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2 md:space-y-3 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/10">
                      {prod.category}
                    </span>
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-primary/30">
                      Stock: {prod.stockQuantity || 0}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-headline text-xl md:text-2xl text-primary group-hover:text-accent transition-colors truncate">{prod.name}</h4>
                    <p className="font-bold text-primary/40 text-xs md:text-sm italic">₹ {prod.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handleEdit(prod)}
                    className="flex-1 sm:flex-none w-10 h-10 md:w-12 md:h-12 rounded-full bg-paper flex items-center justify-center text-primary/40 hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(prod.id)}
                    className="flex-1 sm:flex-none w-10 h-10 md:w-12 md:h-12 rounded-full bg-paper flex items-center justify-center text-primary/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
