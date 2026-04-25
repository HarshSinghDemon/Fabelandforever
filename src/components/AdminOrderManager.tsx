
"use client";

import React from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { History, Loader2, Package, User, CreditCard, Clock, Phone, MapPin, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function AdminOrderManager() {
  const db = useFirestore();
  const { toast } = useToast();

  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, loading } = useCollection(ordersQuery);

  const updateStatus = (orderId: string, newStatus: string) => {
    if (!db) return;
    const docRef = doc(db, 'orders', orderId);
    updateDoc(docRef, { status: newStatus })
      .then(() => {
        toast({ title: "Status Updated ✨", description: `Order is now ${newStatus}.` });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <History className="text-accent w-6 h-6" />
          <h3 className="font-headline text-3xl text-primary">Stitch Scrolls</h3>
        </div>
        <div className="px-6 py-3 bg-white rounded-full border border-primary/5 shadow-sm text-[10px] font-bold uppercase tracking-widest text-primary/40">
          Total Orders: <span className="text-primary ml-2">{orders?.length || 0}</span>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="p-32 bg-white rounded-[4rem] text-center italic text-primary/30 text-xl border-2 border-dashed border-primary/5">
          "The grimoire is empty. No souls have yet adopted your treasures."
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-primary/5 hover:shadow-2xl transition-all duration-500">
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  <div className="flex-1 space-y-10">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/5 rounded-2xl">
                          <User className="text-primary w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Customer</p>
                          <p className="font-bold text-primary text-lg">{order.customerName || 'Mystery Artisan'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-accent/5 rounded-2xl">
                          <Phone className="text-accent w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-accent/30">Contact</p>
                          <p className="font-bold text-primary text-lg">{order.customerPhone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-primary/20 w-4 h-4" />
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Destination</h4>
                      </div>
                      <p className="text-base font-medium text-primary/70 italic leading-relaxed pl-7">
                        {order.customerAddress || 'Direct Pickup'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Package className="text-accent/40 w-4 h-4" />
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Stitched Treasures</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 pl-7">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="px-4 py-2 bg-paper rounded-full text-xs font-bold text-primary border border-primary/5">
                            {item.title} <span className="text-accent ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 space-y-8 bg-paper p-8 rounded-[2.5rem]">
                    <div className="space-y-4">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Studio Status</p>
                      <Select 
                        defaultValue={order.status || 'pending'} 
                        onValueChange={(val) => updateStatus(order.id, val)}
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-2 border-primary/5 bg-white font-bold text-xs uppercase tracking-widest px-6">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                          <SelectItem value="pending" className="font-bold text-[10px] uppercase">🧶 Pending</SelectItem>
                          <SelectItem value="shipped" className="font-bold text-[10px] uppercase">🚚 Shipped</SelectItem>
                          <SelectItem value="delivered" className="font-bold text-[10px] uppercase">✨ Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30">Total Value</p>
                      <p className="text-3xl font-headline text-primary">₹ {Number(order.total).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="pt-6 border-t border-primary/5">
                      <div className="flex items-center gap-3 text-primary/40">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, HH:mm') : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
