"use client";

import React, { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { 
  Scroll, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MapPin, 
  User, 
  Trash2, 
  Loader2,
  Package,
  Instagram,
  Mail,
  Navigation as NavIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AdminOrderManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    if (filter === 'all') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      toast({ title: "Scroll Updated ✨", description: `Order status set to ${status}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not change scroll status." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Archive this scroll forever?")) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      toast({ title: "Archived", description: "The scroll has been removed from active view." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not archive scroll." });
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-primary/5 gap-6">
        <div className="flex items-center gap-6">
          <h3 className="font-headline text-3xl md:text-4xl text-primary">Order Scrolls</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 px-6 py-2 bg-paper rounded-full shadow-inner">
            {filteredOrders.length} Records
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {['all', 'pending', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95",
                filter === f 
                  ? "bg-primary text-white shadow-primary/20 scale-105" 
                  : "bg-paper text-primary/40 hover:text-primary border border-primary/5 hover:bg-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-40 text-center border-2 border-dashed border-primary/5 rounded-[4rem] bg-white/50 space-y-4">
          <Scroll className="w-16 h-16 text-primary/10 mx-auto" />
          <p className="text-primary/20 italic font-medium text-xl">"No matching scrolls found in the archives."</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl hover:shadow-primary/5 transition-all duration-700 border border-primary/5 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative overflow-hidden group">
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center text-primary font-bold shadow-inner">
                    <User className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-headline text-3xl text-primary">{order.customerName}</h4>
                    <p className="text-[10px] text-primary/30 font-black uppercase tracking-widest">Client Identity</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-primary/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Phone</p>
                    <div className="flex items-center gap-2 text-primary/70 text-sm font-black">
                      <Phone className="w-4 h-4 text-accent" /> {order.customerPhone}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Instagram</p>
                    <div className="flex items-center gap-2 text-primary/70 text-sm font-black">
                      <Instagram className="w-4 h-4 text-accent" /> {order.customerInstagram || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Gmail (Receipt)</p>
                    <div className="flex items-center gap-2 text-primary/70 text-sm font-black">
                      <Mail className="w-4 h-4 text-accent" /> {order.customerEmail || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Destination Details</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 text-primary/70">
                      <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                      <div className="text-sm font-black leading-relaxed italic">
                        {order.address?.flat}, {order.address?.street}<br />
                        {order.address?.locality}, Kolkata - {order.address?.pincode}
                      </div>
                    </div>
                    {order.address?.gps && (
                      <button 
                        onClick={() => openInMaps(order.address.gps.lat, order.address.gps.lng)}
                        className="flex items-center gap-3 px-6 py-2.5 bg-paper rounded-full text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <NavIcon className="w-4 h-4" /> View Space on Maps
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                   <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Scroll
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <XCircle className="w-4 h-4" /> Void Scroll
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-paper rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden stitching-border shadow-inner">
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 flex items-center gap-2">
                    <Package className="w-5 h-5" /> Selection Archives
                  </h5>
                  <span className="text-[10px] font-black text-primary/40 italic">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-white last:border-0">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                          {item.quantity}
                        </span>
                        <span className="font-black text-primary text-sm uppercase tracking-tight">{item.title}</span>
                      </div>
                      <span className="font-black text-primary/50 text-sm">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-dashed border-primary/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Total Manifest Value</p>
                    <h6 className="font-headline text-3xl text-primary font-black">₹ {order.total?.toLocaleString('en-IN')}</h6>
                  </div>
                  <button 
                    onClick={() => handleDelete(order.id)}
                    className="w-14 h-14 bg-white text-primary/20 hover:text-destructive rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-90"
                    title="Archive Scroll"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className={cn(
                "absolute top-8 right-8 flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in zoom-in duration-500",
                order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                order.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                "bg-rose-100 text-rose-600"
              )}>
                <Clock className="w-4 h-4" /> {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}