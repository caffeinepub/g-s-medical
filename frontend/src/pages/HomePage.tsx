import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Star, Shield, Truck, Phone, ChevronRight, Pill, Heart, Award, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetProducts } from '../hooks/useQueries';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading } = useGetProducts();
  const { isCustomerAuthenticated } = useCustomerAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {}
    }
  }, []);

  const addToCart = (product: any) => {
    const imageUrl = product.image?.getDirectURL?.() || '/assets/generated/product-placeholder.dim_400x400.png';
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(item => item.productId === Number(product.id));
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({
        productId: Number(product.id),
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: imageUrl,
      });
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setAddedToCart(Number(product.id));
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const featuredProducts = products.filter(p => p.isAvailable).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hero-animated-bg.dim_1440x600.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                🏥 Trusted Medical Store
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                G&S <span className="text-primary">Medical</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                G&S Medical brings you authentic medicines, surgical supplies, and healthcare products.
                Quality you can trust, delivered with care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/products' })}
                  className="gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/contact' })}
                  className="gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Contact Us
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">Products</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-xs text-muted-foreground">Customers</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5★</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="/assets/generated/hero-banner.dim_1400x500.png"
                alt="G&S Medical Store"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">100% Authentic</div>
                    <div className="text-xs text-muted-foreground">Verified Products</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Fast Delivery</div>
                    <div className="text-xs text-muted-foreground">Same Day Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose G&S Medical?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are committed to providing the best healthcare products with unmatched service quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Authentic Products',
                desc: 'All medicines and products are sourced directly from certified manufacturers.',
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-950/30',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Quick and reliable delivery to your doorstep with real-time tracking.',
                color: 'text-green-600',
                bg: 'bg-green-50 dark:bg-green-950/30',
              },
              {
                icon: Heart,
                title: 'Expert Guidance',
                desc: 'Our trained pharmacists are available to help you choose the right products.',
                color: 'text-red-500',
                bg: 'bg-red-50 dark:bg-red-950/30',
              },
              {
                icon: Award,
                title: 'Best Prices',
                desc: 'Competitive pricing on all products with regular discounts and offers.',
                color: 'text-amber-600',
                bg: 'bg-amber-50 dark:bg-amber-950/30',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Explore our most popular healthcare products</p>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: '/products' })} className="gap-2 hidden md:flex">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-xl h-64" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.map(product => {
                const imageUrl = product.image?.getDirectURL?.() || '/assets/generated/product-placeholder.dim_400x400.png';
                return (
                  <div
                    key={Number(product.id)}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                    onClick={() => navigate({ to: '/products' })}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.requiresPrescription && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Rx</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-sm">₹{Number(product.price)}</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">4.5</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2 text-xs h-7"
                        onClick={e => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        {addedToCart === Number(product.id) ? '✓ Added' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" onClick={() => navigate({ to: '/products' })} className="gap-2">
              View All Products <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Seller Portal Banner */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/assets/generated/seller-portal-banner.dim_1200x400.png"
              alt="Seller Portal"
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="px-8 md:px-12 space-y-4">
                <Badge variant="secondary" className="text-sm">New Feature</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Become a Seller</h2>
                <p className="text-white/80 max-w-md text-sm md:text-base">
                  Join our platform and reach thousands of customers. Register your medical store today.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => navigate({ to: '/seller/register' })}
                >
                  <Store className="w-5 h-5" />
                  Register as Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Browse our complete catalog of medicines and healthcare products. Fast delivery, authentic products.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate({ to: '/products' })}
              className="gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/contact' })}
              className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
