import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, ShoppingCart, TrendingUp, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSellerAuth } from '../hooks/useSellerAuth';
import { useGetSellerProducts, useGetSellerOrders } from '../hooks/useQueries';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { seller, session } = useSellerAuth();
  const { data: products, isLoading: productsLoading } = useGetSellerProducts(session?.sellerId || '');
  const { data: orders, isLoading: ordersLoading } = useGetSellerOrders(
    session?.sellerId || '',
    session?.passwordHash || '',
  );

  const totalProducts = products?.length || 0;
  const availableProducts = products?.filter((p) => p.isAvailable).length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === 'pending').length || 0;

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="medical-gradient rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold mb-1">
              Welcome back, {seller?.ownerName?.split(' ')[0] || 'Seller'}! 👋
            </h1>
            <p className="opacity-90 text-sm">{seller?.storeName}</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Products',
            value: productsLoading ? null : totalProducts,
            icon: Package,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Available Products',
            value: productsLoading ? null : availableProducts,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            label: 'Total Orders',
            value: ordersLoading ? null : totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            label: 'Pending Orders',
            value: ordersLoading ? null : pendingOrders,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    {stat.value === null ? (
                      <Skeleton className="h-6 w-10 mb-1" />
                    ) : (
                      <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>My Products</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate({ to: '/seller/products' })}
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-2">
                {products.slice(0, 3).map((p) => (
                  <div key={p.id.toString()} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <img
                      src={p.image.getDirectURL()}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">₹{Number(p.price)}</p>
                    </div>
                    <Badge variant={p.isAvailable ? 'default' : 'secondary'} className="text-xs">
                      {p.isAvailable ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">No products yet</p>
                <Button
                  size="sm"
                  className="mt-2 rounded-lg"
                  onClick={() => navigate({ to: '/seller/products' })}
                >
                  Add Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Recent Orders</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate({ to: '/seller/orders' })}
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id.toString()} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Order #{order.id.toString()}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{Number(order.totalAmount)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <ShoppingCart className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
