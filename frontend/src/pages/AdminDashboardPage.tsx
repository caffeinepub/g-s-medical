import React from 'react';
import { useGetProducts, useGetOrders } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '../components/StatusBadge';
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Star,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';
import type { Order } from '../backend';

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: orders, isLoading: ordersLoading } = useGetOrders();

  const loading = productsLoading || ordersLoading;

  const stats = React.useMemo(() => {
    if (!orders) return { pending: 0, confirmed: 0, shipped: 0, delivered: 0, revenue: 0 };
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      revenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    };
  }, [orders]);

  const recentOrders: Order[] = React.useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 10);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={products?.length ?? 0}
          icon={Package}
          color="bg-blue-100 text-blue-600"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={orders?.length ?? 0}
          icon={ShoppingCart}
          color="bg-primary/10 text-primary"
          loading={loading}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          color="bg-green-100 text-green-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle}
          color="bg-blue-100 text-blue-600"
          loading={loading}
        />
        <StatCard
          title="Shipped"
          value={stats.shipped}
          icon={Truck}
          color="bg-purple-100 text-purple-600"
          loading={loading}
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={Star}
          color="bg-green-100 text-green-600"
          loading={loading}
        />
        <StatCard
          title="Avg. Order Value"
          value={orders && orders.length > 0 ? `₹${Math.round(stats.revenue / orders.length).toLocaleString('en-IN')}` : '₹0'}
          icon={TrendingUp}
          color="bg-orange-100 text-orange-600"
          loading={loading}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const isPaid = order.upiTransactionRef && order.upiTransactionRef.trim() !== '';
                    return (
                      <tr key={order.id.toString()} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{order.id.toString()}</td>
                        <td className="px-4 py-3 font-medium">{order.customerName}</td>
                        <td className="px-4 py-3 font-semibold text-primary">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={isPaid ? 'paid' : 'unpaid'} type="payment" />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
