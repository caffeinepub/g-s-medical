import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Product } from '../backend';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { isCustomerAuthenticated, customer, logout } = useCustomerAuth();
  const prefersReducedMotion = useReducedMotion();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const animatedTotal = useAnimatedCounter(total, { duration: 600 });

  const updateQuantity = (productId: bigint, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (productId: bigint) => {
    if (!prefersReducedMotion) {
      setRemovingId(Number(productId));
      setTimeout(() => {
        setCart((prev) => {
          const updated = prev.filter((item) => item.product.id !== productId);
          localStorage.setItem('cart', JSON.stringify(updated));
          return updated;
        });
        setRemovingId(null);
      }, 300);
    } else {
      setCart((prev) => {
        const updated = prev.filter((item) => item.product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const cartItems = cart.map((item) => ({
    id: Number(item.product.id),
    quantity: item.quantity,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        cartItems={cartItems}
        isCustomerAuthenticated={isCustomerAuthenticated}
        customerName={customer?.name}
        onLogout={logout}
      />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className={`text-3xl font-display font-bold text-foreground mb-8 ${!prefersReducedMotion && mounted ? 'animate-fade-in-up' : ''}`}
          >
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div
              className={`text-center py-20 ${!prefersReducedMotion && mounted ? 'animate-fade-in-up' : ''}`}
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <button
                onClick={() => navigate({ to: '/products' })}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, i) => (
                  <div
                    key={Number(item.product.id)}
                    className={`bg-card rounded-2xl border border-border p-4 flex gap-4 transition-all duration-300 ${
                      removingId === Number(item.product.id)
                        ? 'opacity-0 -translate-x-8'
                        : !prefersReducedMotion && mounted
                        ? 'animate-slide-in-right'
                        : ''
                    }`}
                    style={!prefersReducedMotion ? { animationDelay: `${i * 80}ms` } : {}}
                  >
                    <img
                      src={item.product.image.getDirectURL()}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.product.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">
                            ₹{Number(item.product.price) * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div
                className={`${!prefersReducedMotion && mounted ? 'animate-slide-in-right animate-delay-300' : ''}`}
              >
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h2 className="font-display font-bold text-foreground text-lg mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={Number(item.product.id)} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-foreground flex-shrink-0">
                          ₹{Number(item.product.price) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{prefersReducedMotion ? total : animatedTotal}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate({ to: '/payment' })}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-all hover:scale-105 hover:shadow-lg"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
