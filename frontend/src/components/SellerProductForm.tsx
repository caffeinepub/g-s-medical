import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import type { Product } from '../backend';
import { useAddSellerProduct, useUpdateSellerProduct } from '../hooks/useQueries';

interface SellerProductFormProps {
  product: Product | null;
  sellerId: string;
  passwordHash: string;
  onClose: () => void;
}

const MEDICINE_TYPES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Other'];

export default function SellerProductForm({ product, sellerId, passwordHash, onClose }: SellerProductFormProps) {
  const addProduct = useAddSellerProduct();
  const updateProduct = useUpdateSellerProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? Number(product.price).toString() : '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [stock, setStock] = useState(product ? Number(product.stock).toString() : '');
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [medicineType, setMedicineType] = useState(product?.medicineType ?? 'Tablet');
  const [requiresPrescription, setRequiresPrescription] = useState(product?.requiresPrescription ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product ? product.image.getDirectURL() : '',
  );
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category.trim() || !stock) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        sellerId,
        passwordHash,
        name,
        description,
        price: BigInt(Math.round(Number(price))),
        category,
        imageFile,
        imageUrl: product ? product.image.getDirectURL() : '/assets/generated/product-placeholder.dim_400x400.png',
        stock: BigInt(Math.round(Number(stock))),
        isAvailable,
        medicineType,
        requiresPrescription,
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...payload });
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync(payload);
        toast.success('Product added successfully');
      }
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save product';
      const cleanMsg = msg.replace(/.*trap: /, '').replace(/\n.*/, '');
      toast.error(cleanMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full h-full md:h-auto md:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-32 mx-auto object-contain rounded" />
              ) : (
                <div className="py-4">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paracetamol 500mg" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Pain Relief" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicine-type">Medicine Type</Label>
              <Select value={medicineType} onValueChange={setMedicineType}>
                <SelectTrigger id="medicine-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDICINE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 flex-1">
              <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <div>
                <Label htmlFor="available" className="cursor-pointer font-medium">Available for Sale</Label>
                <p className="text-xs text-muted-foreground">Show this product to customers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 flex-1">
              <Switch id="prescription" checked={requiresPrescription} onCheckedChange={setRequiresPrescription} />
              <div>
                <Label htmlFor="prescription" className="cursor-pointer font-medium">Requires Prescription</Label>
                <p className="text-xs text-muted-foreground">Customer must provide prescription</p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{product ? 'Updating...' : 'Adding...'}</>
              ) : (
                product ? 'Update Medicine' : 'Add Medicine'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
