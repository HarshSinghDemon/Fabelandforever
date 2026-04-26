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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-10 rounded-[3rem] shadow-xl border border-primary/5 gap-8">
        <div className="flex items-center gap-8">
          <h3 className="font-headline text-5xl text-primary">Scrolls</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 px-8 py-3 bg-paper rounded-full shadow-inner">
            {filteredOrders.length} Records
          </span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {['all', 'pending', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
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

      {isLoading ? <div className="py-40 flex justify-center"><Loader2 className="w-16 h-16 animate-spin text-accent" /></div> : (
        <div className="grid gap-10">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-10 rounded-[4rem] shadow-2xl hover:shadow-primary/5 transition-all duration-700 border border-primary/5 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden group">
              <div className="lg:col-span-5 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center text-primary font-bold shadow-inner">
                    <User className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-headline text-4xl text-primary">{order.customerName}</h4>
                    <p className="text-[10px] text-primary/30 font-black uppercase tracking-widest">Client Identity</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-primary/5">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Phone</p>
                    <div className="flex items-center gap-3 text-primary/70 text-base font-black">
                      <Phone className="w-5 h-5 text-accent" /> {order.customerPhone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Instagram</p>
                    <div className="flex items-center gap-3 text-primary/70 text-base font-black">
                      <Instagram className="w-5 h-5 text-accent" /> {order.customerInstagram || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Gmail (Receipt)</p>
                    <div className="flex items-center gap-3 text-primary/70 text-base font-black">
                      <Mail className="w-5 h-5 text-accent" /> {order.customerEmail || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-primary/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Destination Details</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-5 text-primary/70">
                      <MapPin className="w-6 h-6 text-accent mt-1 shrink-0" />
                      <div className="text-base font-black leading-relaxed italic">
                        {order.address?.flat}, {order.address?.street}<br />
                        {order.address?.locality}, {order.address?.city} - {order.address?.pincode}
                      </div>
                    </div>
                    {order.address?.gps && (
                      <button onClick={() => openInMaps(order.address.gps.lat, order.address.gps.lng)} className="flex items-center gap-4 px-8 py-3 bg-paper rounded-full text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all shadow-md active:scale-95">
                        <NavIcon className="w-5 h-5" /> View Space on Maps
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-primary/5 flex flex-wrap gap-4">
                  <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg active:scale-95"><CheckCircle2 className="w-5 h-5" /> Complete</button>
                  <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="flex items-center gap-3 px-8 py-4 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95"><XCircle className="w-5 h-5" /> Void</button>
                </div>
              </div>

              <div className="lg:col-span-7 bg-paper rounded-[3rem] p-10 relative overflow-hidden stitching-border shadow-inner">
                <div className="flex items-center justify-between mb-10">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/30 flex items-center gap-3"><Package className="w-6 h-6" /> Selection Archives</h5>
                  <span className="text-[10px] font-black text-primary/40 italic">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="space-y-6">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-5 border-b border-white last:border-0">
                      <div className="flex items-center gap-5">
                        <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[12px] font-black text-primary shadow-md">{item.quantity}</span>
                        <span className="font-black text-primary text-base uppercase tracking-tight">{item.title}</span>
                      </div>
                      <span className="font-black text-primary/50 text-base">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10 border-t border-dashed border-primary/10 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary/30">Total Manifest Value</p>
                    <h6 className="font-headline text-5xl text-primary font-black">₹ {order.total?.toLocaleString('en-IN')}</h6>
                  </div>
                  <button onClick={() => handleDelete(order.id)} className="w-16 h-16 bg-white text-primary/20 hover:text-destructive rounded-full flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-90"><Trash2 className="w-8 h-8" /></button>
                </div>
              </div>

              <div className={cn("absolute top-10 right-10 flex items-center gap-4 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl animate-in zoom-in duration-500", order.status === 'pending' ? "bg-amber-100 text-amber-600" : order.status === 'completed' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
                <Clock className="w-5 h-5" /> {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
