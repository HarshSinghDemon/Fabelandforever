
"use client";

import React from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { History, Loader2, Package, User, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function AdminOrderManager() {
  const db = useFirestore();

  const ordersQuery = React.useMemo(() => {
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, loading } = useCollection(ordersQuery);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <History className="text-accent w-6 h-6" />
          <h3 className="font-headline text-3xl text-primary">Order Scrolls</h3>
        </div>
        <span className="bg-white/50 border border-primary/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <Card className="border-none shadow-xl rounded-[3rem] bg-white p-20 text-center stitching-border">
          <p className="text-muted-foreground italic text-xl">
            "No orders have been loomed yet. The threads of destiny are still weaving..."
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order: any) => (
            <Card key={order.id} className="border-none shadow-lg rounded-[3rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 group">
              <CardContent className="p-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <User className="text-primary w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Customer UID</p>
                        <p className="font-bold text-primary text-sm">{order.userId || 'Anonymous Weaver'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl">
                        <Package className="text-accent w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">Treasures Adopted</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.items?.map((item: any, idx: number) => (
                            <span key={idx} className="bg-muted px-4 py-1.5 rounded-full text-xs font-medium border border-primary/5">
                              {item.title} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 space-y-6 md:border-l md:pl-8 border-primary/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <CreditCard className="text-primary w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Revenue</p>
                        <p className="text-2xl font-bold text-primary">₹ {Number(order.total).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl">
                        <Clock className="text-accent w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent/50">Loom Date</p>
                        <p className="text-sm font-medium text-primary">
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
