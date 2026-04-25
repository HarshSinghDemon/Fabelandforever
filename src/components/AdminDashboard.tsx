"use client";

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { 
  Package, 
  Scroll, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminDashboard() {
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => db ? collection(db, 'products') : null, [db]);
  const ordersQuery = useMemoFirebase(() => db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)) : null, [db]);

  const { data: products } = useCollection(productsQuery);
  const { data: recentOrders } = useCollection(ordersQuery);

  const stats = [
    { 
      label: 'Total Creations', 
      value: products?.length || 0, 
      icon: Package, 
      color: 'bg-primary/10 text-primary' 
    },
    { 
      label: 'Pending Scrolls', 
      value: recentOrders?.filter(o => o.status === 'pending').length || 0, 
      icon: Scroll, 
      color: 'bg-accent/10 text-accent' 
    },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5 flex items-center gap-6 hover:shadow-xl transition-all group">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30 mb-1">{stat.label}</p>
              <h3 className="font-headline text-3xl text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white rounded-[4rem] p-12 shadow-sm border border-primary/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-headline text-3xl text-primary">Recent Scrolls</h3>
            <button className="text-[9px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors flex items-center gap-2 group">
              View All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-6">
            {!recentOrders?.length ? (
              <div className="py-20 text-center italic text-primary/20">"No new scrolls have been unrolled yet."</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 bg-paper rounded-[2rem] border border-primary/5 hover:border-accent/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
                      {order.customerName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">{order.customerName}</h4>
                      <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">₹ {order.total?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                      order.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {order.status}
                    </span>
                    <p className="text-[8px] text-primary/20 font-bold uppercase tracking-widest mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Studio Pulse - Reset to Normal Overview */}
        <div className="lg:col-span-5 bg-primary text-white rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-3xl mb-6">Studio Pulse</h3>
              <p className="text-white/60 text-sm italic font-medium leading-relaxed mb-8">
                "Welcome back, Master Weaver. The boutique is flowing with the rhythm of your hands. Your inventory and scrolls are being tracked in real-time."
              </p>
              
              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Inventory Status</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Boutique Visibility</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Live</span>
                </div>
              </div>
            </div>

            <div className="pt-12 flex items-center gap-4">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                Loom synchronized: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
