
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
  Package
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

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5">
        <div className="flex items-center gap-6">
          <h3 className="font-headline text-3xl text-primary">Order Scrolls</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30 px-4 py-1.5 bg-paper rounded-full">
            {filteredOrders.length} Records
          </span>
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all",
                filter === f 
                  ? "bg-primary text-white shadow-lg" 
                  : "bg-paper text-primary/40 hover:text-primary border border-primary/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-40 text-center border-2 border-dashed border-primary/5 rounded-[4rem] bg-white/50 space-y-4">
          <Scroll className="w-12 h-12 text-primary/10 mx-auto" />
          <p className="text-primary/20 italic font-medium">"No matching scrolls found in the archives."</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-10 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-primary/5 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden group">
              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-paper rounded-full flex items-center justify-center text-primary font-bold shadow-inner">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-headline text-2xl text-primary">{order.customerName}</h4>
                    <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">Client Identity</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-primary/5">
                  <div className="flex items-center gap-4 text-primary/60">
                    <Phone className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-4 text-primary/60">
                    <MapPin className="w-4 h-4 text-accent mt-1" />
                    <span className="text-sm font-medium leading-relaxed italic">{order.customerAddress}</span>
                  </div>
                </div>

                <div className="pt-8">
                   <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      className="flex items-center gap-3 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Scroll
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-paper rounded-[3rem] p-10 relative overflow-hidden stitching-border">
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/30 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Loop Selection
                  </h5>
                  <span className="text-[10px] font-bold text-primary/40 italic">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-6">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-white/40 last:border-0">
                      <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary">
                          {item.quantity}
                        </span>
                        <span className="font-bold text-primary text-sm">{item.title}</span>
                      </div>
                      <span className="font-bold text-primary/50 text-sm">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-dashed border-primary/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Total Value</p>
                    <h6 className="font-headline text-3xl text-primary">₹ {order.total?.toLocaleString('en-IN')}</h6>
                  </div>
                  <button 
                    onClick={() => handleDelete(order.id)}
                    className="w-12 h-12 bg-white text-primary/20 hover:text-destructive rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={cn(
                "absolute top-10 right-10 flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg",
                order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                order.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                "bg-rose-100 text-rose-600"
              )}>
                <Clock className="w-3.5 h-3.5" /> {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
