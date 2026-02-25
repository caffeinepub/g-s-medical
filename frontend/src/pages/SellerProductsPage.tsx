import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useSellerAuth } from '../hooks/useSellerAuth';
import { useGetSellerProducts, useDeleteSellerProduct } from '../hooks/useQueries';
import SellerProductForm from '../components/SellerProductForm';
import type { Product } from '../backend';

export default function SellerProductsPage() {
  const { session } = useSellerAuth();
  const { data: products, isLoading } = useGetSellerProducts(session?.sellerId || '');
  const deleteProduct = useDeleteSellerProduct();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteTarget || !session) return;
    setDeleting(true);
    try {
      await deleteProduct.mutateAsync({
        sellerId: session.sellerId,
        passwordHash: session.passwordHash,
        productId: deleteTarget.id,
      });
      toast.success('Product deleted');
      setDeleteTarget(null);
    } catch (e: any) {
      const msg = e?.message || 'Failed to delete product';
      toast.error(msg.replace(/.*trap: /, '').replace(/\n.*/, ''));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Products</h1>
          <p className="text-sm text-muted-foreground">Manage your medicine listings</p>
        </div>
        <Button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground font-medium">
            {search ? 'No products match your search' : 'No products yet'}
          </p>
          {!search && (
            <Button
              onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="mt-4 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div key={product.id.toString()} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={product.image.getDirectURL()}
                  alt={product.name}
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant={product.isAvailable ? 'default' : 'secondary'} className="text-xs">
                    {product.isAvailable ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.category} · {product.medicineType}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-primary">₹{Number(product.price)}</span>
                  <span className="text-xs text-muted-foreground">Stock: {Number(product.stock)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-lg"
                    onClick={() => { setEditProduct(product); setShowForm(true); }}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 rounded-lg"
                    onClick={() => setDeleteTarget(product)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      {showForm && session && (
        <SellerProductForm
          product={editProduct}
          sellerId={session.sellerId}
          passwordHash={session.passwordHash}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
