import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Copy, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePlaceOrder } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const UPI_ID = 'gsmedical@upi';

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const placeOrder = usePlaceOrder();

  const [copied, setCopied] = useState(false);
  const [upiRef, setUpiRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = 'Name is required';
    if (!customerPhone.trim() || !/^\d{10}$/.test(customerPhone)) errs.phone = 'Valid 10-digit phone required';
    if (!customerAddress.trim()) errs.address = 'Address is required';
    if (!upiRef.trim()) errs.upiRef = 'UPI transaction reference is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderId = await placeOrder.mutateAsync({
        customerName,
        customerPhone,
        customerAddress,
        items: cartItems.map(item => ({
          productId: BigInt(item.id),
          quantity: BigInt(item.quantity),
          price: BigInt(item.price),
        })),
        totalAmount: BigInt(total),
        upiTransactionRef: upiRef,
      });

      clearCart();
      navigate({ to: '/order-success', search: { orderId: orderId.toString() } });
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No items in cart</h2>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UPI Payment */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Pay via UPI</h2>
            <div className="flex items-center gap-3 bg-muted rounded-lg p-3 mb-4">
              <span className="font-mono text-sm flex-1">{UPI_ID}</span>
              <Button size="sm" variant="outline" onClick={handleCopyUPI}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&am=${total}`}
                alt="UPI QR Code"
                className="rounded-lg border border-border"
                width={200}
                height={200}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan QR code or use UPI ID to pay <strong>₹{total}</strong>
            </p>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground mb-2">Delivery Details</h2>

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="mt-1"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="mt-1"
              />
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Full delivery address"
                className="mt-1"
              />
              {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <Label htmlFor="upiRef">UPI Transaction Reference *</Label>
              <Input
                id="upiRef"
                value={upiRef}
                onChange={e => setUpiRef(e.target.value)}
                placeholder="Enter UPI transaction ID"
                className="mt-1"
              />
              {errors.upiRef && <p className="text-destructive text-xs mt-1">{errors.upiRef}</p>}
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={placeOrder.isPending}>
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Confirm Order'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
