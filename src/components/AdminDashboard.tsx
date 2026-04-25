
"use client";

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { 
  Package, 
  ShoppingBag, 
  Scroll, 
  Sparkles, 
  TrendingUp, 
  Clock,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

export function AdminDashboard() {
  const db = useFirestore();

  const productsQuery = useMemoFirebase(() => db ? collection(db, 'products') : null, [db]);
  const ordersQuery = useMemoFirebase(() => db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)) : null, [db]);

  const { data: products } = useCollection(productsQuery);
  const { data: recentOrders } = useCollection(ordersQuery);

  const stats = [
    { label: 'Total Creations', value: products?.length || 0, icon: Package, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Pending Scrolls', value: recentOrders?.length || 0, icon: Scroll, color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Studio Visits', value: '4.2k', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Artisan Rating', value: '4.9', icon: Sparkles, color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <span className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 bg-accent/10 text-accent rounded-full">
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

        {/* Quick Insights */}
        <div className="lg:col-span-5 bg-primary text-white rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 space-y-10">
            <div>
              <h3 className="font-headline text-3xl mb-4">Studio Pulse</h3>
              <p className="text-white/40 text-xs italic font-medium leading-relaxed">
                "Your boutique continues to weave stories for the heritage heart. Keep the loops high."
              </p>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Popular Category', value: 'Forever Flowers', progress: 75 },
                { label: 'Inventory Health', value: 'High', progress: 90 },
                { label: 'Customer Retention', value: '12% Growth', progress: 65 },
              ].map((insight, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/50">
                    <span>{insight.label}</span>
                    <span className="text-white">{insight.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${insight.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-4">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
