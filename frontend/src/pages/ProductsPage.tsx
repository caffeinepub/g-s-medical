import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Filter, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import type { Product } from '../backend';

export default function ProductsPage() {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);

  const { data: products = [], isLoading } = useGetProducts();
  const { data: categories = [] } = useGetCategories();

  const filtered = products.filter(p => {
    if (!p.isAvailable) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (prescriptionOnly && !p.requiresPrescription) return false;
    return true;
  });

  const getCartQuantity = (productId: number) => {
    const item = cartItems.find(i => i.id === productId);
    return item?.quantity ?? 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      image: product.image.getDirectURL(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Our Products</h1>
        <p className="text-muted-foreground">Browse our wide selection of medicines and healthcare products</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="prescription"
            checked={prescriptionOnly}
            onCheckedChange={setPrescriptionOnly}
          />
          <Label htmlFor="prescription" className="text-sm">Prescription Only</Label>
        </div>

        {(search || selectedCategory || prescriptionOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(''); setSelectedCategory(''); setPrescriptionOnly(false); }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => {
            const qty = getCartQuantity(Number(product.id));
            return (
              <div
                key={Number(product.id)}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-square bg-muted relative">
                  <img
                    src={product.image.getDirectURL()}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                    }}
                  />
                  {product.requiresPrescription && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Rx
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{product.category} · {product.medicineType}</p>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary text-lg">₹{Number(product.price)}</span>
                      <span className="text-xs text-muted-foreground">Stock: {Number(product.stock)}</span>
                    </div>
                    {qty > 0 ? (
                      <div className="flex items-center justify-center gap-2 bg-primary/10 rounded-lg p-1">
                        <span className="text-sm font-medium text-primary">{qty} in cart</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate({ to: '/cart' })}
                          className="text-xs h-7"
                        >
                          View Cart
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock) === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {Number(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
