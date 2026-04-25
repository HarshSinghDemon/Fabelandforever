"use client";

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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
  LayoutGrid, 
  Loader2, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Star,
  Edit3,
  X,
  Image as ImageIcon,
  Download,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
  stock: string;
  tags: string;
  featured: boolean;
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
    stock: '1',
    tags: '',
    featured: false,
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

    // Sorting
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
      stock: Number(formData.stock),
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
      stock: product.stock?.toString() || '1',
      tags: product.tags?.join(', ') || '',
      featured: product.featured || false,
      isPublished: product.isPublished !== undefined ? product.isPublished : true,
      imageUrls: product.imageUrls || [product.image] || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to unravel this loop forever?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Unraveled", description: "The piece has been withdrawn from history." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "The knot remains tight. Could not delete." });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const exportToCSV = () => {
    if (!filteredProducts.length) return;
    
    const headers = ['ID', 'Name', 'Price', 'Category', 'Stock', 'Featured', 'Published', 'Created At'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.name,
      p.price,
      p.category,
      p.stock,
      p.featured ? 'Yes' : 'No',
      p.isPublished ? 'Yes' : 'No',
      new Date(p.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fable-forever-products-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Product Form */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[4rem] p-10 shadow-xl border border-primary/5 stitching-border sticky top-32">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-3xl text-primary flex items-center gap-3">
              {editingId ? <Edit3 className="w-6 h-6 text-accent" /> : <Plus className="w-6 h-6 text-accent" />}
              {editingId ? "Refine Creation" : "New Creation"}
            </h3>
            {editingId && (
              <button 
                onClick={() => { setEditingId(null); setFormData(initialForm); }}
                className="text-[9px] font-bold uppercase tracking-widest text-primary/30 hover:text-destructive transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/30 ml-4">Gallery Loop</Label>
              <div className="grid grid-cols-2 gap-4">
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group border border-primary/5">
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

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Product Name</Label>
                <Input 
                  placeholder="e.g., Whispering Willow Scarf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Price (₹)</Label>
                  <Input 
                    type="number"
                    placeholder="2500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                      <SelectValue placeholder="Select Era" />
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

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Stock Loop</Label>
                  <Input 
                    type="number"
                    placeholder="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">Tags</Label>
                  <Input 
                    placeholder="vintage, soft, heirloom"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-paper border-none h-14 px-6 rounded-2xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-primary/20 ml-4">The Stitch Story</Label>
                <Textarea 
                  placeholder="Describe the soul of this piece..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-paper border-none min-h-[140px] p-6 rounded-[2rem] font-medium text-sm italic focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-paper rounded-3xl border border-primary/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Featured Selection</p>
                  <p className="text-[8px] text-primary/30 font-bold uppercase tracking-widest">Display on homepage highlights</p>
                </div>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(val) => setFormData({ ...formData, featured: val })}
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-paper rounded-3xl border border-primary/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Boutique Visibility</p>
                  <p className="text-[8px] text-primary/30 font-bold uppercase tracking-widest">Make visible in public catalog</p>
                </div>
                <Switch 
                  checked={formData.isPublished}
                  onCheckedChange={(val) => setFormData({ ...formData, isPublished: val })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  {editingId ? "Finalize Refinement" : "Add to Heritage Boutique"} 
                  <Sparkles className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="lg:col-span-7 space-y-10">
        <div className="flex flex-col gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h3 className="font-headline text-3xl text-primary">Boutique Gallery</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30 px-4 py-1.5 bg-paper rounded-full border border-primary/5">
                {filteredProducts.length} Pieces
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={exportToCSV} className="text-primary/40 hover:text-primary gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
              <Input 
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-paper border-none w-full text-xs font-bold"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-12 w-full rounded-full bg-paper border-none text-[9px] font-bold uppercase tracking-widest px-6">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Eras</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-[10px] font-bold uppercase tracking-widest">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger className="h-12 w-full rounded-full bg-paper border-none text-[9px] font-bold uppercase tracking-widest px-6">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3" />
                  <SelectValue placeholder="Sort By" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="newest" className="text-[10px] font-bold uppercase tracking-widest">Newest</SelectItem>
                <SelectItem value="oldest" className="text-[10px] font-bold uppercase tracking-widest">Oldest</SelectItem>
                <SelectItem value="price-high" className="text-[10px] font-bold uppercase tracking-widest">Price: High to Low</SelectItem>
                <SelectItem value="price-low" className="text-[10px] font-bold uppercase tracking-widest">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-40 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center border-2 border-dashed border-primary/5 rounded-[4rem] bg-white/50 space-y-4">
            <Package className="w-12 h-12 text-primary/10 mx-auto" />
            <p className="text-primary/20 italic font-medium">"The boutique is silent. No matching creations found."</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-primary/5 flex gap-8 items-center group relative overflow-hidden">
                {prod.featured && (
                  <div className="absolute top-0 right-12 bg-accent text-white px-4 py-2 rounded-b-2xl shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                )}
                
                <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-paper shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700 border border-primary/5">
                  <Image 
                    src={prod.imageUrls?.[0] || prod.image} 
                    alt={prod.name} 
                    fill 
                    className="object-cover" 
                  />
                  {!prod.isPublished && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/10">
                      {prod.category}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary/30">
                      Stock: {prod.stock || 0}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-headline text-2xl text-primary group-hover:text-accent transition-colors truncate">{prod.name}</h4>
                    <p className="font-bold text-primary/40 text-sm tracking-tight italic">₹ {prod.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex gap-2">
                    {prod.tags?.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-[7px] font-bold uppercase tracking-widest text-primary/20">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleEdit(prod)}
                    className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-primary/40 hover:text-accent hover:bg-accent/10 transition-all active:scale-90"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(prod.id)}
                    className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-primary/20 hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
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
