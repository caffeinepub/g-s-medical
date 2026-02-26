import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useQueries';
import ProductForm from '../components/ProductForm';
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
import type { Product } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (data: {
    name: string; description: string; price: number; category: string;
    image: ExternalBlob; stock: number; isAvailable: boolean;
    medicineType: string; requiresPrescription: boolean;
  }) => {
    try {
      await addProduct.mutateAsync(data);
      toast.success('Product added successfully');
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  const handleEdit = async (data: {
    name: string; description: string; price: number; category: string;
    image: ExternalBlob; stock: number; isAvailable: boolean;
    medicineType: string; requiresPrescription: boolean;
  }) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({ id: Number(editProduct.id), ...data });
      toast.success('Product updated successfully');
      setEditProduct(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={Number(product.id)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image.getDirectURL()}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                          onError={e => {
                            (e.target as HTMLImageElement).src = '/assets/generated/product-placeholder.dim_400x400.png';
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.medicineType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{Number(product.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{Number(product.stock)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(Number(product.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Form */}
      <ProductForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAdd}
        isLoading={addProduct.isPending}
      />

      {/* Edit Form */}
      {editProduct && (
        <ProductForm
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          onSubmit={handleEdit}
          initialData={editProduct}
          isLoading={updateProduct.isPending}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
