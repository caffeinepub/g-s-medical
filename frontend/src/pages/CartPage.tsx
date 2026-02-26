import { useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
        <Button onClick={() => navigate({ to: '/products' })}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                onError={e => {
                  (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{item.name}</h3>
                <p className="text-primary font-bold">₹{item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee === 0 && (
                <p className="text-xs text-green-600">🎉 Free delivery on orders above ₹500!</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate({ to: '/payment' })}
            >
              Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
