import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Shield, Truck, Clock, Star, ChevronRight, Store } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FloatingShapes from '../components/FloatingShapes';
import TypewriterText from '../components/TypewriterText';
import AnnouncementTicker from '../components/AnnouncementTicker';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { useGetProducts } from '../hooks/useQueries';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Product } from '../backend';

function StatCard({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [ref, visible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const count = useAnimatedCounter(visible ? value : 0, { duration: 1800 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-500 ${visible && !prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
    >
      <div className="text-3xl md:text-4xl font-display font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-white/70 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useGetProducts();
  const { isCustomerAuthenticated, customer, logout } = useCustomerAuth();
  const prefersReducedMotion = useReducedMotion();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const [featuresRef, featuresVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const [productsRef, productsVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });

  const featuredProducts = products.filter((p) => p.isAvailable).slice(0, 8);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
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

      {/* Announcement Ticker */}
      <AnnouncementTicker />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        {/* Background image layer */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/hero-animated-bg.dim_1440x600.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <FloatingShapes />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className={`${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-white/90 text-sm font-medium">Licensed & Verified Pharmacy</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                <TypewriterText
                  text="Your Health, Our Priority"
                  speed={60}
                  className="block"
                />
                <span className="block text-green-300 mt-2 text-3xl md:text-4xl">
                  Genuine Medicines
                </span>
              </h1>

              <p
                className={`text-white/80 text-lg leading-relaxed mb-8 max-w-lg ${!prefersReducedMotion ? 'animate-fade-in-up animate-delay-300' : ''}`}
              >
                G&S Medical brings you authentic, quality-assured medicines and healthcare products
                delivered right to your doorstep.
              </p>

              <div
                className={`flex flex-wrap gap-4 ${!prefersReducedMotion ? 'animate-fade-in-up animate-delay-500' : ''}`}
              >
                {/* CTA with pulse */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                  <button
                    onClick={() => navigate({ to: '/products' })}
                    className="relative flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => navigate({ to: '/about' })}
                  className="flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right - hero image */}
            <div
              className={`hidden lg:flex justify-center ${!prefersReducedMotion ? 'animate-slide-in-right' : ''}`}
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src="/assets/generated/hero-banner.dim_1400x500.png"
                    alt="G&S Medical"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="font-bold text-foreground text-sm">4.9/5 Rating</div>
                      <div className="text-muted-foreground text-xs">10,000+ customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="hero-gradient py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={500} label="Products Available" suffix="+" />
            <StatCard value={10000} label="Happy Customers" suffix="+" />
            <StatCard value={5} label="Years of Service" suffix="+" />
            <StatCard value={99} label="Genuine Products" suffix="%" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={featuresRef}
            className={`text-center mb-12 ${featuresVisible && !prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Why Choose G&S Medical?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best healthcare experience with genuine products and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Genuine Products',
                desc: 'All medicines are sourced directly from licensed manufacturers and distributors.',
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Same-day delivery available for orders placed before 2 PM in select areas.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                desc: 'Our customer care team is available round the clock to assist you.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`bg-card rounded-2xl p-6 border border-border shadow-sm card-hover ${
                    featuresVisible && !prefersReducedMotion ? 'animate-fade-in-up' : ''
                  }`}
                  style={!prefersReducedMotion ? { animationDelay: `${i * 150}ms` } : {}}
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={productsRef}
            className={`flex items-center justify-between mb-10 ${productsVisible && !prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked quality medicines for you</p>
            </div>
            <button
              onClick={() => navigate({ to: '/products' })}
              className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all duration-200"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile: horizontal scroll; Desktop: grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile carousel */}
              <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {featuredProducts.map((product, i) => (
                  <div key={Number(product.id)} className="flex-shrink-0 w-64 snap-start">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      animationDelay={i * 80}
                      visible={productsVisible}
                    />
                  </div>
                ))}
              </div>
              {/* Desktop grid */}
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product, i) => (
                  <ProductCard
                    key={Number(product.id)}
                    product={product}
                    onAddToCart={handleAddToCart}
                    animationDelay={i * 80}
                    visible={productsVisible}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seller Portal Banner */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="/assets/generated/seller-portal-banner.dim_1200x400.png"
              alt="Seller Portal"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Seller Portal</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  Grow Your Business With Us
                </h2>
                <p className="text-white/80 mb-6 max-w-md">
                  Join our network of verified sellers and reach thousands of customers.
                </p>
                <button
                  onClick={() => navigate({ to: '/seller/register' })}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all duration-200 hover:scale-105"
                >
                  Become a Seller
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
