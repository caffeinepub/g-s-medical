import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../backend';
import type { Product } from '../backend';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    image: ExternalBlob;
    stock: number;
    isAvailable: boolean;
    medicineType: string;
    requiresPrescription: boolean;
  }) => Promise<void>;
  initialData?: Product;
  isLoading?: boolean;
}

const MEDICINE_TYPES = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Other'];
const CATEGORIES = ['Antibiotics', 'Pain Relief', 'Vitamins', 'Diabetes', 'Heart', 'Skin Care', 'Digestive', 'Cold & Flu', 'Eye Care', 'Other'];

export default function ProductForm({ open, onClose, onSubmit, initialData, isLoading }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData ? Number(initialData.price) : 0);
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [stock, setStock] = useState(initialData ? Number(initialData.stock) : 0);
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [medicineType, setMedicineType] = useState(initialData?.medicineType ?? '');
  const [requiresPrescription, setRequiresPrescription] = useState(initialData?.requiresPrescription ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData ? initialData.image.getDirectURL() : ''
  );
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Product name is required'); return; }
    if (!category) { setError('Category is required'); return; }
    if (!medicineType) { setError('Medicine type is required'); return; }
    if (price <= 0) { setError('Price must be greater than 0'); return; }

    let imageBlob: ExternalBlob;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes);
    } else if (initialData) {
      imageBlob = initialData.image;
    } else {
      setError('Please select a product image');
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      price,
      category,
      image: imageBlob,
      stock,
      isAvailable,
      medicineType,
      requiresPrescription,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <Label>Product Image</Label>
            <div
              className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImageFile(null); }}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter product name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Medicine Type *</Label>
              <Select value={medicineType} onValueChange={setMedicineType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICINE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="available"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="available">Available for sale</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="prescription"
                checked={requiresPrescription}
                onCheckedChange={setRequiresPrescription}
              />
              <Label htmlFor="prescription">Requires prescription</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                initialData ? 'Update Product' : 'Add Product'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
