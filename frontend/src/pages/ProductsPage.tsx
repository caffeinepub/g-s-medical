import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Product } from '../backend';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const { isCustomerAuthenticated, customer, logout } = useCustomerAuth();
  const prefersReducedMotion = useReducedMotion();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  const [stickyBar, setStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setStickyBar(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    const matchPrescription = !showPrescriptionOnly || p.requiresPrescription;
    return matchSearch && matchCategory && matchPrescription;
  });

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

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setShowPrescriptionOnly(false);
  };

  const hasFilters = search || selectedCategory || showPrescriptionOnly;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        cartItems={cartItems}
        isCustomerAuthenticated={isCustomerAuthenticated}
        customerName={customer?.name}
        onLogout={logout}
      />

      {/* Page Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/20 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Our Products
            </h1>
            <p className="text-muted-foreground">
              Browse our complete range of genuine medicines and healthcare products
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div
        className={`sticky top-16 z-30 bg-card/95 backdrop-blur-md border-b border-border transition-all duration-300 ${
          stickyBar ? 'shadow-md' : ''
        } ${!prefersReducedMotion ? 'animate-slide-down' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm bg-background border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Prescription toggle */}
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={showPrescriptionOnly}
                onChange={(e) => setShowPrescriptionOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Rx Only
            </label>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-destructive hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💊</div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="text-primary hover:underline font-medium">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product, i) => (
                <ProductCard
                  key={Number(product.id)}
                  product={product}
                  onAddToCart={handleAddToCart}
                  animationDelay={Math.min(i * 60, 600)}
                  visible={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
