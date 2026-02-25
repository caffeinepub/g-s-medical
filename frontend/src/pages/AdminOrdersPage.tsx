import React, { useState, useMemo } from 'react';
import { useGetOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '../components/StatusBadge';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import type { Order } from '../backend';
import { sortByDate, sortByAmount, type SortDirection } from '../utils/sortHelpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type SortField = 'date' | 'amount' | null;

function OrderDetailsModal({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  const updateStatus = useUpdateOrderStatus();

  if (!order) return null;

  const isPaid = order.upiTransactionRef && order.upiTransactionRef.trim() !== '';

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order.id.toString()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          {/* Payment Info */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground mb-2">Payment Information</h3>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <StatusBadge status={isPaid ? 'paid' : 'unpaid'} type="payment" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">UPI Reference</span>
              <span className="font-mono text-xs font-medium">{order.upiTransactionRef || 'N/A'}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Customer Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{order.customerName}</span>
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{order.customerPhone}</span>
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium">{order.customerAddress}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Items</h3>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm bg-muted/30 rounded px-3 py-2">
                  <span>Product #{item.productId.toString()} × {item.quantity.toString()}</span>
                  <span className="font-medium">₹{Number(item.price).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="text-primary">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Update Status</h3>
            <Select defaultValue={order.status} onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const filtered = useMemo(() => {
    let list = orders ?? [];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.id.toString().includes(q) ||
          o.upiTransactionRef.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (paymentFilter === 'paid') {
      list = list.filter((o) => o.upiTransactionRef && o.upiTransactionRef.trim() !== '');
    } else if (paymentFilter === 'unpaid') {
      list = list.filter((o) => !o.upiTransactionRef || o.upiTransactionRef.trim() === '');
    }

    if (sortField === 'date') list = sortByDate(list, sortDir);
    else if (sortField === 'amount') list = sortByAmount(list, sortDir);
    else list = [...list].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    return list;
  }, [orders, search, statusFilter, paymentFilter, sortField, sortDir]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and track all customer orders</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, order ID, or UPI ref..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      <button className="flex items-center hover:text-foreground" onClick={() => handleSort('amount')}>
                        Amount <SortIcon field="amount" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">UPI Ref</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      <button className="flex items-center hover:text-foreground" onClick={() => handleSort('date')}>
                        Date <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const isPaid = order.upiTransactionRef && order.upiTransactionRef.trim() !== '';
                    return (
                      <tr key={order.id.toString()} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{order.id.toString()}</td>
                        <td className="px-4 py-3 font-medium">{order.customerName}</td>
                        <td className="px-4 py-3 font-semibold text-primary">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 font-mono text-xs max-w-[120px] truncate">{order.upiTransactionRef || '—'}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={isPaid ? 'paid' : 'unpaid'} type="payment" />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="h-7 px-2"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
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

      <OrderDetailsModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
