import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import StatusBadge from '../components/StatusBadge';
import type { Order } from '../backend';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetOrders();
  const updateStatus = useUpdateOrderStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = orders
    .filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.includes(s) ||
          o.id.toString().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const diff = Number(b.createdAt) - Number(a.createdAt);
      return sortDir === 'desc' ? diff : -diff;
    });

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success('Order status updated');
      if (selectedOrder && Number(selectedOrder.id) === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-1"
        >
          Date {sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => (
                    <tr key={Number(order.id)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">#{Number(order.id)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{Number(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder && Number(selectedOrder.id)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <p className="text-gray-500">UPI Reference</p>
                  <p className="font-mono text-xs">{selectedOrder.upiTransactionRef}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-bold text-primary">₹{Number(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Items ({selectedOrder.items.length})</p>
                <div className="space-y-1">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2">
                      <span>Product #{Number(item.productId)} × {Number(item.quantity)}</span>
                      <span className="font-medium">₹{Number(item.price) * Number(item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-2">Update Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={val => handleStatusUpdate(Number(selectedOrder.id), val)}
                >
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
