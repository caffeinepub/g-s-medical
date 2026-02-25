import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Copy, Check, CreditCard, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { usePlaceOrder } from '../hooks/useQueries';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Product } from '../backend';

const UPI_ID = 'gauravsaswade2009@oksbi';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { isCustomerAuthenticated, customer, logout } = useCustomerAuth();
  const prefersReducedMotion = useReducedMotion();
  const placeOrderMutation = usePlaceOrder();

  const [cart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: '',
    upiRef: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const animatedTotal = useAnimatedCounter(total, { duration: 800 });

  const cartItems = cart.map((item) => ({
    id: Number(item.product.id),
    quantity: item.quantity,
  }));

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      toast.success('UPI ID copied!', {
        description: 'Paste it in your payment app',
        icon: '✅',
      });
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) errs.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.upiRef.trim()) errs.upiRef = 'UPI transaction reference is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      const orderId = await placeOrderMutation.mutateAsync({
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        items,
        totalAmount: BigInt(total),
        upiTransactionRef: form.upiRef,
      });

      localStorage.removeItem('cart');
      navigate({ to: '/order-success', search: { orderId: orderId.toString() } });
    } catch (err: any) {
      toast.error('Failed to place order', { description: err.message });
    }
  };

  if (cart.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        cartItems={cartItems}
        isCustomerAuthenticated={isCustomerAuthenticated}
        customerName={customer?.name}
        onLogout={logout}
      />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-3xl font-display font-bold text-foreground mb-8 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            Complete Payment
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* UPI Payment Section */}
            <div className={`space-y-6 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
              {/* UPI Card with pulse glow */}
              <div
                className="bg-card rounded-2xl border-2 border-primary/40 p-6 relative overflow-hidden"
                style={!prefersReducedMotion ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-400 to-primary" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-foreground">Pay via UPI</h2>
                    <p className="text-xs text-muted-foreground">Use any UPI app to pay</p>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                    <p className="font-mono font-semibold text-foreground">{UPI_ID}</p>
                  </div>
                  <button
                    onClick={handleCopyUPI}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                      copied
                        ? 'bg-success/20 text-success'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=${UPI_ID}&pn=G%26S%20Medical&am=${total}&cu=INR`}
                    alt="UPI QR Code"
                    className="w-40 h-40 rounded-xl border border-border"
                  />
                </div>

                <p className="text-center text-xs text-muted-foreground mt-3">
                  Scan with any UPI app to pay ₹{prefersReducedMotion ? total : animatedTotal}
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={Number(item.product.id)} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{Number(item.product.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{prefersReducedMotion ? total : animatedTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Details Form */}
            <div className={`${!prefersReducedMotion ? 'animate-slide-in-right' : ''}`}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <h2 className="font-display font-bold text-foreground text-lg">Delivery Details</h2>

                {[
                  { key: 'name', label: 'Full Name', icon: User, placeholder: 'Your full name', type: 'text' },
                  { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '10-digit mobile number', type: 'tel' },
                  { key: 'address', label: 'Delivery Address', icon: MapPin, placeholder: 'Full delivery address', type: 'text' },
                  { key: 'upiRef', label: 'UPI Transaction Reference', icon: CreditCard, placeholder: 'Transaction ID from your UPI app', type: 'text' },
                ].map(({ key, label, icon: Icon, placeholder, type }) => (
                  <div key={key} className="input-animated">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                          errors[key] ? 'border-destructive' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors[key] && (
                      <p className="text-xs text-destructive mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={placeOrderMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
