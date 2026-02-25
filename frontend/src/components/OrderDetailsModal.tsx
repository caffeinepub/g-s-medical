import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Phone, MapPin, Package, CreditCard } from 'lucide-react';
import type { Order } from '../backend';
import { useUpdateOrderStatus } from '../hooks/useQueries';

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered'];

function getStatusClass(status: string) {
  switch (status) {
    case 'pending': return 'status-pending';
    case 'confirmed': return 'status-confirmed';
    case 'shipped': return 'status-shipped';
    case 'delivered': return 'status-delivered';
    default: return '';
  }
}

export default function OrderDetailsModal({ order, open, onClose }: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
  const updateStatus = useUpdateOrderStatus();

  React.useEffect(() => {
    if (order) setSelectedStatus(order.status);
  }, [order]);

  if (!order) return null;

  const handleSave = async () => {
    await updateStatus.mutateAsync({ id: order.id, status: selectedStatus });
    onClose();
  };

  const orderDate = new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Order #{order.id.toString()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusClass(order.status)} rounded-lg px-3 py-1 text-xs font-semibold capitalize`}>
              {order.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{orderDate}</span>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground">Customer Details</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">
                  {order.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-secondary rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>Product #{item.productId.toString()}</span>
                    <span className="text-muted-foreground">× {item.quantity.toString()}</span>
                  </div>
                  <span className="font-semibold">₹{(item.price * item.quantity).toString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount.toString()}</span>
            </div>
          </div>

          <Separator />

          {/* UPI Ref */}
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">UPI Ref:</span>
            <span className="font-mono font-medium">{order.upiTransactionRef || 'N/A'}</span>
          </div>

          <Separator />

          {/* Update Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground">Update Status</h3>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="flex-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSave}
                disabled={updateStatus.isPending || selectedStatus === order.status}
                className="rounded-xl"
              >
                {updateStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
